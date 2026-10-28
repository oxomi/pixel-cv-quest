"""소미의 CV 밸리 - G(포인트) / 방명록 / 별점 / 꽃밭 / 낚시 API 서버.

외부 패키지 없이 Python 표준 라이브러리만 사용한다.
(이미지를 따로 빌드하지 않고 ConfigMap으로 이 파일을 주입하기 위해서)
Redis는 RESP 프로토콜을 직접 구현한 작은 클라이언트로 접속한다.
REDIS_HOST가 비어 있으면 메모리 저장소로 동작한다 (로컬 테스트용).
"""
import json
import os
import random
import re
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", "8080"))
STATIC_DIR = os.environ.get("STATIC_DIR", os.path.join(os.path.dirname(__file__), "static"))
REDIS_HOST = os.environ.get("REDIS_HOST", "")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD", "")
POINTS_PER_VISIT = int(os.environ.get("POINTS_PER_VISIT", "10"))
GUESTBOOK_COST = int(os.environ.get("GUESTBOOK_COST", "30"))
RATING_COST = int(os.environ.get("RATING_COST", "20"))
FLOWER_COST = int(os.environ.get("FLOWER_COST", "15"))
BAIT_COST = int(os.environ.get("BAIT_COST", "10"))
SPOT_IDS = set(os.environ.get("SPOT_IDS", ",".join([
    "guide", "senior", "teammate", "mc", "scientist", "cat", "fisher", "gardener",
    "home_summary", "ws_summary", "ext_summary", "clubs",
    "home_profile", "home_skills", "home_github", "lab_intro", "lab_isaac", "lab_ros", "lab_vla",
    "cap_trophy", "cap_poster", "cap_data", "cap_policy", "cap_video",
    "ws_ongi", "ws_pc", "ws_praise", "ws_pnu", "ws_pnuin", "ws_db", "dcc_intro", "dcc_seg", "dcc_chimney",
])).split(","))
MEDIA_BASE = os.environ.get("MEDIA_BASE", "/media/")
VIDEO_URL = os.environ.get("VIDEO_URL", MEDIA_BASE + "capstone-video.mp4")
# 로컬 개발용: MEDIA_BASE가 /media/ 이면 이 폴더의 파일을 직접 서빙한다
MEDIA_DIR = os.environ.get("MEDIA_DIR", os.path.join(os.path.dirname(__file__), "..", "media"))
MEDIA_TYPES = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4"}
GUESTBOOK_MAX = 200

# 방문자 꽃밭: 마을 밭 21칸 (game.js의 밭 좌표와 같다)
PLOTS = {"%d,%d" % (x, y) for x in range(4, 11) for y in range(13, 16)}
FLOWER_KINDS = {"tulip", "rose", "sunflower", "lavender", "daisy", "sakura"}

# 연못 물고기: id, 이름, 이모지, 최소 cm, 최대 cm, 가중치, 등급
FISH = [
    ("minnow", "피라미", "🐟", 5, 12, 40, "흔함"),
    ("crucian", "붕어", "🐠", 10, 28, 30, "흔함"),
    ("carp", "잉어", "🎏", 30, 75, 14, "보통"),
    ("catfish", "메기", "🐡", 40, 95, 8, "보통"),
    ("goldfish", "금붕어", "🌟", 6, 16, 4, "희귀"),
    ("sakura", "벚꽃 송어", "🌸", 30, 60, 3, "희귀"),
    ("golden", "황금 잉어", "👑", 60, 110, 0.8, "전설"),
    ("robot", "로봇 물고기 SO-101", "🤖", 101, 101, 0.2, "전설"),
]


def roll_fish(accuracy):
    """물고기 종류와 크기를 서버에서 뽑는다. 타이밍이 정확할수록 희귀하고 큰 물고기가 잘 나온다."""
    boost = {"희귀": 1 + 2 * accuracy, "전설": 1 + 3 * accuracy}
    f = random.choices(FISH, [x[5] * boost.get(x[6], 1) for x in FISH])[0]
    size = f[3] + (f[4] - f[3]) * random.random() ** (1.4 - 0.8 * accuracy)
    return {"id": f[0], "name": f[1], "emoji": f[2], "rarity": f[6], "size": round(size, 1)}

