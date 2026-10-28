"""app/ 폴더의 소스 파일을 k8s/configmap.yaml 로 묶어 주는 스크립트.

이미지를 빌드하지 않기 때문에 서버 코드와 게임 파일은 ConfigMap으로 Pod에 주입된다.
app/ 아래 파일을 수정했다면 이 스크립트를 다시 실행한 뒤 oc apply 하면 된다.

    python build_configmap.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
STUDENT_DIR = os.path.basename(HERE)   # 학번 폴더 이름
REPO = "oxomi/pixel-cv-quest"
# 포스터/영상은 ConfigMap에 넣기엔 커서 Git 저장소에 두고 jsDelivr CDN으로 불러온다
MEDIA_BASE = "https://cdn.jsdelivr.net/gh/%s@main/students/%s/media/" % (REPO, STUDENT_DIR)
LABELS = {"app": "pixel-cv", "app.kubernetes.io/part-of": "pixel-cv"}

# 게임 규칙/접속 정보처럼 코드와 분리된 설정값 (envFrom 으로 환경변수가 됨)
CONFIG = {
    "REDIS_HOST": "pixel-cv-redis",
    "REDIS_PORT": "6379",
    "PORT": "8080",
    "STATIC_DIR": "/opt/app-root/static",
    "PYTHONUNBUFFERED": "1",
    "POINTS_PER_VISIT": "10",
    "GUESTBOOK_COST": "30",
    "RATING_COST": "20",
    "MEDIA_BASE": MEDIA_BASE,
    "VIDEO_URL": MEDIA_BASE + "capstone-video.mp4",
}


def header(name, comment):
    lines = ["# " + comment, "apiVersion: v1", "kind: ConfigMap", "metadata:",
             "  name: " + name, "  labels:"]
    lines += ["    %s: %s" % kv for kv in LABELS.items()]
    return lines + ["data:"]


def file_block(key, path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if "\t" in text:
        raise SystemExit("%s: 탭 문자는 YAML 블록에 넣지 않도록 공백으로 바꿔 주세요." % path)
    body = ["    " + line if line else "" for line in text.rstrip("\n").split("\n")]
    return ["  %s: |" % key] + body


def main():
    docs = []
    cfg = header("pixel-cv-config", "게임 규칙과 접속 정보 (환경변수로 주입)")
    cfg += ['  %s: "%s"' % kv for kv in CONFIG.items()]
    docs.append(cfg)

    code = header("pixel-cv-code", "API 서버 코드 (자동 생성: build_configmap.py)")
    code += file_block("server.py", os.path.join(HERE, "app", "server.py"))
    docs.append(code)

    static = header("pixel-cv-static", "게임 화면 HTML/JS와 전시물 문서 (자동 생성: build_configmap.py)")
    for name in ("index.html", "game.js", "content.js"):
        static += file_block(name, os.path.join(HERE, "app", "static", name))
    docs.append(static)

    # oc apply(client-side)는 last-applied 주석에 오브젝트 전체를 저장하므로 오브젝트당 256KB를 넘으면 실패한다
    for d in docs:
        kb = len("\n".join(d).encode("utf-8")) / 1024
        print("  %-16s %6.1f KB" % (d[4].split(": ")[1], kb))
        if kb > 200:
            raise SystemExit("ConfigMap이 너무 큽니다. 오브젝트당 200KB 이하로 줄여 주세요.")

    out = os.path.join(HERE, "k8s", "configmap.yaml")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n---\n".join("\n".join(d) for d in docs) + "\n")
    print("wrote k8s/configmap.yaml")


if __name__ == "__main__":
    main()