PLAYER_RE = re.compile(r"^[A-Za-z0-9-]{8,64}$")
CONTENT_TYPES = {".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
                 ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml"}


class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


# ---------------------------------------------------------------- Redis client
class Redis:
    """RESP2 프로토콜만 구현한 최소한의 Redis 클라이언트 (연결 1개 + 락)."""

    def __init__(self, host, port, password):
        self.host, self.port, self.password = host, port, password
        self.sock = None
        self.buf = b""
        self.lock = threading.Lock()

    def _connect(self):
        self.sock = socket.create_connection((self.host, self.port), timeout=3)
        self.buf = b""
        if self.password:
            self._send("AUTH", self.password)
            self._read()

    def _send(self, *args):
        out = [b"*%d\r\n" % len(args)]
        for a in args:
            a = a if isinstance(a, bytes) else str(a).encode()
            out.append(b"$%d\r\n%s\r\n" % (len(a), a))
        self.sock.sendall(b"".join(out))

    def _line(self):
        while b"\r\n" not in self.buf:
            chunk = self.sock.recv(65536)
            if not chunk:
                raise ConnectionError("redis closed connection")
            self.buf += chunk
        line, self.buf = self.buf.split(b"\r\n", 1)
        return line

    def _exact(self, n):
        while len(self.buf) < n + 2:
            chunk = self.sock.recv(65536)
            if not chunk:
                raise ConnectionError("redis closed connection")
            self.buf += chunk
        data, self.buf = self.buf[:n], self.buf[n + 2:]
        return data

    def _read(self):
        line = self._line()
        kind, rest = line[:1], line[1:]
        if kind == b"+":
            return rest.decode()
        if kind == b"-":
            raise RuntimeError("redis error: " + rest.decode())
        if kind == b":":
            return int(rest)
        if kind == b"$":
            n = int(rest)
            return None if n < 0 else self._exact(n).decode()
        if kind == b"*":
            n = int(rest)
            return None if n < 0 else [self._read() for _ in range(n)]
        raise RuntimeError("unknown redis reply: %r" % line)

    def call(self, *args):
        with self.lock:
            for attempt in range(2):
                try:
                    if self.sock is None:
                        self._connect()
                    self._send(*args)
                    return self._read()
                except (OSError, ConnectionError):
                    self.sock = None
                    if attempt:
                        raise


# 포인트 차감을 원자적으로 처리하는 Lua 스크립트
SPEND_LUA = """
local p = tonumber(redis.call('GET', KEYS[1]) or '0')
local cost = tonumber(ARGV[1])
if p < cost then return -1 end
return redis.call('DECRBY', KEYS[1], cost)
"""
RATE_LUA = """
if redis.call('HEXISTS', KEYS[2], ARGV[2]) == 1 then return -2 end
local p = tonumber(redis.call('GET', KEYS[1]) or '0')
local cost = tonumber(ARGV[1])
if p < cost then return -1 end
redis.call('HSET', KEYS[2], ARGV[2], ARGV[3])
return redis.call('DECRBY', KEYS[1], cost)
"""


class RedisStore:
    def __init__(self, client):
        self.r = client

    def ping(self):
        return self.r.call("PING") == "PONG"

    def points(self, player):
        return int(self.r.call("GET", "player:%s:points" % player) or 0)

    def visited(self, player):
        return sorted(self.r.call("SMEMBERS", "player:%s:visited" % player) or [])

    def award_visit(self, player, spot):
        added = self.r.call("SADD", "player:%s:visited" % player, spot)
        if added:
            self.r.call("INCRBY", "player:%s:points" % player, POINTS_PER_VISIT)
        return bool(added)

    def spend(self, player, cost):
        return self.r.call("EVAL", SPEND_LUA, 1, "player:%s:points" % player, cost)

    def add_entry(self, entry):
        self.r.call("LPUSH", "guestbook", json.dumps(entry, ensure_ascii=False))
        self.r.call("LTRIM", "guestbook", 0, GUESTBOOK_MAX - 1)

    def entries(self):
        return [json.loads(x) for x in self.r.call("LRANGE", "guestbook", 0, 49) or []]

    def my_rating(self, player):
        v = self.r.call("HGET", "ratings", player)
        return int(v) if v else None

    def rate(self, player, stars):
        return self.r.call("EVAL", RATE_LUA, 2, "player:%s:points" % player, "ratings",
                           RATING_COST, player, stars)

    def rating_stats(self):
        vals = [int(v) for v in self.r.call("HVALS", "ratings") or []]
        return vals

    def plant(self, player, plot, flower):
        # 별점과 같은 Lua: 칸이 비어 있고 G가 충분할 때만 심고 차감 (원자적)
        return self.r.call("EVAL", RATE_LUA, 2, "player:%s:points" % player, "garden",
                           FLOWER_COST, plot, json.dumps(flower, ensure_ascii=False))

    def garden(self):
        flat = self.r.call("HGETALL", "garden") or []
        return {flat[i]: json.loads(flat[i + 1]) for i in range(0, len(flat), 2)}

    def record_fish(self, player, name, fish):
        dex = "player:%s:fishdex" % player
        best = self.r.call("HGET", dex, fish["id"])
        if best is None or float(best) < fish["size"]:
            self.r.call("HSET", dex, fish["id"], fish["size"])
        top = self.r.call("ZSCORE", "fish:rank", player)
        record = top is None or float(top) < fish["size"]
        if record:   # 랭킹은 Sorted Set: 플레이어별 최고 기록(cm)을 점수로
            self.r.call("ZADD", "fish:rank", fish["size"], player)
            self.r.call("HSET", "fish:who", player, json.dumps({"name": name, "fish": fish}, ensure_ascii=False))
        return record

    def fish_dex(self, player):
        flat = self.r.call("HGETALL", "player:%s:fishdex" % player) or []
        return {flat[i]: float(flat[i + 1]) for i in range(0, len(flat), 2)}

    def fish_rank(self, n=10):
        players = (self.r.call("ZREVRANGE", "fish:rank", 0, n - 1) or [])
        if not players:
            return []
        infos = self.r.call("HMGET", "fish:who", *players)
        return [(p, json.loads(i)) for p, i in zip(players, infos) if i]


class MemoryStore:
    """REDIS_HOST가 없을 때 쓰는 메모리 저장소 (재시작하면 초기화됨)."""

    def __init__(self):
        self.lock = threading.Lock()
        self.pts, self.seen, self.book, self.ratings = {}, {}, [], {}
        self.flowers, self.dex, self.rank = {}, {}, {}

    def ping(self):
        return True

    def points(self, player):
        return self.pts.get(player, 0)

    def visited(self, player):
        return sorted(self.seen.get(player, set()))

    def award_visit(self, player, spot):
        with self.lock:
            s = self.seen.setdefault(player, set())
            if spot in s:
                return False
            s.add(spot)
            self.pts[player] = self.pts.get(player, 0) + POINTS_PER_VISIT
            return True

    def spend(self, player, cost):
        with self.lock:
            p = self.pts.get(player, 0)
            if p < cost:
                return -1
            self.pts[player] = p - cost
            return p - cost

    def add_entry(self, entry):
        with self.lock:
            self.book.insert(0, entry)
            del self.book[GUESTBOOK_MAX:]

    def entries(self):
        return self.book[:50]

    def my_rating(self, player):
        return self.ratings.get(player)

    def rate(self, player, stars):
        with self.lock:
            if player in self.ratings:
                return -2
            p = self.pts.get(player, 0)
            if p < RATING_COST:
                return -1
            self.ratings[player] = stars
            self.pts[player] = p - RATING_COST
            return p - RATING_COST

    def rating_stats(self):
        return list(self.ratings.values())

    def plant(self, player, plot, flower):
        with self.lock:
            if plot in self.flowers:
                return -2
            p = self.pts.get(player, 0)
            if p < FLOWER_COST:
                return -1
            self.flowers[plot] = flower
            self.pts[player] = p - FLOWER_COST
            return p - FLOWER_COST

    def garden(self):
        return dict(self.flowers)

    def record_fish(self, player, name, fish):
        with self.lock:
            dex = self.dex.setdefault(player, {})
            dex[fish["id"]] = max(dex.get(fish["id"], 0), fish["size"])
            top = self.rank.get(player)
            record = top is None or top[0] < fish["size"]
            if record:
                self.rank[player] = (fish["size"], {"name": name, "fish": fish})
            return record

    def fish_dex(self, player):
        return dict(self.dex.get(player, {}))

    def fish_rank(self, n=10):
        rows = sorted(self.rank.items(), key=lambda kv: -kv[1][0])[:n]
        return [(p, info) for p, (size, info) in rows]


store = RedisStore(Redis(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)) if REDIS_HOST else MemoryStore()


# ---------------------------------------------------------------- API
def check_player(player):
    if not isinstance(player, str) or not PLAYER_RE.match(player):
        raise ApiError(400, "잘못된 플레이어 ID입니다.")
    return player


def rating_summary():
    vals = store.rating_stats()
    return {"avg": round(sum(vals) / len(vals), 2) if vals else 0, "count": len(vals)}


def state(player):
    return {
        "points": store.points(player),
        "visited": store.visited(player),
        "myRating": store.my_rating(player),
        "rating": rating_summary(),
        "costs": {"guestbook": GUESTBOOK_COST, "rating": RATING_COST, "visit": POINTS_PER_VISIT,
                  "flower": FLOWER_COST, "bait": BAIT_COST},
        "spotCount": len(SPOT_IDS),
        "media": {"base": MEDIA_BASE, "video": VIDEO_URL},
        "storage": "redis" if REDIS_HOST else "memory",
    }


def api_visit(body):
    player = check_player(body.get("player"))
    spot = body.get("spot")
    if spot not in SPOT_IDS:
        raise ApiError(400, "모르는 장소입니다.")
    awarded = store.award_visit(player, spot)
    return dict(state(player), awarded=POINTS_PER_VISIT if awarded else 0)


def clean_name(value):
    name = str(value or "").strip()[:12]
    if not name:
        raise ApiError(400, "이름(닉네임)을 적어 주세요.")
    return name


def api_plant(body):
    player = check_player(body.get("player"))
    try:
        plot = "%d,%d" % (int(body.get("x")), int(body.get("y")))
    except (TypeError, ValueError):
        plot = ""
    if plot not in PLOTS:
        raise ApiError(400, "꽃은 마을 꽃밭에만 심을 수 있어요.")
    kind = body.get("kind")
    if kind not in FLOWER_KINDS:
        raise ApiError(400, "모르는 꽃 씨앗이에요.")
    result = store.plant(player, plot, {"name": clean_name(body.get("name")), "kind": kind, "ts": int(time.time())})
    if result == -2:
        raise ApiError(409, "이미 다른 방문자의 꽃이 피어 있어요! 빈 칸을 골라 주세요.")
    if result < 0:
        raise ApiError(402, "씨앗을 살 G가 부족해요. 집 안 전시물을 읽고 G를 모아 보세요!")
    return dict(state(player), plots=store.garden())


def fishing(player):
    return {
        "dex": store.fish_dex(player),
        "rank": [dict(info, me=(p == player)) for p, info in store.fish_rank()],
        "species": [{"id": f[0], "name": f[1], "emoji": f[2], "rarity": f[6]} for f in FISH],
    }


def api_fish(body):
    player = check_player(body.get("player"))
    name = clean_name(body.get("name"))
    try:
        accuracy = max(0.0, min(1.0, float(body.get("accuracy", 0))))
    except (TypeError, ValueError):
        accuracy = 0.0
    if store.spend(player, BAIT_COST) < 0:
        raise ApiError(402, "미끼를 살 G가 부족해요. 집 안 전시물을 읽고 G를 모아 보세요!")
    fish = roll_fish(accuracy)
    record = store.record_fish(player, name, fish)
    return dict(state(player), fish=fish, record=record, **fishing(player))


def api_guestbook(body):
    player = check_player(body.get("player"))
    name = str(body.get("name", "")).strip()[:20]
    message = str(body.get("message", "")).strip()[:200]
    if not name or not message:
        raise ApiError(400, "이름과 메시지를 모두 적어 주세요.")
    if store.spend(player, GUESTBOOK_COST) < 0:
        raise ApiError(402, "G가 부족해요. 집 안 전시물을 읽고 G를 모아 보세요!")
    store.add_entry({"name": name, "message": message, "ts": int(time.time())})
    return dict(state(player), entries=store.entries())


def api_rating(body):
    player = check_player(body.get("player"))
    try:
        stars = int(body.get("stars"))
    except (TypeError, ValueError):
        stars = 0
    if not 1 <= stars <= 5:
        raise ApiError(400, "별점은 1~5 사이로 골라 주세요.")
    result = store.rate(player, stars)
    if result == -2:
        raise ApiError(409, "이미 별점을 남겼어요. 감사합니다!")
    if result < 0:
        raise ApiError(402, "G가 부족해요. 집 안 전시물을 읽고 G를 모아 보세요!")
    return state(player)


class Handler(BaseHTTPRequestHandler):
    server_version = "PixelCV/1.0"

    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args), flush=True)

    def _json(self, status, payload):
        data = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _guard(self, fn):
        try:
            self._json(200, fn())
        except ApiError as e:
            self._json(e.status, {"error": e.message})
        except Exception as e:  # Redis 장애 등
            print("ERROR", repr(e), flush=True)
            self._json(503, {"error": "서버(DB) 연결에 문제가 있어요. 잠시 후 다시 시도해 주세요."})

    def do_GET(self):
        url = urlparse(self.path)
        q = parse_qs(url.query)
        if url.path == "/alive":
            return self._json(200, {"status": "ok"})
        if url.path == "/health":
            try:
                store.ping()
                return self._json(200, {"status": "ok", "storage": "redis" if REDIS_HOST else "memory"})
            except Exception as e:
                return self._json(503, {"status": "redis unavailable", "error": repr(e)})
        if url.path == "/api/state":
            return self._guard(lambda: state(check_player(q.get("player", [""])[0])))
        if url.path == "/api/guestbook":
            return self._guard(lambda: {"entries": store.entries()})
        if url.path == "/api/garden":
            return self._guard(lambda: {"plots": store.garden()})
        if url.path == "/api/fishing":
            return self._guard(lambda: fishing(check_player(q.get("player", [""])[0])))
        return self._static(url.path)

    def do_POST(self):
        routes = {"/api/visit": api_visit, "/api/guestbook": api_guestbook, "/api/rating": api_rating,
                  "/api/plant": api_plant, "/api/fish": api_fish}
        fn = routes.get(urlparse(self.path).path)
        if not fn:
            return self._json(404, {"error": "not found"})
        try:
            length = min(int(self.headers.get("Content-Length", 0)), 8192)
            body = json.loads(self.rfile.read(length) or b"{}")
            if not isinstance(body, dict):
                raise ValueError
        except ValueError:
            return self._json(400, {"error": "잘못된 요청입니다."})
        self._guard(lambda: fn(body))

    def _media(self, name):
        """로컬 개발용 미디어 서빙 (클러스터에서는 MEDIA_BASE가 외부 CDN을 가리킨다)."""
        ext = os.path.splitext(name)[1]
        if "/" in name or name.startswith(".") or ext not in MEDIA_TYPES:
            return self._json(404, {"error": "not found"})
        try:
            with open(os.path.join(MEDIA_DIR, name), "rb") as f:
                data = f.read()
        except OSError:
            return self._json(404, {"error": "not found"})
        self.send_response(200)
        self.send_header("Content-Type", MEDIA_TYPES[ext])
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _static(self, path):
        if path.startswith("/media/"):
            return self._media(path[len("/media/"):])
        name = "index.html" if path in ("", "/") else path.lstrip("/")
        # ConfigMap 마운트에는 ..data 같은 심볼릭 링크가 있으므로 허용 목록으로만 서빙한다
        if "/" in name or name.startswith(".") or os.path.splitext(name)[1] not in CONTENT_TYPES:
            return self._json(404, {"error": "not found"})
        try:
            with open(os.path.join(STATIC_DIR, name), "rb") as f:
                data = f.read()
        except OSError:
            return self._json(404, {"error": "not found"})
        self.send_response(200)
        self.send_header("Content-Type", CONTENT_TYPES[os.path.splitext(name)[1]])
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    print("Pixel CV Quest listening on :%d (storage=%s)" % (PORT, "redis" if REDIS_HOST else "memory"), flush=True)
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
