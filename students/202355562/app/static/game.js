/* 소미의 CV 밸리 — 걸어 다니며 읽는 픽셀 이력서
 * 외부 라이브러리 없이 Canvas로 그린다. 모든 그래픽은 이 파일 안의 코드/문자열 픽셀 맵으로 생성한다.
 */
(() => {
  'use strict';

  const T = 16, VW = 320, VH = 180, S = 4;   // 타일 크기, 화면(논리 픽셀), 확대 배율
  const canvas = document.getElementById('game');
  canvas.width = VW * S;
  canvas.height = VH * S;
  const ctx = canvas.getContext('2d');
  const $ = (id) => document.getElementById(id);
  const FONT = '"Galmuri11", "Malgun Gothic", sans-serif';

  // ================================================================ 공통 유틸
  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }
  const px = (g, c, x, y, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  function blob(g, cx, cy, r, c) {
    g.fillStyle = c;
    for (let dy = -r; dy <= r; dy++) {
      const w = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.6));
      g.fillRect(cx - w, cy + dy, w * 2 + 1, 1);
    }
  }
  function makeCanvas(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    draw(g);
    return c;
  }
  function sprite(rows, pal, flip = false) {
    const w = rows[0].length;
    return makeCanvas(w, rows.length, (g) => rows.forEach((row, y) => {
      if (row.length !== w) console.warn('sprite row length', row);
      for (let x = 0; x < w; x++) {
        const ch = row[flip ? w - 1 - x : x];
        if (pal[ch]) px(g, pal[ch], x, y);
      }
    }));
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ================================================================ 캐릭터 스프라이트 (16×24)
  // 주인공: 검은 긴 레이어드 머리 + 시스루 앞머리, 회색 니트 카라 가디건, 핑크 스커트
  const PAL_ME = {
    k: '#1d1b26', K: '#45425a', s: '#f9dccb', e: '#2a1c1c', w: '#ffffff', c: '#f5a3b5', m: '#e07a8c',
    l: '#b4aebb', g: '#8f8996', G: '#6c6674', b: '#2c2a31', r: '#f08cb0', R: '#d8668f', o: '#fff7f2', f: '#6b3f45',
  };
  const HEAD = [
    '......kkkk......',
    '....kkkkkkkk....',
    '...kkkkkkkKkk...',
    '..kkkkkkkkkKkk..',
    '..kkkkkkkkkkkk..',
  ];
  const ME_DOWN = HEAD.concat([
    '..kk' + 'kkkskkkk' + 'kk..',
    '..kk' + 'kskkskks' + 'kk..',
    '..kk' + 'seessees' + 'kk..',
    '..kk' + 'cewssewc' + 'kk..',
    '..kk' + 'sssmmsss' + 'kk..',
    '..kkk' + 'ssssss' + 'kkk..',
    '.kkkkk' + 'ssss' + 'kkkkk.',
    '.kkk' + 'llgssgll' + 'kkk.',
    '.kkG' + 'gggbgggg' + 'Gkk.',
    '.kkG' + 'gggggggg' + 'Gkk.',
    '.kkG' + 'gggbgggg' + 'Gkk.',
    '..sG' + 'gggggggg' + 'Gs..',
    '...G' + 'gggggggg' + 'G...',
    '...r' + 'rrRrrRrr' + 'r...',
    '..rr' + 'rRrrrrRr' + 'rr..',
  ]);
  const ME_UP = HEAD.concat([
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkKkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '.kkkkkkkkkkkkkk.',
    '.kkkkkkkkkkkkkk.',
    '.kGkkkkkkkkkkGk.',
    '.kGgkkkkkkkkgGk.',
    '.kGggkkkkkkggGk.',
    '..sGggkkkkggGs..',
    '...GgggkkgggG...',
    '...r' + 'rrRrrRrr' + 'r...',
    '..rr' + 'rRrrrrRr' + 'rr..',
  ]);
  const ME_LEFT = HEAD.concat([
    '..kskkkkkkkkkk..',
    '..' + 'sskkkkkkkkkkk' + '.',
    '..' + 'sewskkkkkkkkk' + '.',
    '..' + 'cssskkkkkkkkk' + '.',
    '..' + 'smsskkkkkkkkk' + '.',
    '...' + 'ssssskkkkkkk' + '.',
    '....' + 'ssskkkkkkkk' + '.',
    '....' + 'lggkkkkkkkk' + '.',
    '...' + 'gggggkkkkkkk' + '.',
    '...' + 'ggggggkkkkkk' + '.',
    '...' + 'sgggggGkkkkk' + '.',
    '....' + 'gggggGkkkk' + '..',
    '....' + 'GggggggG' + '....',
    '....' + 'rrRrrRrr' + '....',
    '...' + 'rrRrrrrRrr' + '...',
  ]);
  const LEGS_FRONT = [
    ['....ss....ss....', '....oo....oo....', '...ffff..ffff...', '................'],
    ['...ss......ss...', '...oo......oo...', '..ffff....ffff..', '................'],
    ['.....ss..ss.....', '.....oo..oo.....', '....ffffffff....', '................'],
  ];
  const LEGS_SIDE = [
    ['......ss........', '......oo........', '.....fff........', '................'],
    ['....ss...ss.....', '....oo...oo.....', '...fff...fff....', '................'],
    ['......ss........', '......oo........', '.....fff........', '................'],
  ];
  const ME = {
    down: LEGS_FRONT.map((l) => sprite(ME_DOWN.concat(l), PAL_ME)),
    up: LEGS_FRONT.map((l) => sprite(ME_UP.concat(l), PAL_ME)),
    left: LEGS_SIDE.map((l) => sprite(ME_LEFT.concat(l), PAL_ME)),
    right: LEGS_SIDE.map((l) => sprite(ME_LEFT.concat(l), PAL_ME, true)),
  };

  const PERSON = [
    '................',
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '...HHHHHhHHHH...',
    '...HHsHHHHsHH...',
    '...H' + 'ssssssss' + 'H...',
    '....' + 'seessees' + '....',
    '....' + 'csssssc' + 's....',
    '....' + 'sssmmsss' + '....',
    '.....ssssss.....',
    '......ssss......',
    '....TTTssTTT....',
    '...TTTTTTTTTT...',
    '...TTTTTTTTTT...',
    '...sTTTTTTTTs...',
    '...sTTTTTTTTs...',
    '....tttttttt....',
    '....PPPPPPPP....',
    '....PPP..PPP....',
    '....PPP..PPP....',
    '....fff..fff....',
    '................',
  ];
  // 어깨까지 오는 긴 머리 + 치마 (졸업과제 팀원)
  const GIRL = [
    '................',
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '...HHHHHhHHHH...',
    '...HHsHHHHsHH...',
    '...H' + 'ssssssss' + 'H...',
    '...H' + 'seessees' + 'H...',
    '...H' + 'cssssssc' + 'H...',
    '...H' + 'sssmmsss' + 'H...',
    '...HH' + 'ssssss' + 'HH...',
    '...HHH' + 'ssss' + 'HHH...',
    '...H' + 'TTTssTTT' + 'H...',
    '...HTTTTTTTTH...',
    '...TTTTTTTTTT...',
    '...sTTTTTTTTs...',
    '...sTTTTTTTTs...',
    '....tttttttt....',
    '...PPPPPPPPPP...',
    '...PPpPPPPpPP...',
    '.....ss..ss.....',
    '.....ff..ff.....',
    '................',
  ];
  const BOT = [
    '................',
    '.......rr.......',
    '.......LL.......',
    '....LLLLLLLL....',
    '...LMMMMMMMML...',
    '...LMcMMMMcML...',
    '...LMcMMMMcML...',
    '...LMMMMMMMML...',
    '...LMMMppMMML...',
    '....LLLLLLLL....',
    '......LLLL......',
    '....DDDDDDDD....',
    '...LDDDDDDDDL...',
    '..LLDDYYYYDDLL..',
    '..L.DDYYYYDD.L..',
    '..L.DDDDDDDD.L..',
    '..H.DDDDDDDD.H..',
    '....DDDDDDDD....',
    '.....DD..DD.....',
    '.....LL..LL.....',
    '.....LL..LL.....',
    '....MMM..MMM....',
    '................',
    '................',
  ];
  const CAT = [
    '................', '................', '................', '................',
    '................', '................', '................', '................',
    '................', '................', '................', '................',
    '..o.....o.......',
    '..oo...oo.......',
    '..ooooooo.......',
    '..oeoooeo.......',
    '..ooopooo...t...',
    '..ooooooo...t...',
    '...ooooooo.t....',
    '..ooooooooot....',
    '..ooooooooo.....',
    '..ww..ww........',
    '................',
    '................',
  ];
  const BASE_NPC = { s: '#f6d5c0', e: '#2b1d18', c: '#f3b2b2', m: '#c96b6b', f: '#3b2a26', a: '#2a2430' };
  const withGlasses = (rows) => rows.map((r, i) => (i === 8 ? '....' + 'aeassaea' + '....' : r));
  const NPC_SPRITES = {
    bot: sprite(BOT, { r: '#ff6b8f', L: '#e4e8f2', M: '#2c3150', c: '#7ef3ff', p: '#ff9ec0', D: '#2f6fd0', Y: '#ffd23f', H: '#9aa3b5' }),
    senior: sprite(withGlasses(PERSON), { ...BASE_NPC, H: '#5a3b2a', h: '#7a5640', T: '#f7f7f7', t: '#c9ccd6', P: '#3b4a6b' }),
    teammate: sprite(GIRL, { ...BASE_NPC, H: '#a8714a', h: '#c99366', T: '#fff3f7', t: '#f2c6d4', P: '#7c5cc4', p: '#6447a8' }),
    mc: sprite(PERSON, { ...BASE_NPC, H: '#e8b84a', h: '#ffd77a', T: '#7b5cd6', t: '#5b40ad', P: '#262633' }),
    scientist: sprite(withGlasses(PERSON), { ...BASE_NPC, H: '#6b4a8c', h: '#8e6bb0', T: '#ffffff', t: '#d4dbe6', P: '#42506b' }),
    cat: sprite(CAT, { o: '#f6e3c6', e: '#3a2a2a', p: '#f08cb0', t: '#e2c7a2', w: '#ffffff' }),
    fisher: sprite(PERSON, { ...BASE_NPC, H: '#3b2a26', h: '#5a4038', T: '#4f8dd9', t: '#3a6fb0', P: '#2f5a8a' }),
    gardener: sprite(GIRL, { ...BASE_NPC, H: '#5a3b2a', h: '#7a5640', T: '#7cc45a', t: '#5aa845', P: '#c9a46a', p: '#b08451' }),
  };

  // ================================================================ 마을 소품 그리기
  const TREE = {
    oak: makeCanvas(32, 42, (g) => {
      px(g, '#6b4430', 13, 26, 6, 15); px(g, '#563424', 13, 26, 2, 15); px(g, '#4a2c1e', 11, 40, 10, 2);
      blob(g, 16, 16, 13, '#3c7d32'); blob(g, 10, 20, 8, '#3c7d32'); blob(g, 22, 20, 8, '#3c7d32');
      blob(g, 15, 13, 10, '#4f9a3c'); blob(g, 11, 18, 6, '#4f9a3c'); blob(g, 21, 17, 6, '#4f9a3c');
      blob(g, 12, 9, 5, '#6cb84a'); blob(g, 19, 12, 3, '#6cb84a');
      [[8, 22], [20, 24], [24, 15], [6, 14]].forEach(([x, y]) => px(g, '#2f6427', x, y, 2, 2));
    }),
    cherry: makeCanvas(32, 42, (g) => {
      px(g, '#7a4a35', 13, 26, 6, 15); px(g, '#5e3626', 13, 26, 2, 15); px(g, '#4a2c1e', 11, 40, 10, 2);
      px(g, '#7a4a35', 9, 22, 5, 2); px(g, '#7a4a35', 18, 21, 6, 2);
      blob(g, 16, 16, 13, '#e682a8'); blob(g, 9, 20, 8, '#e682a8'); blob(g, 23, 20, 8, '#e682a8');
      blob(g, 15, 13, 10, '#f5a9c6'); blob(g, 10, 18, 6, '#f5a9c6'); blob(g, 22, 17, 6, '#f5a9c6');
      blob(g, 12, 9, 5, '#ffd3e3'); blob(g, 20, 12, 3, '#ffd3e3');
      for (let i = 0; i < 14; i++) px(g, '#ffffff', 4 + Math.floor(hash(i, 3) * 24), 4 + Math.floor(hash(3, i) * 22), 1, 1);
    }),
    bush: makeCanvas(16, 16, (g) => {
      blob(g, 8, 9, 6, '#3c7d32'); blob(g, 7, 8, 5, '#5aa845'); blob(g, 6, 6, 2, '#7cc45a');
      [[4, 9], [10, 7], [9, 11]].forEach(([x, y]) => px(g, '#ff8fb8', x, y, 2, 2));
    }),
  };

  function drawHouseCanvas(h) {
    const W = h.w * T + 8, H = h.h * T + 24;
    return makeCanvas(W, H, (g) => {
      const top = 24, wallY = top + Math.floor(h.h * T * 0.42), bottom = top + h.h * T;
      const L = 4, R = 4 + h.w * T;
      // 벽
      px(g, h.wall, L, wallY, h.w * T, bottom - wallY);
      for (let y = wallY + 3; y < bottom - 4; y += 4) px(g, h.wallLine, L, y, h.w * T, 1);
      px(g, h.wallLine, L, wallY, 3, bottom - wallY); px(g, h.wallLine, R - 3, wallY, 3, bottom - wallY);
      px(g, '#8d857c', L - 1, bottom - 5, h.w * T + 2, 5);
      for (let x = L; x < R; x += 6) px(g, '#a9a198', x + (Math.floor(x / 6) % 2) * 2, bottom - 4, 4, 2);
      // 지붕 / 돔
      if (h.dome) {
        const cx = Math.floor(W / 2), r = Math.floor(h.w * T / 2) - 2;
        for (let dy = -r; dy <= 0; dy++) {
          const w = Math.floor(Math.sqrt(r * r - dy * dy));
          px(g, Math.abs(dy) % 6 < 3 ? h.roof : h.roofDark, cx - w, wallY + 2 + dy, w * 2 + 1, 1);
        }
        px(g, '#2b2440', cx - 3, wallY - r + 4, 7, r - 4); px(g, '#ffd23f', cx - 1, wallY - r + 1, 3, 4);
        px(g, '#efe8ff', cx - r + 6, wallY - Math.floor(r * 0.7), 4, 2);
        px(g, h.roofDark, L - 2, wallY, h.w * T + 4, 3);
      } else {
        const rTop = top - 12, rBot = wallY + 4;
        for (let y = rTop; y < rBot; y++) {
          const inset = Math.max(0, 6 - (y - rTop));
          const row = Math.floor((y - rTop) / 4);
          px(g, row % 2 ? h.roofDark : h.roof, inset, y, W - inset * 2, 1);
          if ((y - rTop) % 4 === 3) {
            for (let x = inset + ((row % 2) ? 4 : 0); x < W - inset; x += 8) px(g, h.roofLine, x, y - 3, 1, 4);
          }
        }
        px(g, h.roofLine, 0, rBot - 2, W, 2);
        px(g, 'rgba(255,255,255,.25)', 6, rTop, W - 12, 1);
        px(g, 'rgba(0,0,0,.18)', L, rBot, h.w * T, 2);
        // 굴뚝
        const cx = W - 22;
        px(g, '#9a5a48', cx, 2, 9, rTop + 10); px(g, '#7b4536', cx, 2, 9, 2);
        for (let y = 5; y < rTop + 10; y += 3) px(g, '#b06e58', cx + ((y % 2) ? 1 : 4), y, 3, 1);
      }
      // 장식
      if (h.emblem === 'heart') {
        const cx = Math.floor(W / 2) - 5, cy = top - 4;
        blob(g, cx + 5, cy + 4, 6, '#fff3f7');
        [[2, 2, 2, 2], [6, 2, 2, 2], [1, 3, 8, 2], [2, 5, 6, 1], [3, 6, 4, 1], [4, 7, 2, 1]].forEach(([x, y, w, hh]) => px(g, '#f05a8c', cx + x, cy + y - 1, w, hh));
      } else if (h.emblem === 'trophy') {
        const cx = Math.floor(W / 2) - 5, cy = top - 6;
        blob(g, cx + 5, cy + 5, 7, '#fff4d0');
        px(g, '#f2b52c', cx + 1, cy, 9, 5); px(g, '#f2b52c', cx + 3, cy + 5, 5, 2); px(g, '#f2b52c', cx + 4, cy + 7, 3, 2); px(g, '#c98a12', cx + 2, cy + 9, 7, 2);
        px(g, '#fff27a', cx + 2, cy + 1, 2, 3);
      } else if (h.emblem === 'dish') {
        const cx = 14, cy = top - 10;
        blob(g, cx, cy, 5, '#e9edf5'); px(g, '#9aa3b5', cx - 1, cy + 4, 3, 7); px(g, '#ff6b8f', cx - 1, cy - 1, 2, 2);
      } else if (h.emblem === 'gear') {
        const cx = Math.floor(W / 2), cy = top - 4;
        blob(g, cx, cy, 5, '#f4d35e'); blob(g, cx, cy, 2, h.roofDark);
        [[-1, -7], [-1, 5], [-7, -1], [5, -1]].forEach(([x, y]) => px(g, '#f4d35e', cx + x, cy + y, 3, 3));
      }
      // 문
      const dx = 4 + (h.door.x - h.x) * T + 3;
      px(g, '#4b2c1a', dx - 1, bottom - 19, 12, 15);
      px(g, '#8a5530', dx, bottom - 18, 10, 14); px(g, '#6f4225', dx + 2, bottom - 16, 2, 10); px(g, '#6f4225', dx + 6, bottom - 16, 2, 10);
      px(g, '#ffd23f', dx + 8, bottom - 10, 1, 2);
      // 창문 + 화분
      const winY = wallY + Math.max(4, Math.floor((bottom - wallY - 12) / 2) - 2);
      const wins = [];
      for (let x = L + 7; x + 12 < R - 4; x += 22) if (Math.abs(x + 6 - (dx + 5)) > 14) wins.push(x);
      wins.forEach((x) => {
        px(g, '#f7efe3', x - 1, winY - 1, 14, 12); px(g, '#8ccbec', x, winY, 12, 10);
        px(g, '#c8ecff', x + 1, winY + 1, 3, 3); px(g, '#f7efe3', x + 5, winY, 2, 10); px(g, '#f7efe3', x, winY + 4, 12, 2);
        px(g, '#7a4a2c', x - 1, winY + 11, 14, 3);
        [[0, '#ff7aa8'], [4, '#ffd23f'], [8, '#ff9ec0'], [11, '#ffffff']].forEach(([fx, col]) => { px(g, '#4f9a3c', x + fx, winY + 10, 2, 1); px(g, col, x + fx, winY + 9, 2, 1); });
      });
    });
  }

  // ================================================================ 장면 정의
  const scenes = {};
  function newScene(id, name, w, h) {
    const sc = { id, name, w, h, ground: Array.from({ length: h }, () => Array(w).fill('grass')),
      solid: Array.from({ length: h }, () => Array(w).fill(false)), objects: [], npcs: [], exhibits: [], doors: [], deco: [] };
    scenes[id] = sc;
    return sc;
  }
  const block = (sc, x, y, w = 1, h = 1) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (sc.solid[j] && i >= 0 && i < sc.w) sc.solid[j][i] = true;
  };

  // ---------------------------------------------------------------- 마을
  const town = newScene('town', '소미의 CV 밸리', 40, 28);
  (function buildTown() {
    const g = town.ground;
    const fill = (t, x, y, w, h) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i < town.w) g[j][i] = t; };
    // 길
    fill('path', 5, 9, 31, 2);          // 윗길
    fill('path', 6, 22, 29, 2);         // 아랫길
    fill('path', 19, 7, 2, 4);          // 집 → 윗길
    fill('path', 7, 8, 1, 2); fill('path', 32, 8, 1, 2);
    fill('path', 19, 17, 2, 6);         // 광장 → 아랫길
    fill('path', 7, 21, 1, 1); fill('path', 32, 21, 1, 1);
    fill('path', 19, 10, 2, 1);
    fill('cobble', 15, 11, 10, 6);      // 광장
    fill('soil', 4, 13, 7, 3);          // 밭
    fill('water', 27, 13, 6, 5);        // 연못
    fill('water', 28, 12, 4, 1); fill('water', 28, 18, 4, 1);

    const houses = [
      { id: 'home', name: '소미의 집', x: 17, y: 3, w: 6, h: 4, door: { x: 20, y: 6 }, roof: '#ef8fb3', roofDark: '#e27aa2', roofLine: '#c45d86', wall: '#fff3ea', wallLine: '#ecd9cc', emblem: 'heart' },
      { id: 'lab', name: 'DTPLab 연구실', x: 4, y: 4, w: 6, h: 4, door: { x: 7, y: 7 }, roof: '#c9604a', roofDark: '#b5513d', roofLine: '#8f3a2b', wall: '#e3ddd0', wallLine: '#cbc3b4', emblem: 'dish' },
      { id: 'capstone', name: '🏆 캡스톤 홀', x: 29, y: 3, w: 7, h: 5, door: { x: 32, y: 7 }, roof: '#eab63c', roofDark: '#d9a22a', roofLine: '#a87612', wall: '#f6e6c9', wallLine: '#e2cda8', emblem: 'trophy' },
      { id: 'workshop', name: '프로젝트 공방', x: 4, y: 17, w: 6, h: 4, door: { x: 7, y: 20 }, roof: '#46a89c', roofDark: '#3a9286', roofLine: '#2a6d64', wall: '#d2a878', wallLine: '#b98c5c', emblem: 'gear' },
      { id: 'observatory', name: '대외활동 센터', x: 29, y: 17, w: 6, h: 4, door: { x: 32, y: 20 }, roof: '#9479d6', roofDark: '#7d62c2', roofLine: '#5b4596', wall: '#ece7f6', wallLine: '#d6cfe8', dome: true },
    ];
    houses.forEach((h) => {
      h.canvas = drawHouseCanvas(h);
      block(town, h.x, h.y, h.w, h.h);
      town.objects.push({ kind: 'house', house: h, x: h.x, y: h.y, w: h.w, h: h.h, sortY: h.y + h.h - 0.5 });
      town.doors.push({ x: h.door.x, y: h.door.y, to: h.id, house: h });
    });
    town.houses = houses;

    // 나무 (테두리 숲 + 장식)
    const tree = (x, y, kind) => { town.objects.push({ kind: 'tree', tree: kind, x, y, w: 1, h: 1, sortY: y }); block(town, x, y); };
    for (let x = 0; x < 40; x += 2) { tree(x, 0, (x / 2) % 3 ? 'oak' : 'cherry'); tree(x + 1, 1, (x / 2) % 4 === 1 ? 'cherry' : 'oak'); tree(x, 27, x % 6 ? 'oak' : 'cherry'); }
    for (let y = 2; y < 27; y += 2) { tree(0, y, y % 6 ? 'oak' : 'cherry'); tree(39, y + 1, y % 4 ? 'oak' : 'cherry'); }
    block(town, 0, 0, 40, 2); block(town, 0, 0, 1, 28); block(town, 39, 0, 1, 28); block(town, 0, 27, 40, 1);
    [[15, 4, 'cherry'], [24, 4, 'cherry'], [13, 12, 'cherry'], [26, 10, 'cherry'], [13, 16, 'cherry'], [2, 10, 'oak'], [11, 4, 'oak'],
      [26, 5, 'oak'], [2, 22, 'cherry'], [37, 12, 'oak'], [37, 22, 'cherry'], [23, 19, 'oak'], [15, 20, 'cherry'], [12, 25, 'oak'],
      [26, 25, 'cherry'], [36, 7, 'cherry'], [3, 16, 'oak'], [35, 15, 'oak']].forEach(([x, y, k]) => tree(x, y, k));
    [[12, 7], [27, 8], [3, 25], [36, 25], [14, 21], [25, 21]].forEach(([x, y]) => { town.objects.push({ kind: 'bush', x, y, w: 1, h: 1, sortY: y }); block(town, x, y); });

    // 울타리 (밭)
    for (let x = 3; x <= 11; x++) { if (x !== 7) town.objects.push({ kind: 'fence', x, y: 12, w: 1, h: 1, sortY: 12 }); town.objects.push({ kind: 'fence', x, y: 16, w: 1, h: 1, sortY: 16 }); }
    for (let x = 3; x <= 11; x++) { if (x !== 7) block(town, x, 12); block(town, x, 16); }
    for (let y = 13; y <= 15; y++) { block(town, 3, y); block(town, 11, y); town.objects.push({ kind: 'fencev', x: 3, y, w: 1, h: 1, sortY: y }, { kind: 'fencev', x: 11, y, w: 1, h: 1, sortY: y }); }

    // 광장 소품
    town.objects.push({ kind: 'fountain', x: 19, y: 13, w: 2, h: 2, sortY: 14.5 }); block(town, 19, 13, 2, 2);
    [[15, 11], [24, 11], [15, 16], [24, 16]].forEach(([x, y]) => { town.objects.push({ kind: 'lamp', x, y, w: 1, h: 1, sortY: y }); block(town, x, y); });
    town.objects.push({ kind: 'mailbox', x: 22, y: 7, w: 1, h: 1, sortY: 7 }); block(town, 22, 7);
    town.exhibits.push({ id: 'board', kind: 'board', name: '📮 마을 방명록', x: 17, y: 12, w: 1, h: 1, action: 'guestbook' });
    town.exhibits.push({ id: 'statue', kind: 'statue', name: '⭐ 별 동상', x: 22, y: 12, w: 1, h: 1, action: 'rating' });
    block(town, 17, 12); block(town, 22, 12);
    // 미니게임: 연못 낚시터 + 월척 랭킹 게시판, 방문자 꽃밭 안내판
    town.exhibits.push({ id: 'fishing', kind: 'dock', name: '🎣 낚시터 (미끼 10G)', x: 27, y: 15, w: 1, h: 1, action: 'fishing' });
    town.exhibits.push({ id: 'fishrank', kind: 'rankboard', name: '🏆 월척 랭킹 게시판', x: 26, y: 13, w: 1, h: 1, action: 'fishrank' });
    town.exhibits.push({ id: 'gardensign', kind: 'gardensign', name: '🌱 방문자 꽃밭 안내판', x: 8, y: 11, w: 1, h: 1, action: 'garden' });
    block(town, 26, 13); block(town, 8, 11);

    // 연못 연잎 + 작은 다리
    town.lily = [[28, 14], [31, 15], [29, 16], [30, 13]];
    // 땅 장식(꽃)
    for (let y = 2; y < 27; y++) for (let x = 1; x < 39; x++) {
      if (g[y][x] !== 'grass' || town.solid[y][x]) continue;
      const r = hash(x * 7, y * 13);
      if (r > 0.9) town.deco.push({ kind: 'flower', x, y, c: ['#ff8fb8', '#ffffff', '#ffd23f', '#ff6f9c', '#c9a8ff'][Math.floor(hash(x, y) * 5)] });
      else if (r > 0.82) town.deco.push({ kind: 'tuft', x, y });
    }
  })();

  // ---------------------------------------------------------------- 실내
  const INTERIOR = { w: 15, h: 10, exitX: 7 };
  function interior(id, name, wallA, wallB, floorA, floorB, build) {
    const sc = newScene(id, name, INTERIOR.w, INTERIOR.h);
    sc.indoor = true; sc.wallA = wallA; sc.wallB = wallB; sc.floorA = floorA; sc.floorB = floorB;
    for (let y = 0; y < sc.h; y++) for (let x = 0; x < sc.w; x++) {
      const wall = y < 3 || y === sc.h - 1 || x === 0 || x === sc.w - 1;
      sc.ground[y][x] = wall ? 'wall' : 'floor';
      sc.solid[y][x] = wall;
    }
    sc.ground[sc.h - 1][INTERIOR.exitX] = 'exit';
    sc.exit = { x: INTERIOR.exitX, y: sc.h - 1 };
    const ex = (o) => { sc.exhibits.push(o); if (o.y + o.h - 1 >= 3) block(sc, o.x, Math.max(3, o.y), o.w, o.y + o.h - Math.max(3, o.y)); };
    const deco = (o) => { sc.objects.push({ sortY: o.y + (o.h || 1) - 1, w: 1, h: 1, ...o }); if (o.solid !== false) block(sc, o.x, o.y, o.w || 1, o.h || 1); };
    build(ex, deco, sc);
    return sc;
  }

  interior('home', '소미의 집', '#ffd9e6', '#ffc7da', '#d9a374', '#c58f61', (ex, deco, sc) => {
    sc.rug = { x: 5, y: 5, w: 5, h: 3, c: '#f08cb0', c2: '#ffd3e3' };
    ex({ id: 'home_profile', kind: 'portrait', name: '🌸 자기소개 액자', x: 2, y: 1, w: 2, h: 2 });
    ex({ id: 'home_skills', kind: 'shelf', name: '📚 기술 책장', x: 10, y: 1, w: 2, h: 3 });
    ex({ id: 'home_github', kind: 'desk', name: '💻 소미의 컴퓨터', x: 5, y: 2, w: 2, h: 2 });
    ex({ id: 'home_summary', kind: 'lectern', name: '📖 소미의 집 안내판', x: 7, y: 4, w: 1, h: 2 });
    deco({ kind: 'bed', x: 12, y: 4, w: 2, h: 2, sortY: 5 });
    deco({ kind: 'plant', x: 1, y: 3 }); deco({ kind: 'plant', x: 13, y: 7 });
    deco({ kind: 'table', x: 2, y: 6 }); deco({ kind: 'window', x: 7, y: 1, solid: false, wall: true });
  });
  interior('lab', 'DTPLab 연구실', '#cfe0ea', '#bdd3e0', '#b9b1a6', '#a69d91', (ex, deco, sc) => {
    sc.rug = { x: 5, y: 6, w: 5, h: 2, c: '#7aa6c8', c2: '#a8c8e2' };
    ex({ id: 'lab_isaac', kind: 'poster', variant: 'robot', color: '#4f8dd9', name: '🧪 Isaac Sim 강화학습 포스터', x: 2, y: 1, w: 2, h: 2 });
    ex({ id: 'lab_vla', kind: 'whiteboard', name: '📊 SO-101 모델 비교 화이트보드', x: 6, y: 1, w: 3, h: 2 });
    ex({ id: 'lab_ros', kind: 'poster', variant: 'net', color: '#5ab06a', name: '📡 ROS 시스템 포스터', x: 11, y: 1, w: 2, h: 2 });
    ex({ id: 'lab_intro', kind: 'lectern', name: '📖 DTPLab 연구실 안내판', x: 7, y: 4, w: 1, h: 2 });
    deco({ kind: 'rack', x: 13, y: 3 }); deco({ kind: 'rack', x: 1, y: 3 });
    deco({ kind: 'plant', x: 13, y: 7 }); deco({ kind: 'robotdog', x: 10, y: 6 });
  });
  interior('capstone', '🏆 캡스톤 홀', '#f6dfb0', '#eccf96', '#b3524a', '#9f4640', (ex, deco, sc) => {
    sc.carpet = { x: 7, y: 6, w: 1, h: 3 };
    ex({ id: 'cap_poster', kind: 'bigposter', name: '🖼️ 졸업과제 포스터', x: 1, y: 0, w: 2, h: 3 });
    ex({ id: 'cap_data', kind: 'whiteboard', name: '📊 데이터 이야기 화이트보드', x: 5, y: 1, w: 3, h: 2 });
    ex({ id: 'cap_video', kind: 'tv', name: '📺 발표 영상 TV', x: 10, y: 2, w: 2, h: 2 });
    ex({ id: 'cap_trophy', kind: 'trophy', name: '🏆 1위 트로피 (캡스톤 홀 안내)', x: 7, y: 4, w: 1, h: 2 });
    ex({ id: 'cap_policy', kind: 'robotarm', name: '🦾 SO-101 로봇팔 전시대', x: 3, y: 5, w: 2, h: 2 });
    deco({ kind: 'banner', x: 12, y: 1, solid: false, wall: true }); deco({ kind: 'banner', x: 4, y: 1, solid: false, wall: true });
    deco({ kind: 'plant', x: 13, y: 3 }); deco({ kind: 'plant', x: 13, y: 7 }); deco({ kind: 'plant', x: 1, y: 7 });
  });
  interior('workshop', '프로젝트 공방', '#e7d3b0', '#dcc49c', '#c2955f', '#b08451', (ex, deco, sc) => {
    sc.rug = { x: 5, y: 6, w: 5, h: 2, c: '#46a89c', c2: '#8fd6cc' };
    ex({ id: 'ws_praise', kind: 'poster', variant: 'heart', color: '#f08cb0', name: '😇 칭찬감옥 포스터', x: 2, y: 1, w: 2, h: 2 });
    ex({ id: 'ws_pnu', kind: 'cork', name: '📱 PNU 학사 도우미 게시판', x: 6, y: 1, w: 3, h: 2 });
    ex({ id: 'ws_pnuin', kind: 'poster', variant: 'web', color: '#7b5cd6', name: '🌐 PNUin 포스터', x: 11, y: 1, w: 2, h: 2 });
    // 메인 안내판 주변은 비워 두고, 작은 프로젝트들은 방 양쪽 끝으로
    ex({ id: 'ws_pc', kind: 'desk', name: '💻 ComTogether 컴퓨터', x: 1, y: 5, w: 2, h: 2 });
    ex({ id: 'ws_db', kind: 'laptop', name: '🌱 탄소중립 SCM 노트북', x: 12, y: 5, w: 2, h: 2 });
    ex({ id: 'ws_summary', kind: 'lectern', name: '📖 프로젝트 공방 안내판', x: 7, y: 4, w: 1, h: 2 });
    deco({ kind: 'crate', x: 13, y: 3 }); deco({ kind: 'crate', x: 13, y: 4 }); deco({ kind: 'plant', x: 1, y: 8 }); deco({ kind: 'plant', x: 13, y: 8 });
  });
  // 대외활동 센터: 왼쪽 데이터 크리에이터 캠프 / 가운데 동아리 / 오른쪽 해커톤 — 구역마다 벽지·바닥이 다르다
  interior('observatory', '대외활동 센터', '#efe3c8', '#e5d5b3', '#c2955f', '#b08451', (ex, deco, sc) => {
    sc.zones = [
      { x0: 1, x1: 4, wallA: '#3b3b6d', wallB: '#323262', floorA: '#8e86a8', floorB: '#7d7598', stars: true, label: '🛰️ 데이터 크리에이터 캠프', sign: '#9479d6' },
      { x0: 5, x1: 9, wallA: '#efe3c8', wallB: '#e5d5b3', floorA: '#c2955f', floorB: '#b08451', label: '🎓 동아리', sign: '#d9a46a' },
      { x0: 10, x1: 13, wallA: '#ffd9e6', wallB: '#ffc7da', floorA: '#e9bcc6', floorB: '#dca8b5', label: '🏅 SW 해커톤', sign: '#f08cb0' },
    ];
    sc.rugs = [{ x: 1, y: 6, w: 4, h: 2, c: '#5b4596', c2: '#9479d6' }, { x: 10, y: 6, w: 4, h: 2, c: '#d8668f', c2: '#ffd3e3' }];
    ex({ id: 'dcc_seg', kind: 'poster', variant: 'map', color: '#5ab06a', name: '🗺️ 데이터 크리에이터 캠프 · 산업단지 분할 포스터', x: 1, y: 1, w: 2, h: 2 });
    ex({ id: 'dcc_chimney', kind: 'poster', variant: 'chimney', color: '#e0703a', name: '🏭 데이터 크리에이터 캠프 · 굴뚝 탐지 포스터', x: 3, y: 1, w: 2, h: 2 });
    ex({ id: 'dcc_intro', kind: 'telescope', name: '🛰️ 데이터 크리에이터 캠프 망원경', x: 2, y: 4, w: 1, h: 2 });
    ex({ id: 'clubs', kind: 'cork', name: '🎓 동아리 게시판', x: 6, y: 1, w: 3, h: 2 });
    ex({ id: 'ext_summary', kind: 'lectern', name: '📖 대외활동 센터 안내판', x: 7, y: 4, w: 1, h: 2 });
    ex({ id: 'ws_ongi', kind: 'cork', medal: true, name: '🏅 온기 · SW 해커톤 최우수상 게시판', x: 10, y: 1, w: 3, h: 2 });
    deco({ kind: 'podium', x: 12, y: 4 });
    deco({ kind: 'partition', x: 5, y: 3 }); deco({ kind: 'partition', x: 9, y: 3 });
    deco({ kind: 'pillar', x: 5, y: 0, solid: false, wall: true }); deco({ kind: 'pillar', x: 10, y: 0, solid: false, wall: true });
    deco({ kind: 'plant', x: 13, y: 7 }); deco({ kind: 'globe', x: 4, y: 7 });
  });

  // ---------------------------------------------------------------- NPC
  town.npcs = [
    { id: 'guide', name: 'PNU-bot', sprite: 'bot', x: 18, y: 8, lines: [
      '삐빅! 소미의 CV 밸리에 온 걸 환영해요! 🌸\n이 마을은 옥소미의 이력서로 만들어졌어요.',
      '집 다섯 채에 들어가서 포스터, 게시판, TV를 조사해 보세요.\n소미가 해 온 일들이 자세히 적혀 있어요.',
      '처음 보는 전시물을 읽거나 주민과 처음 대화하면 💰10G!\n모은 G로 광장의 📮방명록(30G)과 ⭐별 동상(20G)을 쓸 수 있어요.',
      '방향키로 걷고 Space로 조사해요.\n마우스로 아무 곳이나 클릭하면 거기까지 알아서 걸어가요!',
      '길을 잃으면 M 키로 지도를 열어 보세요.\n가고 싶은 집을 누르면 문 앞까지 데려다줘요! 🗺️',
      '💰 G가 모이면 연못에서 🎣 낚시를 하거나\n꽃밭에 🌱 내 이름으로 꽃을 심어 보세요! 월척 랭킹에도 도전해 봐요.',
    ] },
    { id: 'senior', name: 'DTPLab 선배', sprite: 'senior', x: 10, y: 8, lines: [
      '안녕! 나는 DTPLab 선배야. 🔬',
      '소미는 요즘 연구실에서 로봇한테 강화학습을 가르치고 있어.\n들어가서 벽에 붙은 포스터 좀 봐 봐!',
    ] },
    { id: 'teammate', name: '키자니아 팀원', sprite: 'teammate', x: 34, y: 9, lines: [
      '나는 졸업과제 팀 키자니아패밀리 팀원이야! 🦾',
      '우리 팀이 피지컬 AI 트랙에서 성능 1위를 했어!\n캡스톤 홀에 트로피랑 포스터, 발표 영상이 있으니까 꼭 봐!',
    ] },
    { id: 'mc', name: '해커톤 MC', sprite: 'mc', x: 35, y: 22, lines: [
      '🎤 2025 PNU SW 창의융합 해커톤 최우수상 팀, 온기!',
      '그 팀 백엔드 개발자가 바로 소미예요.\n대외활동 센터 게시판에서 자세히 볼 수 있어요! 👏',
    ] },
    { id: 'scientist', name: '위성 연구원', sprite: 'scientist', x: 28, y: 22, lines: [
      '🛰️ 위성 사진만 보고 굴뚝 높이를 맞힐 수 있을까?',
      '소미가 데이터 크리에이터 캠프에서 해낸 일이야.\n대외활동 센터 안 포스터를 확인해 봐!',
    ] },
    { id: 'gardener', name: '정원사 봄이', sprite: 'gardener', x: 6, y: 11, lines: [
      '🌱 여기는 방문자 꽃밭이야! 마을에 온 사람들이 꽃을 심고 가는 곳이지.',
      '울타리 안 빈 밭 칸 위에 서서 Space를 누르면\n15G로 네 이름이 적힌 꽃을 심을 수 있어. 다른 방문자들에게도 보여! 🌷',
    ] },
    { id: 'fisher', name: '낚시꾼 연이', sprite: 'fisher', x: 25, y: 16, lines: [
      '🎣 연못에서 낚시해 볼래? 미끼는 10G야.',
      '찌가 흔들리면 움직이는 바늘이 초록 칸에 올 때 Space!\n타이밍이 정확할수록 크고 희귀한 물고기가 잡혀.',
      '낚은 물고기는 바로 팔려서 G가 돌아와. 희귀할수록 비싸게 팔리지!',
      '전설의 물고기도 있다던데…\n희귀하고 큰 걸 낚으면 🏆 월척 랭킹 게시판에 이름이 올라가!',
    ] },
    { id: 'cat', name: '모찌', sprite: 'cat', x: 22, y: 15, wander: { x: 16, y: 15, w: 8, h: 2 }, lines: [
      '냐옹~ 🐾',
      '(모찌가 기분 좋게 꼬리를 흔든다)',
    ] },
  ];
  town.npcs.forEach((n) => { n.home = { x: n.x, y: n.y }; n.fx = n.x; n.fy = n.y; });

  const ALL_SPOTS = [
    ...town.npcs.map((n) => n.id),
    ...Object.values(scenes).flatMap((sc) => sc.exhibits.filter((e) => !e.action).map((e) => e.id)),
  ];

  // ================================================================ 지면 프리렌더
  function renderGround(sc) {
    return makeCanvas(sc.w * T, sc.h * T, (g) => {
      for (let y = 0; y < sc.h; y++) for (let x = 0; x < sc.w; x++) drawGroundTile(g, sc, x, y);
      [sc.rug, ...(sc.rugs || [])].filter(Boolean).forEach((r) => {
        const X = r.x * T, Y = r.y * T, W = r.w * T, H = r.h * T;
        px(g, r.c, X, Y, W, H); px(g, r.c2, X + 3, Y + 3, W - 6, H - 6); px(g, r.c, X + 6, Y + 6, W - 12, H - 12);
        for (let i = X + 2; i < X + W - 2; i += 4) { px(g, r.c2, i, Y - 2, 2, 2); px(g, r.c2, i, Y + H, 2, 2); }
      });
      if (sc.carpet) px(g, '#c92f4a', sc.carpet.x * T - 4, sc.carpet.y * T, T + 8, sc.carpet.h * T + T), px(g, '#ffd23f', sc.carpet.x * T - 4, sc.carpet.y * T, 2, (sc.carpet.h + 1) * T), px(g, '#ffd23f', sc.carpet.x * T + T + 2, sc.carpet.y * T, 2, (sc.carpet.h + 1) * T);
      sc.deco.forEach((d) => {
        const X = d.x * T, Y = d.y * T, h1 = hash(d.x, d.y), h2 = hash(d.y, d.x);
        if (d.kind === 'flower') {
          [[3, 4], [10, 9], [6, 12]].slice(0, 1 + Math.floor(h1 * 3)).forEach(([fx, fy]) => {
            px(g, '#3f8a32', X + fx + 1, Y + fy + 2, 1, 3); px(g, d.c, X + fx, Y + fy, 3, 2); px(g, d.c, X + fx + 1, Y + fy - 1, 1, 4); px(g, '#ffe066', X + fx + 1, Y + fy, 1, 1);
          });
        } else if (d.kind === 'tuft') {
          const fx = 3 + Math.floor(h2 * 8), fy = 5 + Math.floor(h1 * 6);
          px(g, '#5c9e3a', X + fx, Y + fy, 1, 3); px(g, '#5c9e3a', X + fx + 2, Y + fy - 1, 1, 4); px(g, '#5c9e3a', X + fx + 4, Y + fy + 1, 1, 2);
        }
      });
      (sc.lily || []).forEach(([x, y]) => {
        const X = x * T, Y = y * T;
        blob(g, X + 8, Y + 8, 4, '#4f9a3c'); px(g, '#5cb2e6', X + 8, Y + 4, 4, 4); px(g, '#ff9ec0', X + 6, Y + 6, 3, 3); px(g, '#ffffff', X + 7, Y + 7, 1, 1);
      });
    });
  }
  function drawGroundTile(g, sc, x, y) {
    const t = sc.ground[y][x], X = x * T, Y = y * T, r = hash(x, y);
    const Z = (sc.zones && sc.zones.find((z) => x >= z.x0 && x <= z.x1)) || sc;   // 구역별 벽지/바닥 색
    const at = (dx, dy) => (sc.ground[y + dy] && sc.ground[y + dy][x + dx]) || t;
    if (t === 'grass' || t === 'path' || t === 'soil' || t === 'cobble' || t === 'water') {
      px(g, '#86c45a', X, Y, T, T);
      for (let i = 0; i < 5; i++) px(g, i % 2 ? '#78b84e' : '#93cf66', X + Math.floor(hash(x + i, y * 3) * 15), Y + Math.floor(hash(x * 5, y + i) * 15), 2, 1);
    }
    if (t === 'path') {
      px(g, '#d9b47c', X, Y, T, T);
      for (let i = 0; i < 6; i++) px(g, i % 3 ? '#c69f68' : '#e8c896', X + Math.floor(hash(x * 3 + i, y) * 14), Y + Math.floor(hash(x, y * 7 + i) * 14), 2, 1);
      // 풀과 맞닿은 가장자리
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
        if (at(dx, dy) !== 'grass') return;
        for (let i = 0; i < T; i += 2) {
          const d = 1 + Math.floor(hash(x * 16 + i, y * 16 + dx + dy * 3) * 3);
          if (dy === -1) px(g, '#86c45a', X + i, Y, 2, d); if (dy === 1) px(g, '#86c45a', X + i, Y + T - d, 2, d);
          if (dx === -1) px(g, '#86c45a', X, Y + i, d, 2); if (dx === 1) px(g, '#86c45a', X + T - d, Y + i, d, 2);
        }
      });
    } else if (t === 'cobble') {
      px(g, '#b5a896', X, Y, T, T);
      [[0, 0, 7, 7], [8, 0, 8, 6], [0, 8, 5, 8], [6, 7, 10, 9]].forEach(([sx, sy, w, h], i) => {
        const off = (x + y) % 2 ? 1 : 0;
        px(g, i % 2 ? '#d6ccbd' : '#cec3b2', X + sx + off, Y + sy + 1, w - 1, h - 1); px(g, '#e7dfd2', X + sx + off, Y + sy + 1, w - 2, 1);
      });
    } else if (t === 'soil') {
      px(g, '#9b6a45', X, Y, T, T);
      for (let i = 2; i < T; i += 5) px(g, '#7d5235', X, Y + i, T, 1);
      px(g, '#8a5c3b', X + 3, Y + 7, 10, 6); px(g, '#a8774f', X + 4, Y + 7, 8, 2);   // 빈 밭 흙더미
    } else if (t === 'water') {
      px(g, '#5cb2e6', X, Y, T, T);
      if (r > 0.5) px(g, '#4ea1d6', X + 2, Y + 5, 6, 1);
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
        if (at(dx, dy) === 'water') return;
        if (dy === -1) { px(g, '#e9d7a6', X, Y, T, 3); px(g, '#3f8fc4', X, Y + 3, T, 1); }
        if (dy === 1) { px(g, '#e9d7a6', X, Y + T - 2, T, 2); }
        if (dx === -1) { px(g, '#e9d7a6', X, Y, 2, T); px(g, '#3f8fc4', X + 2, Y, 1, T); }
        if (dx === 1) { px(g, '#e9d7a6', X + T - 2, Y, 2, T); }
      });
    } else if (t === 'floor') {
      px(g, Z.floorA, X, Y, T, T);
      for (let i = 0; i < T; i += 4) px(g, Z.floorB, X, Y + i, T, 1);
      px(g, Z.floorB, X + ((y % 2) ? 5 : 11), Y, 1, T);
      if (y === 3) px(g, 'rgba(0,0,0,.18)', X, Y, T, 3);
    } else if (t === 'wall' || t === 'exit') {
      if (y < 3 && x > 0 && x < sc.w - 1) {
        px(g, Z.wallA, X, Y, T, T);
        for (let i = (x % 2) * 4; i < T; i += 8) px(g, Z.wallB, X + i, Y, 3, T);
        if (Z.stars && hash(x, y) > 0.3) { px(g, '#fff6b0', X + Math.floor(hash(y, x) * 14), Y + Math.floor(r * 14), 1, 1); px(g, '#ffffff', X + Math.floor(r * 13), Y + Math.floor(hash(x * 3, y) * 13), 1, 1); }
        if (y === 0) px(g, 'rgba(0,0,0,.22)', X, Y, T, 3);
        if (y === 2) { px(g, '#8a5a36', X, Y + 9, T, 7); px(g, '#a8744a', X, Y + 9, T, 2); px(g, '#5b3a22', X, Y + 15, T, 1); }
      } else {
        px(g, '#3b2a22', X, Y, T, T); px(g, '#5b3a22', X + 1, Y + 1, T - 2, T - 2);
        if (t === 'exit') { px(g, Z.floorA, X, Y, T, T); px(g, '#b34a5a', X + 1, Y + 3, T - 2, 10); px(g, '#e8768a', X + 3, Y + 5, T - 6, 6); }
      }
    }
  }
  Object.values(scenes).forEach((sc) => { sc.groundCanvas = renderGround(sc); });

  // 미니맵: 마을 1타일 = 1픽셀
  const MINI_COLORS = { grass: '#86c45a', path: '#e3c08a', cobble: '#d8cfc2', water: '#5cb2e6', soil: '#9b6a45' };
  const MINI = makeCanvas(town.w, town.h, (g) => {
    for (let y = 0; y < town.h; y++) for (let x = 0; x < town.w; x++) px(g, MINI_COLORS[town.ground[y][x]] || '#86c45a', x, y);
    town.objects.forEach((o) => {
      if (o.kind === 'tree' || o.kind === 'bush') px(g, o.tree === 'cherry' ? '#f5a9c6' : '#3c7d32', o.x, o.y);
      if (o.kind === 'fountain') px(g, '#bfe6ff', o.x, o.y, 2, 2);
      if (o.kind === 'house') { px(g, o.house.roof, o.x, o.y, o.w, o.h); px(g, '#5b3a22', o.house.door.x, o.house.door.y); }
    });
  });

  // ================================================================ 오브젝트 / 전시물 그리기
  function drawObject(g, o, time) {
    const X = o.x * T, Y = o.y * T;
    switch (o.kind) {
      case 'house': g.drawImage(o.house.canvas, X - 4, Y - 24); break;
      case 'tree': g.drawImage(TREE[o.tree], X - 8, Y + T - 42); break;
      case 'bush': g.drawImage(TREE.bush, X, Y); break;
      case 'fence':
        px(g, '#8a5a36', X, Y + 6, T, 2); px(g, '#8a5a36', X, Y + 11, T, 2);
        px(g, '#b98352', X + 2, Y + 3, 3, 12); px(g, '#b98352', X + 10, Y + 3, 3, 12); px(g, '#d9a46a', X + 2, Y + 3, 3, 1); px(g, '#d9a46a', X + 10, Y + 3, 3, 1);
        break;
      case 'fencev': px(g, '#b98352', X + 6, Y, 3, T); px(g, '#d9a46a', X + 6, Y, 1, T); break;
      case 'fountain': {
        blob(g, X + 16, Y + 20, 14, '#9d9486'); blob(g, X + 16, Y + 19, 12, '#c9c0b2'); blob(g, X + 16, Y + 19, 10, '#5cb2e6');
        px(g, '#c9c0b2', X + 13, Y + 6, 6, 14); px(g, '#e7dfd2', X + 13, Y + 6, 2, 14);
        const f = Math.floor(time / 180) % 3;
        px(g, '#bfe6ff', X + 15, Y - 2 - f, 2, 8 + f); px(g, '#ffffff', X + 15, Y - 3 - f, 2, 2);
        [[-5, 2], [5, 2], [-3, 8], [3, 8]].forEach(([dx, dy], i) => px(g, '#bfe6ff', X + 15 + dx + (i % 2 ? f : -f), Y + 10 + dy + f, 2, 2));
        break;
      }
      case 'lamp':
        px(g, '#3b3340', X + 7, Y - 10, 2, 24); px(g, '#2b2430', X + 5, Y + 13, 6, 3);
        px(g, '#3b3340', X + 4, Y - 14, 8, 5); px(g, '#ffe9a8', X + 5, Y - 13, 6, 3);
        g.globalAlpha = 0.18 + 0.05 * Math.sin(time / 400); blob(g, X + 8, Y - 11, 7, '#fff2b0'); g.globalAlpha = 1;
        break;
      case 'mailbox':
        px(g, '#7a4a2c', X + 7, Y + 6, 2, 10); px(g, '#ef8fb3', X + 3, Y + 1, 10, 7); px(g, '#d8668f', X + 3, Y + 6, 10, 2); px(g, '#ffd23f', X + 12, Y - 1, 1, 4);
        break;
      // ---------- 실내 소품
      case 'bed':
        px(g, '#8a5a36', X, Y - 4, 2 * T, 2 * T + 2); px(g, '#ffffff', X + 2, Y - 2, 2 * T - 4, 9); px(g, '#f08cb0', X + 2, Y + 7, 2 * T - 4, 2 * T - 12);
        px(g, '#ffb3cd', X + 2, Y + 9, 2 * T - 4, 2); for (let i = 0; i < 4; i++) px(g, '#ffd3e3', X + 5 + i * 7, Y + 14, 3, 3);
        break;
      case 'plant':
        px(g, '#c0703f', X + 4, Y + 9, 8, 7); px(g, '#a35b30', X + 4, Y + 9, 8, 2);
        blob(g, X + 8, Y + 4, 5, '#4f9a3c'); blob(g, X + 6, Y + 2, 3, '#6cb84a'); px(g, '#ff8fb8', X + 10, Y + 1, 2, 2);
        break;
      case 'table':
        px(g, '#8a5a36', X + 1, Y + 4, 14, 4); px(g, '#a8744a', X + 1, Y + 4, 14, 1); px(g, '#6b4430', X + 2, Y + 8, 2, 8); px(g, '#6b4430', X + 12, Y + 8, 2, 8);
        px(g, '#ffffff', X + 5, Y + 1, 5, 3); px(g, '#f08cb0', X + 6, Y + 2, 3, 1);
        break;
      case 'window':
        px(g, '#f7efe3', X - 1, Y + 1, 18, 14); px(g, '#9ad3f0', X + 1, Y + 3, 14, 10); px(g, '#d4f0ff', X + 2, Y + 4, 4, 3); px(g, '#f7efe3', X + 7, Y + 3, 2, 10);
        px(g, '#ffc7da', X - 2, Y, 4, 16); px(g, '#ffc7da', X + 14, Y, 4, 16);
        break;
      case 'rack':
        px(g, '#2f3346', X + 1, Y - 12, 14, 27); for (let i = 0; i < 5; i++) { px(g, '#454b66', X + 2, Y - 10 + i * 5, 12, 3); px(g, (Math.floor(time / 300) + i) % 3 ? '#5ef07a' : '#ff6b8f', X + 11, Y - 9 + i * 5, 2, 1); }
        break;
      case 'robotdog':
        px(g, '#e9edf5', X + 3, Y + 6, 10, 5); px(g, '#e9edf5', X + 11, Y + 3, 4, 4); px(g, '#2f3346', X + 13, Y + 4, 1, 1);
        px(g, '#9aa3b5', X + 3, Y + 11, 2, 4); px(g, '#9aa3b5', X + 11, Y + 11, 2, 4); px(g, '#ffd23f', X + 6, Y + 7, 3, 2);
        break;
      case 'banner':
        px(g, '#c92f4a', X + 3, Y, 10, 20); px(g, '#ffd23f', X + 3, Y, 10, 2); px(g, '#c92f4a', X + 3, Y + 20, 4, 3); px(g, '#c92f4a', X + 9, Y + 20, 4, 3);
        px(g, '#ffd23f', X + 6, Y + 6, 4, 4); px(g, '#ffd23f', X + 7, Y + 10, 2, 3);
        break;
      case 'crate': px(g, '#a8744a', X + 1, Y + 2, 14, 13); px(g, '#8a5a36', X + 1, Y + 2, 14, 2); px(g, '#8a5a36', X + 1, Y + 8, 14, 1); px(g, '#8a5a36', X + 7, Y + 2, 2, 13); break;
      case 'podium':
        px(g, '#c9cfdb', X + 1, Y + 8, 14, 8); px(g, '#e9edf5', X + 1, Y + 8, 14, 2); px(g, '#5b3a22', X + 6, Y + 11, 4, 3);
        blob(g, X + 8, Y - 1, 5, '#ffd76a'); blob(g, X + 8, Y - 1, 3, '#f2b52c'); px(g, '#4f8dd9', X + 5, Y - 11, 2, 6); px(g, '#ff6b8f', X + 9, Y - 11, 2, 6);
        px(g, '#ffffff', X + 6, Y - 3, 2, 2);
        break;
      case 'partition':
        px(g, '#6b4430', X + 2, Y - 6, 12, 20); px(g, '#a8744a', X + 3, Y - 5, 10, 18); px(g, '#8a5a36', X + 3, Y + 3, 10, 1);
        blob(g, X + 8, Y - 9, 4, '#4f9a3c'); px(g, '#ff8fb8', X + 9, Y - 12, 2, 2);
        break;
      case 'pillar': px(g, '#5b3a22', X - 3, Y, 6, 3 * T); px(g, '#8a5a36', X - 2, Y, 4, 3 * T); px(g, '#b98352', X - 2, Y, 1, 3 * T); break;
      case 'globe':
        px(g, '#6b4430', X + 6, Y + 11, 4, 5); blob(g, X + 8, Y + 6, 5, '#5cb2e6'); px(g, '#5aa845', X + 5, Y + 3, 4, 3); px(g, '#5aa845', X + 9, Y + 7, 3, 3);
        break;
    }
  }

  function poster(g, X, Y, W, H, color, variant) {
    px(g, '#5b3a22', X + 2, Y + 2, W - 4, H - 3); px(g, '#fffaf0', X + 4, Y + 4, W - 8, H - 7);
    px(g, color, X + 4, Y + 4, W - 8, 5);
    const cx = X + W / 2, cy = Y + H / 2 + 2;
    if (variant === 'robot') { px(g, '#9aa3b5', cx - 6, cy + 4, 12, 3); px(g, '#f28c28', cx - 2, cy - 4, 3, 9); px(g, '#f28c28', cx - 2, cy - 5, 8, 3); px(g, '#2f3346', cx + 5, cy - 6, 2, 5); }
    else if (variant === 'net') { [[-6, -3], [5, -4], [0, 4], [-4, 6], [7, 5]].forEach(([dx, dy]) => px(g, color, cx + dx, cy + dy, 3, 3)); px(g, '#9aa3b5', cx - 4, cy - 2, 10, 1); px(g, '#9aa3b5', cx + 1, cy - 1, 1, 6); }
    else if (variant === 'heart') { [[-4, -3, 3, 2], [1, -3, 3, 2], [-5, -2, 10, 3], [-4, 1, 8, 1], [-3, 2, 6, 1], [-2, 3, 4, 1], [-1, 4, 2, 1]].forEach(([dx, dy, w, h]) => px(g, color, cx + dx, cy + dy, w, h)); }
    else if (variant === 'web') { px(g, '#d6ccf2', cx - 8, cy - 4, 16, 11); px(g, color, cx - 8, cy - 4, 16, 2); px(g, '#ffffff', cx - 6, cy, 6, 4); px(g, '#b9b0d9', cx + 1, cy, 5, 1); px(g, '#b9b0d9', cx + 1, cy + 2, 5, 1); }
    else if (variant === 'map') { px(g, '#7cc45a', cx - 8, cy - 5, 16, 12); px(g, '#9aa3b5', cx - 5, cy - 2, 7, 6); px(g, '#5cb2e6', cx + 3, cy - 5, 3, 12); px(g, '#ff6b8f', cx - 6, cy - 3, 9, 1); px(g, '#ff6b8f', cx - 6, cy + 4, 9, 1); }
    else if (variant === 'chimney') { px(g, '#9aa3b5', cx - 8, cy + 3, 16, 4); px(g, '#c0703f', cx - 4, cy - 5, 3, 8); px(g, '#c0703f', cx + 3, cy - 2, 3, 5); px(g, '#cfcfd6', cx - 5, cy - 9, 4, 3); px(g, '#ffd23f', cx - 6, cy - 6, 6, 1); }
    for (let i = 0; i < 3; i++) px(g, '#d9cdb6', X + 6, Y + H - 9 + i * 2, W - 12 - (i % 2) * 5, 1);
  }

  function drawExhibit(g, e, time) {
    const X = e.x * T, Y = e.y * T, W = e.w * T, H = e.h * T;
    switch (e.kind) {
      case 'dock': {
        px(g, '#6b4430', X - 5, Y + 3, 20, 10);
        for (let i = 0; i < 5; i++) px(g, i % 2 ? '#b98352' : '#a8744a', X - 4 + i * 4, Y + 4, 3, 8);
        px(g, '#5b3a22', X + 12, Y + 12, 2, 4); px(g, '#5b3a22', X - 4, Y + 12, 2, 4);
        px(g, '#7a4a2c', X + 1, Y - 7, 1, 11);
        const bob = Math.round(Math.sin(time / 300));
        for (let i = 0; i <= 9; i++) px(g, '#e9edf5', X + 2 + i, Y - 7 + Math.round(i * 0.9) + (i > 7 ? bob : 0), 1, 1);
        px(g, '#ff4f6d', X + 11, Y + 2 + bob, 2, 2); px(g, '#ffffff', X + 11, Y + 1 + bob, 2, 1);
        px(g, '#bfe6ff', X + 8, Y + 5 + bob, 7, 1);
        break;
      }
      case 'rankboard':
        px(g, '#6b4430', X + 3, Y + 6, 2, 10); px(g, '#6b4430', X + 11, Y + 6, 2, 10);
        px(g, '#5b3a22', X - 2, Y - 8, 20, 15); px(g, '#d9b47c', X - 1, Y - 7, 18, 13);
        px(g, '#f2b52c', X + 1, Y - 6, 4, 3); px(g, '#f2b52c', X + 2, Y - 3, 2, 2);
        for (let i = 0; i < 3; i++) px(g, '#8a5a36', X + 6, Y - 6 + i * 3, 9 - i * 2, 1);
        px(g, '#5cb2e6', X + 1, Y + 1, 6, 3); px(g, '#ffffff', X + 2, Y + 1, 1, 1);
        break;
      case 'gardensign':
        px(g, '#6b4430', X + 7, Y + 4, 2, 12); px(g, '#5b3a22', X - 2, Y - 6, 20, 11); px(g, '#c99a62', X - 1, Y - 5, 18, 9);
        [[2, '#ff7aa8'], [7, '#ffd23f'], [12, '#c9a8ff']].forEach(([fx, c]) => { px(g, '#4f9a3c', X + fx, Y - 3, 1, 4); px(g, c, X + fx - 1, Y - 4, 3, 2); });
        break;
      case 'board':
        px(g, '#6b4430', X + 2, Y + 6, 2, 10); px(g, '#6b4430', X + 12, Y + 6, 2, 10);
        px(g, '#8a5a36', X - 2, Y - 8, 20, 16); px(g, '#c99a62', X, Y - 6, 16, 12);
        px(g, '#fffaf0', X + 1, Y - 5, 6, 5); px(g, '#ffd3e3', X + 8, Y - 5, 7, 4); px(g, '#d4f0ff', X + 3, Y + 1, 8, 4);
        px(g, '#ff6b8f', X + 3, Y - 5, 1, 1); px(g, '#ff6b8f', X + 11, Y - 5, 1, 1); px(g, '#5aa845', X + 6, Y + 1, 1, 1);
        px(g, '#ef8fb3', X - 3, Y - 10, 22, 3);
        break;
      case 'statue': {
        px(g, '#9d9486', X + 1, Y + 9, 14, 7); px(g, '#c9c0b2', X + 2, Y + 7, 12, 3); px(g, '#e7dfd2', X + 2, Y + 7, 12, 1);
        const glow = 0.5 + 0.5 * Math.sin(time / 300);
        g.globalAlpha = 0.2 + glow * 0.25; blob(g, X + 8, Y - 2, 9, '#fff6b0'); g.globalAlpha = 1;
        const star = ['......#......', '.....###.....', '....#####....', '#############', '.###########.', '..#########..', '..####.####..', '.###.....###.', '.#.........#.'];
        star.forEach((r, i) => { for (let k = 0; k < r.length; k++) if (r[k] === '#') px(g, i < 4 ? '#fff27a' : '#ffc928', X + 2 + k, Y - 4 + i, 1, 1); });
        break;
      }
      case 'portrait': {
        px(g, '#c9a14a', X + 3, Y + 1, W - 6, H - 4); px(g, '#ffe6ef', X + 6, Y + 4, W - 12, H - 10);
        g.drawImage(ME.down[0], 0, 0, 16, 14, X + 8, Y + 6, 16, 14);
        px(g, '#f08cb0', X + 7, Y + H - 9, W - 14, 3);
        break;
      }
      case 'shelf':
        px(g, '#6b4430', X, Y + 6, W, H - 6); px(g, '#4a2f1a', X + 2, Y + 8, W - 4, H - 10);
        for (let s = 0; s < 3; s++) {
          const sy = Y + 9 + s * 12;
          px(g, '#8a5a36', X + 2, sy + 9, W - 4, 2);
          for (let i = 0; i < 9; i++) px(g, ['#f08cb0', '#4f8dd9', '#ffd23f', '#5ab06a', '#a26bd9', '#ff8a5c'][(i + s * 2) % 6], X + 3 + i * 3, sy + (i % 3 === 0 ? 1 : 0), 2, 9 - (i % 3 === 0 ? 1 : 0));
        }
        break;
      case 'desk': {
        px(g, '#8a5a36', X, Y + 18, W, 5); px(g, '#a8744a', X, Y + 18, W, 2); px(g, '#6b4430', X + 2, Y + 23, 3, 9); px(g, '#6b4430', X + W - 5, Y + 23, 3, 9);
        px(g, '#2f3346', X + 7, Y + 3, 18, 13); px(g, '#5ec8ff', X + 8, Y + 4, 16, 10); px(g, '#2f3346', X + 14, Y + 16, 4, 2);
        const f = Math.floor(time / 500) % 2;
        for (let i = 0; i < 4; i++) px(g, i === 1 + f ? '#ffd3e3' : '#d4f0ff', X + 10, Y + 6 + i * 2, 6 + (i * 3) % 7, 1);
        px(g, '#e9edf5', X + 9, Y + 19, 14, 2);
        break;
      }
      case 'laptop':
        px(g, '#8a5a36', X, Y + 18, W, 5); px(g, '#a8744a', X, Y + 18, W, 2); px(g, '#6b4430', X + 2, Y + 23, 3, 9); px(g, '#6b4430', X + W - 5, Y + 23, 3, 9);
        px(g, '#9aa3b5', X + 8, Y + 8, 16, 10); px(g, '#7cc45a', X + 9, Y + 9, 14, 8); px(g, '#c9cfdb', X + 6, Y + 18, 20, 2);
        px(g, '#ffffff', X + 11, Y + 11, 6, 1); px(g, '#ffffff', X + 11, Y + 13, 9, 1);
        break;
      case 'whiteboard':
        px(g, '#9aa3b5', X + 1, Y + 2, W - 2, H - 4); px(g, '#ffffff', X + 3, Y + 4, W - 6, H - 9); px(g, '#9aa3b5', X + 4, Y + H - 4, W - 8, 2);
        px(g, '#4f8dd9', X + 6, Y + 8, 14, 1); px(g, '#4f8dd9', X + 6, Y + 11, 10, 1); px(g, '#f08cb0', X + 24, Y + 8, 12, 9);
        px(g, '#ffffff', X + 26, Y + 10, 3, 5); px(g, '#ff6b8f', X + 6, Y + 15, 16, 1); px(g, '#5ab06a', X + 30, Y + 22, 8, 1);
        break;
      case 'poster': poster(g, X, Y, W, H, e.color, e.variant); break;
      case 'bigposter':
        px(g, '#c9a14a', X + 2, Y + 3, W - 4, H - 4); px(g, '#fff3f6', X + 4, Y + 5, W - 8, H - 8);
        px(g, '#e3768f', X + 4, Y + 5, W - 8, 8); px(g, '#ffffff', X + 6, Y + 7, 6, 4);
        for (let i = 0; i < 4; i++) px(g, '#f6c9d4', X + 6 + (i % 2) * 11, Y + 16 + Math.floor(i / 2) * 11, 9, 9);
        px(g, '#f28c28', X + 9, Y + 19, 2, 5); px(g, '#5cb2e6', X + 19, Y + 30, 4, 3); px(g, '#e3768f', X + 6, Y + 39, W - 12, 2);
        break;
      case 'tv': {
        px(g, '#6b4430', X + 1, Y + 20, W - 2, 12); px(g, '#8a5a36', X + 1, Y + 20, W - 2, 2); px(g, '#4a2f1a', X + 4, Y + 24, 10, 6); px(g, '#4a2f1a', X + 18, Y + 24, 10, 6);
        px(g, '#1f1f2a', X + 2, Y, W - 4, 19); const f = Math.floor(time / 350) % 4;
        px(g, ['#f08cb0', '#5ec8ff', '#ffd23f', '#7cc45a'][f], X + 4, Y + 2, W - 8, 14); px(g, '#ffffff', X + 13, Y + 6, 2, 6); px(g, '#ffffff', X + 15, Y + 7, 2, 4); px(g, '#ffffff', X + 17, Y + 8, 1, 2);
        break;
      }
      case 'trophy': {
        px(g, '#c92f4a', X - 2, Y + 18, 20, 14); px(g, '#e8566f', X - 2, Y + 18, 20, 2); px(g, '#ffd23f', X + 3, Y + 24, 10, 2);
        const glow = 0.5 + 0.5 * Math.sin(time / 260);
        g.globalAlpha = 0.25 + glow * 0.3; blob(g, X + 8, Y + 6, 11, '#fff6b0'); g.globalAlpha = 1;
        px(g, '#f2b52c', X + 2, Y, 12, 8); px(g, '#f2b52c', X, Y + 1, 2, 4); px(g, '#f2b52c', X + 14, Y + 1, 2, 4);
        px(g, '#f2b52c', X + 5, Y + 8, 6, 3); px(g, '#f2b52c', X + 6, Y + 11, 4, 3); px(g, '#c98a12', X + 3, Y + 14, 10, 4);
        px(g, '#fff27a', X + 4, Y + 1, 3, 5); px(g, '#c98a12', X + 7, Y + 3, 2, 3);
        break;
      }
      case 'robotarm':
        px(g, '#e9edf5', X, Y + 18, W, 14); px(g, '#c9cfdb', X, Y + 18, W, 2); px(g, '#9aa3b5', X + 2, Y + 30, W - 4, 2);
        px(g, '#2f3346', X + 6, Y + 13, 8, 5); px(g, '#f28c28', X + 8, Y + 4, 4, 10); px(g, '#2f3346', X + 8, Y + 2, 4, 3);
        px(g, '#f28c28', X + 11, Y + 1, 9, 3); px(g, '#2f3346', X + 19, Y + 1, 3, 3); px(g, '#9aa3b5', X + 21, Y + 4, 1, 4); px(g, '#9aa3b5', X + 23, Y + 4, 1, 4);
        [['#ff5a5a', 18, 13], ['#5ad17a', 23, 13], ['#4f8dd9', 20, 9]].forEach(([c, x, y]) => px(g, c, X + x, Y + y, 4, 4));
        break;
      case 'cork':
        px(g, '#6b4430', X + 1, Y + 1, W - 2, H - 3); px(g, '#c99a62', X + 3, Y + 3, W - 6, H - 7);
        [['#fffaf0', 5, 6, 9, 8], ['#ffd3e3', 16, 5, 8, 10], ['#d4f0ff', 27, 7, 10, 7], ['#fff3b0', 8, 17, 12, 7], ['#e3f7d4', 23, 17, 10, 8]]
          .forEach(([c, x, y, w, h]) => { if (x + w < W - 3) { px(g, c, X + x, Y + y, w, h); px(g, '#ff6b8f', X + x + w / 2, Y + y, 1, 1); } });
        if (e.medal) { blob(g, X + W - 9, Y + H - 11, 5, '#ffd76a'); blob(g, X + W - 9, Y + H - 11, 3, '#f2b52c'); px(g, '#4f8dd9', X + W - 12, Y + H - 21, 2, 6); px(g, '#ff6b8f', X + W - 8, Y + H - 21, 2, 6); }
        break;
      case 'lectern': {
        const glow = 0.5 + 0.5 * Math.sin(time / 300);
        g.globalAlpha = 0.2 + glow * 0.25; blob(g, X + 8, Y + 9, 10, '#fff6b0'); g.globalAlpha = 1;
        px(g, '#5b3a22', X + 3, Y + 29, 10, 3); px(g, '#6b4430', X + 6, Y + 15, 4, 14); px(g, '#8a5a36', X + 7, Y + 15, 1, 14);
        px(g, '#5b3a22', X, Y + 11, 16, 5); px(g, '#8a5a36', X + 1, Y + 11, 14, 3);
        px(g, '#fffaf0', X + 1, Y + 6, 6, 6); px(g, '#fffaf0', X + 9, Y + 6, 6, 6); px(g, '#d9cdb6', X + 7, Y + 6, 2, 6);
        for (let i = 0; i < 3; i++) { px(g, '#c9b89a', X + 2, Y + 7 + i * 2, 4, 1); px(g, '#c9b89a', X + 10, Y + 7 + i * 2, 4, 1); }
        px(g, '#f05a8c', X + 11, Y + 6, 2, 7);
        break;
      }
      case 'telescope':
        px(g, '#6b4430', X + 3, Y + 22, 2, 10); px(g, '#6b4430', X + 11, Y + 22, 2, 10); px(g, '#6b4430', X + 7, Y + 20, 2, 12);
        px(g, '#9479d6', X + 1, Y + 8, 16, 7); px(g, '#7d62c2', X + 1, Y + 13, 16, 2); px(g, '#ffd23f', X + 15, Y + 6, 3, 9); px(g, '#2f3346', X + 6, Y + 15, 4, 6);
        px(g, '#e9edf5', X - 3, Y + 1, 6, 4); px(g, '#5ec8ff', X - 2, Y + 2, 4, 2);
        break;
    }
  }

  // ================================================================ 상태
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } },
  };
  let playerId = store.get('cvv.player');
  if (!playerId) {
    playerId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'p-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    store.set('cvv.player', playerId);
  }
  let st = { points: 0, visited: [], myRating: null, rating: { avg: 0, count: 0 }, costs: { guestbook: 30, rating: 20, visit: 10 }, spotCount: ALL_SPOTS.length, media: { base: '', video: '' } };

  async function api(path, body) {
    const res = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
    const data = await res.json().catch(() => ({ error: '서버 응답을 읽을 수 없어요.' }));
    if (!res.ok) { const err = new Error(data.error || '오류가 발생했어요.'); err.status = res.status; throw err; }
    return data;
  }
  function applyState(s) {
    st = { ...st, ...s };
    $('hudPoints').textContent = st.points;
    $('hudFound').textContent = st.visited.length;
    $('hudTotal').textContent = st.spotCount;
    $('hudRating').textContent = st.rating.count ? st.rating.avg.toFixed(1) : '-';
    miniHint();
  }
  const setOnline = (ok) => $('hudOffline').classList.toggle('hidden', ok);
  async function refresh() {
    try { applyState(await api('/api/state?player=' + encodeURIComponent(playerId))); setOnline(true); } catch (e) { setOnline(false); }
    try { garden = (await api('/api/garden')).plots; } catch (e) { /* 다음 갱신 때 다시 시도 */ }
  }
  // 처음으로 미끼값만큼 G가 모이면 미니게임을 한 번 알려 준다
  async function claimDaily() {
    try {
      const res = await api('/api/daily', { player: playerId });
      applyState(res);
      if (res.awarded) setTimeout(() => toast(`🎁 오늘의 방문 선물 +${res.awarded}G! 내일 또 받을 수 있어요`, 3200), 700);
    } catch (e) { setOnline(false); }
  }
  function miniHint() {
    if (mode !== 'play' || st.points < st.costs.bait || store.get('cvv.minihint')) return;
    store.set('cvv.minihint', '1');
    setTimeout(() => toast('🎮 G가 모였어요! 연못 🎣 낚시와 🌱 꽃 심기를 해 보세요 (M: 지도)', 3600), 4300);
  }
  async function visit(id) {
    if (st.visited.includes(id)) return;
    try {
      const before = st.visited.length;
      const res = await api('/api/visit', { player: playerId, spot: id });
      applyState(res); setOnline(true);
      if (res.awarded) {
        toast(`+${res.awarded}G 획득! 💰`);
        if (res.visited.length === res.spotCount && before < res.spotCount) setTimeout(() => toast('🎉 마을의 모든 이야기를 발견했어요!'), 1500);
      }
    } catch (e) { setOnline(false); }
  }

  // ================================================================ 플레이어 / 장면 상태
  const me = { x: 20, y: 8, fromX: 20, fromY: 8, dir: 'down', moving: false, t: 0, step: 0 };
  let scene = town;
  let mode = 'title';          // title | play
  let dlg = null;
  let modalOpen = false;
  let path = null, pending = null;
  let fade = 0, fadeTo = null;
  const held = new Set();
  let tapped = null;
  const cam = { x: 0, y: 0 };
  // 화면 왼쪽 아래 미니맵: N 키로 보통(2배) → 작게(1배) → 숨김 순환
  const MM = { x: 6, y: 0, s: 2 };
  const setMiniSize = (s) => { MM.s = s; MM.y = VH - 6 - 28 * Math.max(s, 1); store.set('cvv.mm', String(s)); };
  const savedMini = store.get('cvv.mm');
  setMiniSize(['0', '1', '2'].includes(savedMini) ? Number(savedMini) : 2);

  const npcAt = (x, y) => scene.npcs.find((n) => n.x === x && n.y === y);
  const walkable = (x, y) => x >= 0 && y >= 0 && x < scene.w && y < scene.h && !scene.solid[y][x] && !npcAt(x, y);
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const inRect = (e, x, y) => x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h;
  const adjacentTo = (e, x, y) => !inRect(e, x, y) && x >= e.x - 1 && x <= e.x + e.w && y >= e.y - 1 && y <= e.y + e.h
    && (x >= e.x && x < e.x + e.w || y >= e.y && y < e.y + e.h);

  function entityRect(n) { return { x: n.x, y: n.y, w: 1, h: 1 }; }
  function targets() {
    return [...scene.npcs.map((n) => ({ type: 'npc', ref: n, ...entityRect(n), name: n.name })),
      ...scene.exhibits.map((e) => ({ type: 'exhibit', ref: e, x: e.x, y: e.y, w: e.w, h: e.h, name: e.name }))];
  }
  function nearby() {
    const [dx, dy] = DIRS[me.dir];
    const all = targets();
    return all.find((t) => inRect(t, me.x + dx, me.y + dy)) || all.find((t) => adjacentTo(t, me.x, me.y)) || null;
  }
  function doorAhead() {
    const [dx, dy] = DIRS[me.dir];
    return scene.doors.find((d) => d.x === me.x + dx && d.y === me.y + dy);
  }

  // ================================================================ 입력
  const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
  window.addEventListener('keydown', (e) => {
    if (modalOpen) { if (e.key === 'Escape') closeModal(); else if (modalKey) modalKey(e); return; }
    if (mode === 'title') { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGame(); } return; }
    // 가장 최근에 누른 방향이 이기도록 Set의 끝으로 옮긴다
    if (KEYMAP[e.key]) { held.delete(KEYMAP[e.key]); held.add(KEYMAP[e.key]); tapped = KEYMAP[e.key]; path = null; pending = null; e.preventDefault(); }
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'z' || e.key === 'Z') { e.preventDefault(); if (!e.repeat) action(); }
    if ((e.key === 'm' || e.key === 'M') && !dlg) openMap();
    if ((e.key === 'n' || e.key === 'N') && mode === 'play') { setMiniSize(MM.s === 2 ? 1 : MM.s === 1 ? 0 : 2); toast(MM.s ? `🗺️ 미니맵 ${MM.s === 2 ? '보통' : '작게'}` : '🗺️ 미니맵 숨김 (N 키로 다시 켜기)'); }
  });
  window.addEventListener('keyup', (e) => { if (KEYMAP[e.key]) held.delete(KEYMAP[e.key]); });
  window.addEventListener('blur', () => held.clear());
  document.querySelectorAll('.pad button').forEach((b) => {
    const dir = b.dataset.dir;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); held.delete(dir); held.add(dir); tapped = dir; path = null; b.setPointerCapture(e.pointerId); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => b.addEventListener(ev, () => held.delete(dir)));
  });
  $('btnA').addEventListener('pointerdown', (e) => { e.preventDefault(); if (mode === 'title') startGame(); else action(); });
  $('dialog').addEventListener('click', () => advanceDialog());

  canvas.addEventListener('pointerdown', (e) => {
    if (mode !== 'play' || modalOpen || fadeTo) return;
    if (dlg) { advanceDialog(); return; }
    const r = canvas.getBoundingClientRect();
    const sx = (e.clientX - r.left) / r.width * VW, sy = (e.clientY - r.top) / r.height * VH;
    // 미니맵 클릭 → 그곳으로 이동
    if (!scene.indoor && MM.s && sx >= MM.x && sx < MM.x + town.w * MM.s && sy >= MM.y && sy < MM.y + town.h * MM.s) {
      return travelToTile(Math.floor((sx - MM.x) / MM.s), Math.floor((sy - MM.y) / MM.s));
    }
    const wx = sx + cam.x, wy = sy + cam.y;
    const tx = Math.floor(wx / T), ty = Math.floor(wy / T);
    // 꽃밭 칸 클릭: 꽃이 있으면 누가 심었는지, 비어 있으면 걸어가서 심기
    if (!scene.indoor && town.ground[ty] && town.ground[ty][tx] === 'soil') {
      const f = garden[tx + ',' + ty];
      if (f) return toast(flowerLabel(f), 2400);
      return walkTo((x, y) => x === tx && y === ty, { type: 'plot', x: tx, y: ty });
    }
    // 클릭한 대상 찾기 (그림이 타일보다 큰 전시물/NPC는 살짝 위까지 인정)
    const hit = targets().find((t) => wx >= t.x * T - 2 && wx < (t.x + t.w) * T + 2 && wy >= t.y * T - (t.type === 'npc' ? 10 : 4) && wy < (t.y + t.h) * T + 2);
    if (hit) {
      if (adjacentTo(hit, me.x, me.y) && !me.moving) return interactWith(hit);
      return walkTo((x, y) => adjacentTo(hit, x, y), { type: 'interact', target: hit });
    }
    const house = scene.doors.find((d) => inRect(d.house, tx, ty) || (d.x === tx && d.y === ty));
    if (house) return walkTo((x, y) => x === house.x && y === house.y + 1, { type: 'enter', door: house });
    if (scene.exit && tx === scene.exit.x && ty >= scene.exit.y - 1) return walkTo((x, y) => x === scene.exit.x && y === scene.exit.y - 1, { type: 'exit' });
    walkTo((x, y) => x === tx && y === ty);
  });

  function walkTo(goal, then) {
    const key = (x, y) => y * scene.w + x;
    const prev = new Map([[key(me.x, me.y), null]]);
    const q = [[me.x, me.y]];
    let end = null;
    while (q.length) {
      const [x, y] = q.shift();
      if (goal(x, y)) { end = [x, y]; break; }
      for (const [dx, dy] of Object.values(DIRS)) {
        const nx = x + dx, ny = y + dy;
        if (!walkable(nx, ny) || prev.has(key(nx, ny))) continue;
        prev.set(key(nx, ny), [x, y]); q.push([nx, ny]);
      }
    }
    if (!end) { toast('거기엔 갈 수 없어요'); return; }
    const steps = [];
    for (let p = end; p && !(p[0] === me.x && p[1] === me.y); p = prev.get(key(p[0], p[1]))) steps.unshift(p);
    path = steps; pending = then || null;
    if (!steps.length) finishPath();
  }
  // 지도에서 고른 마을 타일로 이동 (집을 고르면 문까지 가서 들어감, 실내에 있으면 먼저 밖으로 나감)
  function travelToTile(tx, ty) {
    const go = () => {
      const door = town.doors.find((d) => inRect(d.house, tx, ty) || (d.x === tx && d.y === ty));
      if (door) return walkTo((x, y) => x === door.x && y === door.y + 1, { type: 'enter', door });
      const exact = walkable(tx, ty);
      walkTo((x, y) => (exact ? x === tx && y === ty : Math.abs(x - tx) + Math.abs(y - ty) <= 2));
    };
    if (scene.indoor) exitHouse(go); else go();
  }

  function finishPath() {
    const p = pending; path = null; pending = null;
    if (!p) return;
    if (p.type === 'interact') { interactWith(p.target); }
    else if (p.type === 'enter') { me.dir = 'up'; enterDoor(p.door); }
    else if (p.type === 'exit') { me.dir = 'down'; exitHouse(); }
    else if (p.type === 'plot') { plotAction(p.x, p.y); }
  }

  function action() {
    if (modalOpen || fadeTo) return;
    if (dlg) return advanceDialog();
    if (me.moving) return;
    if (!scene.indoor && town.ground[me.y][me.x] === 'soil') return plotAction(me.x, me.y);
    const t = nearby();
    if (t) return interactWith(t);
    const d = doorAhead();
    if (d) enterDoor(d);
  }
  function interactWith(t) {
    const dx = t.x + (t.w - 1) / 2 - me.x, dy = t.y + (t.h - 1) / 2 - me.y;
    me.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    if (t.type === 'npc') return startDialog(t.ref);
    const e = t.ref;
    if (e.action === 'guestbook') return openGuestbook();
    if (e.action === 'rating') return openRating();
    if (e.action === 'fishing') return openFishing();
    if (e.action === 'fishrank') return openFishRank();
    if (e.action === 'garden') return openGardenInfo();
    if (e === summaryOf(scene) && !st.visited.includes(e.id)) afterClose = '✨ 다른 전시물에도 ! 가 켜졌어요. 둘러보세요!';
    openDoc(e.id);
    visit(e.id);
  }

  // 방마다 가운데에 있는 요약 안내판 (캡스톤 홀은 트로피)
  const summaryOf = (sc) => sc.indoor && sc.exhibits.find((e) => e.kind === 'lectern' || e.id === 'cap_trophy');
  const summaryUnread = (sc) => { const s = summaryOf(sc); return !!s && !st.visited.includes(s.id); };

  // ================================================================ 장면 전환
  function transition(fn) { fadeTo = fn; }
  function enterDoor(d) {
    transition(() => {
      scene = scenes[d.to];
      me.x = me.fromX = scene.exit.x; me.y = me.fromY = scene.exit.y - 1; me.dir = 'up';
      scene.returnTo = { x: d.x, y: d.y + 1 };
      setPlace();
      if (summaryUnread(scene)) setTimeout(() => toast('📖 먼저 방 가운데 안내판부터 읽어 보세요!', 2600), 350);
    });
  }
  function exitHouse(then) {
    const back = scene.returnTo;
    transition(() => {
      scene = town;
      me.x = me.fromX = back.x; me.y = me.fromY = back.y; me.dir = 'down';
      setPlace();
      if (then) then();
    });
  }
  function setPlace() { $('hudPlace').textContent = scene.name; }

  // ================================================================ 대화
  const portrait = $('portrait').getContext('2d');
  function startDialog(n) {
    dlg = { n, i: 0, shown: 0 };
    $('dlgName').textContent = n.name;
    portrait.clearRect(0, 0, 16, 24);
    portrait.drawImage(NPC_SPRITES[n.sprite], 0, 0);
    $('dialog').classList.add('show');
    held.clear(); path = null;
  }
  function advanceDialog() {
    if (!dlg) return;
    const page = dlg.n.lines[dlg.i];
    if (dlg.shown < page.length) { dlg.shown = page.length; return; }
    dlg.i++; dlg.shown = 0;
    if (dlg.i >= dlg.n.lines.length) {
      const n = dlg.n; dlg = null;
      $('dialog').classList.remove('show');
      visit(n.id);
    }
  }

  let toastTimer;
  function toast(msg, ms = 1700) {
    const el = $('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  }
  let afterClose = null;   // 문서를 닫은 뒤 보여 줄 안내
  let modalKey = null;     // 모달이 열려 있을 때 키 입력을 받는 함수 (낚시)
  let garden = {};         // 방문자 꽃밭: 'x,y' → { name, kind, ts }

  // ================================================================ 마크다운 문서
  function safeUrl(u) {
    u = u.trim();
    return /^(https?:|mailto:)/i.test(u) || /^[\w./-]+$/.test(u) ? u : '#';
  }
  function inline(s) {
    return esc(s)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, a, u) => `<img alt="${a}" src="${safeUrl(u)}" loading="lazy"${a === '증명사진' ? ' class="profile"' : ''}>`)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${safeUrl(u)}" target="_blank" rel="noopener">${t}</a>`)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  }
  function videoHtml() {
    const v = st.media.video;
    if (!v) return '<p>영상 주소가 설정되지 않았어요.</p>';
    const yt = v.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" allowfullscreen title="졸업과제 발표 영상"></iframe>`;
    return `<video controls preload="metadata" playsinline src="${esc(safeUrl(v))}"></video>`;
  }
  function markdown(src) {
    src = src.replace(/\{\{MEDIA\}\}/g, st.media.base || '');
    const lines = src.replace(/\r/g, '').split('\n');
    let html = '', para = [], i = 0;
    const flush = () => { if (para.length) { html += `<p>${para.map(inline).join('<br>')}</p>`; para = []; } };
    while (i < lines.length) {
      const line = lines[i];
      if (/^```/.test(line)) {
        flush(); const code = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
        html += `<pre><code>${esc(code.join('\n'))}</code></pre>`; i++; continue;
      }
      if (!line.trim()) { flush(); i++; continue; }
      let m;
      if ((m = line.match(/^(#{1,3})\s+(.*)/))) { flush(); html += `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`; i++; continue; }
      if (/^---+\s*$/.test(line)) { flush(); html += '<hr>'; i++; continue; }
      if (line.trim() === '@video') { flush(); html += videoHtml(); i++; continue; }
      if (/^>\s?/.test(line)) {
        flush(); const q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
        html += `<blockquote>${q.map(inline).join('<br>')}</blockquote>`; continue;
      }
      if (/^\|/.test(line)) {
        flush(); const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
        const cells = (r) => r.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
        const body = rows.filter((r, k) => !(k === 1 && /^[|\s:-]+$/.test(r)));
        html += '<table><thead><tr>' + cells(body[0]).map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>'
          + body.slice(1).map((r) => '<tr>' + cells(r).map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
        continue;
      }
      if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
        flush(); const ordered = /^\s*\d+\./.test(line); const items = [];
        while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ''));
        const tag = ordered ? 'ol' : 'ul';
        html += `<${tag}>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</${tag}>`; continue;
      }
      para.push(line); i++;
    }
    flush();
    return html;
  }

  // ================================================================ 모달
  function openModal(title, html) {
    $('cardTitle').textContent = title;
    $('cardBody').innerHTML = html;
    $('cardBody').scrollTop = 0;
    $('modal').classList.add('show');
    modalOpen = true; held.clear(); path = null;
  }
  function closeModal() {
    $('modal').classList.remove('show');
    $('cardBody').querySelectorAll('video').forEach((v) => v.pause());
    $('cardBody').innerHTML = '';
    modalOpen = false;
    modalKey = null; stopFishing();
    if (afterClose) { toast(afterClose, 2600); afterClose = null; }
  }
  $('cardClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeModal(); });

  function openDoc(id) {
    const d = window.CV_DOCS[id];
    if (d) openModal(d.title, `<div class="doc">${markdown(d.md)}</div>`);
  }
  function openFullCv() {
    const order = ['home_summary', 'home_profile', 'cap_trophy', 'cap_data', 'cap_policy', 'lab_intro', 'lab_isaac', 'lab_ros', 'lab_vla', 'ws_summary',
      'ws_pc', 'ws_praise', 'ws_pnu', 'ws_pnuin', 'ws_db', 'ext_summary', 'ws_ongi', 'dcc_intro', 'dcc_seg', 'dcc_chimney', 'clubs',
      'home_skills', 'home_github', 'cap_poster'];
    openModal('📜 옥소미 CV 전체 보기', '<div class="doc">' + order.map((id, k) => `<section class="${k ? 'part' : ''}">${markdown(window.CV_DOCS[id].md)}</section>`).join('') + '</div>');
  }
  const fmtTime = (ts) => { const d = new Date(ts * 1000); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const renderEntries = (entries) => entries.length
    ? entries.map((e) => `<li><span class="when">${fmtTime(e.ts)}</span><span class="who">${esc(e.name)}</span>${esc(e.message)}</li>`).join('')
    : '<li style="color:var(--muted)">아직 방명록이 없어요. 첫 번째 주인공이 되어 주세요!</li>';

  async function openGuestbook() {
    const cost = st.costs.guestbook, enough = st.points >= cost;
    openModal('📮 마을 방명록', `
      <div class="sub">한 번 쓸 때 <b>💰${cost}G</b> · 내 지갑 <b>${st.points}G</b>${enough ? '' : ' · 집 안 전시물을 읽고 G를 모아 보세요!'}</div>
      <form id="gbForm">
        <input id="gbName" maxlength="20" placeholder="이름 (최대 20자)" autocomplete="nickname" ${enough ? '' : 'disabled'}>
        <textarea id="gbMsg" maxlength="200" placeholder="소미에게 응원 한마디 (최대 200자)" ${enough ? '' : 'disabled'}></textarea>
        <div class="msg" id="gbOut"></div>
        <div class="row"><button class="pink" ${enough ? '' : 'disabled'}>${cost}G 쓰고 남기기</button></div>
      </form>
      <ul class="entries" id="gbList"><li style="color:var(--muted)">불러오는 중…</li></ul>`);
    try { $('gbList').innerHTML = renderEntries((await api('/api/guestbook')).entries); setOnline(true); }
    catch (e) { $('gbList').innerHTML = `<li class="msg err">${esc(e.message)}</li>`; }
    $('gbForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const out = $('gbOut'), btn = ev.target.querySelector('button');
      btn.disabled = true;
      try {
        const res = await api('/api/guestbook', { player: playerId, name: $('gbName').value, message: $('gbMsg').value });
        applyState(res);
        $('gbList').innerHTML = renderEntries(res.entries);
        $('gbMsg').value = '';
        out.className = 'msg ok'; out.textContent = `방명록을 남겼어요! 고마워요 💗 (남은 G: ${res.points})`;
        store.set('cvv.wrote', '1');
        btn.disabled = res.points < cost;
      } catch (e) { out.className = 'msg err'; out.textContent = e.message; btn.disabled = false; }
    });
  }

  function openRating() {
    const cost = st.costs.rating, done = st.myRating != null, enough = st.points >= cost;
    let pick = st.myRating || 0;
    const summary = st.rating.count ? `현재 평균 <b>★ ${st.rating.avg.toFixed(2)}</b> (${st.rating.count}명 참여)` : '아직 아무도 별점을 남기지 않았어요.';
    openModal('⭐ 별 동상', `
      <div class="sub">이 CV가 마음에 들었다면 별점을 남겨 주세요! 1인 1회 · <b>💰${cost}G</b> · 내 지갑 <b>${st.points}G</b></div>
      <div class="big">${summary}</div>
      <div class="stars" id="stars">${[1, 2, 3, 4, 5].map((n) => `<button data-n="${n}" aria-label="${n}점" ${done || !enough ? 'disabled' : ''}>★</button>`).join('')}</div>
      <div class="msg big ${done ? 'ok' : ''}" id="rtOut">${done ? `★${st.myRating}점을 남겨 주셨어요. 고마워요!` : enough ? '' : '집 안 전시물을 읽고 G를 모아 보세요!'}</div>
      <div class="row"><button class="pink" id="rtSend" disabled>${cost}G 쓰고 별점 주기</button></div>`);
    const paint = () => $('stars').querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.n <= pick));
    paint();
    $('stars').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { pick = +b.dataset.n; paint(); $('rtSend').disabled = false; }));
    $('rtSend').addEventListener('click', async () => {
      $('rtSend').disabled = true;
      try { applyState(await api('/api/rating', { player: playerId, stars: pick })); openRating(); toast(`★${pick} 고마워요!`); }
      catch (e) { $('rtOut').className = 'msg big err'; $('rtOut').textContent = e.message; $('rtSend').disabled = false; }
    });
  }
  function openHelp() {
    openModal('❓ 플레이 방법', `<div class="doc">${markdown(`
## 🕹️ 조작
- **방향키 / WASD** 로 걷기 (모바일은 화면 아래 패드)
- 마우스로 **아무 곳이나 클릭**하면 그곳까지 걸어가요. 전시물·주민을 클릭하면 다가가서 바로 조사해요!
- **M** 키나 오른쪽 위 **🗺️ 지도** 버튼으로 마을 지도를 열 수 있어요. 가고 싶은 집을 누르면 자동으로 걸어가요!
- 왼쪽 아래 **미니맵**을 클릭해도 그곳으로 이동해요. 깜빡이는 점은 아직 안 본 전시물이 있는 집이에요.
- **N** 키를 누를 때마다 미니맵이 보통 → 작게 → 숨김으로 바뀌어요.
- 주민이나 전시물 앞에서 **Space / Enter / A** 로 대화·조사

## 🏠 집 안 구경하기
- 문 앞에서 **위쪽으로 걸어가면** 집에 들어가요. 나갈 때는 아래쪽 빨간 매트로!
- 벽의 포스터, 게시판, TV, 책장을 조사하면 문서가 열려요.

## 🎮 미니게임
- **🎣 연못 낚시** — 광장 동쪽 연못의 낚시터에서 미끼(${st.costs.bait}G)로 낚시! 물고기 크기는 랜덤, 큰 물고기는 🏆 월척 랭킹에
- **🌱 꽃 심기** — 마을 서쪽 꽃밭의 빈 칸에 ${st.costs.flower}G로 내 이름이 적힌 꽃을 심어요. 모든 방문자에게 보여요!

## 💰 G 모으기
- 🎁 **매일 방문 선물** — 하루에 한 번 마을에 오면 **${st.costs.daily}G**
- 🐟 **물고기 판매** — 낚은 물고기는 바로 팔려요. 희귀할수록 비싸서, 잘 낚으면 미끼값보다 더 벌 수 있어요
- 전시물을 처음 읽거나 주민과 처음 대화하면 **${st.costs.visit}G**
- 광장의 **📮 방명록**(${st.costs.guestbook}G), **⭐ 별 동상**(${st.costs.rating}G)에서 사용해요.

게임이 번거롭다면 오른쪽 위 **📜 CV 전체** 버튼으로 한 번에 볼 수 있어요.
`)}</div>`);
  }
  function openMap() {
    if (mode !== 'play' || modalOpen) return;
    const s = 14, W = town.w * s, H = town.h * s;
    const here = scene.indoor ? scene.returnTo : { x: me.x, y: me.y };
    const map = makeCanvas(W, H, (g) => {
      g.drawImage(MINI, 0, 0, W, H);
      g.textAlign = 'center'; g.textBaseline = 'middle';
      const label = (text, cx, cy, bg) => {
        g.font = `bold 15px ${FONT}`;
        const w = g.measureText(text).width + 14;
        px(g, '#5b3a22', cx - w / 2 - 2, cy - 13, w + 4, 26); px(g, bg, cx - w / 2, cy - 11, w, 22);
        g.fillStyle = '#3b2414'; g.fillText(text, cx, cy + 1);
      };
      town.houses.forEach((h) => {
        const unread = scenes[h.id].exhibits.filter((e) => !st.visited.includes(e.id)).length;
        label(h.name + (unread ? ` · ${unread}` : ' ✓'), (h.x + h.w / 2) * s, (h.y + h.h / 2) * s, unread ? '#ffe3ec' : '#fbf1dc');
      });
      label('📮 방명록', 16.5 * s, 13.2 * s, '#fbf1dc');
      label('⭐ 별점', 23 * s, 13.2 * s, '#fbf1dc');
      label('🌱 방문자 꽃밭', 7.5 * s, 14.5 * s, '#e3f7d4');
      label('🎣 낚시터', 29.5 * s, 15 * s, '#d4f0ff');
      blob(g, (here.x + 0.5) * s, (here.y + 0.5) * s, 10, '#5b3a22'); blob(g, (here.x + 0.5) * s, (here.y + 0.5) * s, 8, '#ff2f7a');
      g.font = `bold 11px ${FONT}`; g.fillStyle = '#fff'; g.fillText('나', (here.x + 0.5) * s, (here.y + 0.5) * s + 1);
    });
    map.className = 'bigmap';
    openModal('🗺️ 소미의 CV 밸리 지도', `
      <div class="sub">가고 싶은 곳을 누르면 그곳까지 걸어가요. 집을 누르면 문까지 가서 바로 들어가요! (숫자 = 아직 안 본 전시물)</div>
      <div id="mapSlot"></div>
      <div class="places">${town.houses.map((h) => `<button data-house="${h.id}">${esc(h.name)}</button>`).join('')}
        <button data-tile="17,13">📮 방명록</button><button data-tile="22,13">⭐ 별 동상</button>
        <button data-tile="26,15">🎣 낚시터</button><button data-tile="7,14">🌱 꽃밭</button></div>`);
    $('mapSlot').appendChild(map);
    map.addEventListener('click', (e) => {
      const r = map.getBoundingClientRect();
      const tx = Math.floor((e.clientX - r.left) / r.width * town.w), ty = Math.floor((e.clientY - r.top) / r.height * town.h);
      closeModal(); travelToTile(tx, ty);
    });
    $('cardBody').querySelectorAll('.places button').forEach((b) => b.addEventListener('click', () => {
      closeModal();
      if (b.dataset.house) { const h = town.houses.find((x) => x.id === b.dataset.house); travelToTile(h.door.x, h.door.y); }
      else { const [tx, ty] = b.dataset.tile.split(',').map(Number); travelToTile(tx, ty); }
    }));
  }
  // ================================================================ 미니게임: 꽃밭
  function plotAction(x, y) {
    const f = garden[x + ',' + y];
    if (f) return toast(flowerLabel(f), 2400);
    openPlant(x, y);
  }
  function openPlant(x, y) {
    const cost = st.costs.flower, enough = st.points >= cost;
    let kind = 'tulip';
    openModal('🌱 꽃 심기', `
      <div class="sub">씨앗 하나에 <b>💰${cost}G</b> · 내 지갑 <b>${st.points}G</b> · 심은 꽃은 마을에 오는 모든 사람에게 보여요!</div>
      <div class="seeds" id="seeds">${Object.entries(FLOWER_INFO).map(([k, f]) => `<button data-kind="${k}" class="${k === kind ? 'on' : ''}"><span>${f.emoji}</span>${f.name}</button>`).join('')}</div>
      <input id="plName" maxlength="12" placeholder="꽃에 붙일 내 이름 (최대 12자)" value="${esc(store.get('cvv.name') || '')}">
      <div class="msg" id="plOut">${enough ? '' : '집 안 전시물을 읽고 G를 모아 오세요!'}</div>
      <div class="row"><button class="pink" id="plGo" ${enough ? '' : 'disabled'}>${cost}G로 심기</button></div>`);
    $('seeds').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      kind = b.dataset.kind;
      $('seeds').querySelectorAll('button').forEach((o) => o.classList.toggle('on', o === b));
    }));
    $('plGo').addEventListener('click', async () => {
      const name = $('plName').value.trim();
      store.set('cvv.name', name);
      $('plGo').disabled = true;
      try {
        const res = await api('/api/plant', { player: playerId, x, y, kind, name });
        garden = res.plots; applyState(res); store.set('cvv.planted', '1');
        afterClose = `${FLOWER_INFO[kind].emoji} ${name}님의 ${FLOWER_INFO[kind].name}을(를) 심었어요!`;
        closeModal();
      } catch (e) {
        $('plOut').className = 'msg err'; $('plOut').textContent = e.message; $('plGo').disabled = false;
        if (e.status === 409) refresh();
      }
    });
  }
  function openGardenInfo() {
    const list = Object.values(garden).sort((a, b) => b.ts - a.ts);
    openModal('🌱 방문자 꽃밭', `<div class="doc">${markdown(`
# 🌱 방문자 꽃밭
마을에 다녀간 방문자들이 심은 꽃이에요. 지금 **${list.length} / 21칸**에 꽃이 피어 있어요.

## 꽃 심는 방법
- 울타리 안 **빈 밭 칸** 위에 서서 **Space** (또는 빈 칸을 클릭)
- 씨앗을 고르고 이름을 적으면 **${st.costs.flower}G**로 심어져요
- 꽃 위에 서거나 꽃을 클릭하면 누가 심었는지 볼 수 있어요`)}
      <h2>🌷 최근에 심은 꽃</h2>${list.length
        ? '<ul>' + list.map((f) => `<li>${flowerLabel({ ...f, name: esc(f.name) })} <span style="color:var(--muted)">· ${fmtTime(f.ts)}</span></li>`).join('') + '</ul>'
        : '<p>아직 아무도 꽃을 심지 않았어요. 첫 번째 정원사가 되어 주세요!</p>'}</div>`);
  }

  // ================================================================ 미니게임: 낚시
  let fishAnim = null;
  const fishTimers = [];
  function stopFishing() {
    if (fishAnim) cancelAnimationFrame(fishAnim);
    fishAnim = null;
    fishTimers.forEach(clearTimeout); fishTimers.length = 0;
  }
  function renderFishInfo(data) {
    const dex = data.dex || {};
    $('fiDex').innerHTML = data.species.map((f) => dex[f.id] != null
      ? `<div class="fish got r-${f.rarity}"><span>${f.emoji}</span>${esc(f.name)}<small>최고 ${dex[f.id]}cm</small></div>`
      : `<div class="fish"><span>❔</span>???<small>${f.rarity}</small></div>`).join('');
    $('fiDexCount').textContent = `${Object.keys(dex).length} / ${data.species.length}`;
    $('fiRank').innerHTML = data.rank.length
      ? data.rank.slice(0, 5).map((r, i) => `<li class="${r.me ? 'me' : ''}"><b>${['🥇', '🥈', '🥉'][i] || (i + 1) + '.'}</b> ${esc(r.name)} — ${r.fish.emoji} ${esc(r.fish.name)} ${r.fish.size}cm · <b>${r.fish.score || '-'}점</b></li>`).join('')
      : '<li>아직 기록이 없어요. 첫 월척의 주인공이 되어 보세요!</li>';
  }
  async function openFishing() {
    const cost = st.costs.bait;
    openModal('🎣 연못 낚시', `
      <div class="sub">미끼 하나에 <b>💰${cost}G</b> (낚았을 때만 써요) · 낚은 물고기는 바로 팔려서 <b>G로 돌아와요</b> · 내 지갑 <b id="fiPts">${st.points}G</b></div>
      <input id="fiName" maxlength="12" placeholder="랭킹에 올라갈 내 이름 (최대 12자)" value="${esc(store.get('cvv.name') || '')}">
      <div class="fish-stage">
        <ol class="fish-steps" id="fiSteps"><li data-s="idle">① 던지기</li><li data-s="wait">② 기다리기</li><li data-s="bite">③ 입질! 타이밍 맞춰 당기기</li></ol>
        <div class="pond-view" id="fiPond"><div class="bobber"></div><div class="bang">❗</div></div>
        <div class="fish-msg" id="fiMsg"><b>🎣 던지기</b>를 누르면 찌가 물에 떠요. <b>찌가 쏙 잠기면</b> 입질!</div>
        <div class="fish-bar hidden" id="fiBar"><div class="fish-zone" id="fiZone"></div><div class="fish-marker" id="fiMark"></div></div>
        <div class="fish-legend hidden" id="fiLegend"><span><i style="background:#d6f2c2"></i>성공</span><span><i style="background:#7cc45a"></i>좋아요</span><span><i style="background:#ffe066"></i>완벽!</span></div>
        <div id="fiResult"></div>
        <button class="pink" id="fiGo">🎣 던지기 <small>(Space)</small></button>
      </div>
      <div class="doc"><h2>📖 내 물고기 도감 <small id="fiDexCount"></small></h2><div class="dex" id="fiDex">불러오는 중…</div>
      <h2>🏆 월척 랭킹 TOP 5</h2><ol class="rank" id="fiRank"></ol></div>`);
    api('/api/fishing?player=' + encodeURIComponent(playerId)).then(renderFishInfo).catch(() => { $('fiDex').textContent = '도감을 불러오지 못했어요.'; });

    let phase = 'idle', zone = null, pos = 0;
    const msg = (html, err) => { $('fiMsg').innerHTML = html; $('fiMsg').classList.toggle('err', !!err); };
    // 단계 표시, 찌 그림, 버튼을 한 번에 맞춘다
    const setPhase = (p) => {
      phase = p;
      $('fiSteps').querySelectorAll('li').forEach((li) => li.classList.toggle('on', li.dataset.s === (p === 'reel' ? 'bite' : p)));
      $('fiPond').className = 'pond-view ' + p;
      const go = $('fiGo');
      go.classList.toggle('pulse', p === 'bite');
      go.disabled = p === 'wait' || p === 'reel';
      go.innerHTML = { idle: '🎣 던지기 <small>(Space)</small>', wait: '🌊 기다리는 중…', bite: '🪝 지금 당기기! <small>(Space)</small>', reel: '🎣 끌어올리는 중…' }[p];
      $('fiBar').classList.toggle('hidden', p !== 'bite');
      $('fiLegend').classList.toggle('hidden', p !== 'bite');
    };
    const idle = (text, err) => { stopFishing(); setPhase('idle'); if (text) msg(text, err); };
    const bite = () => {
      setPhase('bite');
      msg('❗ <b>입질이다!</b> 움직이는 바늘이 초록 칸 <b>가운데(노란 줄)</b>에 올 때 당기세요!');
      const w = 10 + Math.random() * 6;   // 초록 칸 너비(%) — 좁을수록 어렵다
      zone = { a: Math.random() * (100 - w), w };
      $('fiZone').style.left = zone.a + '%'; $('fiZone').style.width = w + '%';
      const speedBase = 120 + Math.random() * 40;   // 평균 속도 (초당 %)
      const wobble = 1.6 + Math.random() * 1.4, wavePhase = Math.random() * 6.28;
      let dir = Math.random() < 0.5 ? 1 : -1, last = performance.now();
      const t0 = last;
      pos = Math.random() * 100;
      const step = (now) => {
        // 방향은 양 끝에서만 바뀌고, 속도만 부드럽게 빨라졌다 느려졌다 한다
        const speed = speedBase * (1 + 0.45 * Math.sin((now - t0) / 1000 * wobble * Math.PI + wavePhase));
        pos += dir * speed * (now - last) / 1000; last = now;
        if (pos > 100) { pos = 200 - pos; dir = -1; }
        if (pos < 0) { pos = -pos; dir = 1; }
        $('fiMark').style.left = `calc(${pos}% - 3px)`;
        if (now - t0 > 3000) return idle('물고기가 도망갔어요… 🫧 <b>다시 던져</b> 보세요.');
        fishAnim = requestAnimationFrame(step);
      };
      fishAnim = requestAnimationFrame(step);
    };
    const cast = () => {
      const name = $('fiName').value.trim();
      if (!name) return msg('랭킹에 올라갈 <b>이름</b>을 먼저 적어 주세요!', true);
      if (st.points < cost) return msg(`G가 부족해요 (미끼 ${cost}G). 집 안 전시물을 읽거나 내일 방문 선물을 받아 오세요!`, true);
      store.set('cvv.name', name);
      $('fiResult').innerHTML = '';
      setPhase('wait');
      msg('🌊 찌가 둥둥… <b>찌가 쏙 잠기면</b> 입질이에요. 조금만 기다려요!');
      fishTimers.push(setTimeout(bite, 600 + Math.random() * 1000));
    };
    const reel = async () => {
      stopFishing();
      const inside = pos >= zone.a && pos <= zone.a + zone.w;
      if (!inside) return idle('앗, 초록 칸을 벗어났어요! <b>다시 던져</b> 보세요.', true);
      const accuracy = 1 - Math.abs(pos - (zone.a + zone.w / 2)) / (zone.w / 2);
      setPhase('reel'); msg('🎣 끌어올리는 중…');
      try {
        const res = await api('/api/fish', { player: playerId, name: $('fiName').value.trim(), accuracy });
        applyState(res); store.set('cvv.fished', '1');
        $('fiPts').textContent = res.points + 'G';
        const f = res.fish;
        $('fiResult').innerHTML = `<div class="catch r-${f.rarity}"><div class="big">${f.emoji}</div><b>${esc(f.name)}</b> <span class="tag">${f.rarity}</span>
          <div class="size">${f.size} cm</div><div class="sold">🏆 ${f.score}점 · 💰 +${f.price}G에 팔았어요</div>${res.record ? '<div class="rec">🎉 내 최고 점수 갱신!</div>' : ''}<small>타이밍 정확도 ${Math.round(accuracy * 100)}%</small></div>`;
        renderFishInfo(res);
        idle(f.rarity === '전설' ? '✨✨ <b>전설의 물고기</b>를 낚았어요!! ✨✨' : f.rarity === '영웅' ? '🔥 <b>영웅 등급</b> 물고기를 낚았어요!!' : '낚았다! 🎉 한 번 더 던져 볼까요?');
      } catch (e) { idle(e.message, true); }
    };
    const press = () => {
      $('fiGo').blur();
      if (phase === 'idle') cast();
      else if (phase === 'bite') reel();
      // 기다리는 중(wait)에는 버튼이 잠겨 있어서 실수로 당겨 실패하지 않는다
    };
    $('fiGo').addEventListener('click', press);
    modalKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      if (document.activeElement === $('fiName') && e.key === ' ') return;   // 이름 입력 중 띄어쓰기
      e.preventDefault();
      press();
    };
    setPhase('idle');
  }
  async function openFishRank() {
    openModal('🏆 월척 랭킹 게시판', '<div class="doc"><p>불러오는 중…</p></div>');
    try {
      const d = await api('/api/fishing?player=' + encodeURIComponent(playerId));
      const rows = d.rank.map((r, i) => `<tr class="${r.me ? 'me' : ''}"><td>${['🥇', '🥈', '🥉'][i] || i + 1}</td><td>${esc(r.name)}${r.me ? ' (나)' : ''}</td><td>${r.fish.emoji} ${esc(r.fish.name)}</td><td>${r.fish.rarity}</td><td>${r.fish.size}cm</td><td><b>${r.fish.score || '-'}점</b></td></tr>`).join('');
      $('cardBody').innerHTML = `<div class="doc"><h1>🏆 월척 랭킹 TOP 10</h1>
        <p>한 사람당 <b>최고 점수</b> 하나만 올라가요. 점수는 <b>희귀도가 먼저</b>, 같은 등급이면 <b>그 물고기 치고 얼마나 큰지</b>로 정해져요.</p>
        <table><thead><tr><th>등급</th><th>흔함</th><th>보통</th><th>희귀</th><th>영웅</th><th>전설</th></tr></thead>
        <tbody><tr><td>점수</td><td>100~200</td><td>300~600</td><td>1,000~2,000</td><td>3,000~6,000</td><td>10,000~20,000</td></tr></tbody></table>
        ${d.rank.length ? `<table><thead><tr><th>순위</th><th>이름</th><th>물고기</th><th>등급</th><th>크기</th><th>점수</th></tr></thead><tbody>${rows}</tbody></table>` : '<p>아직 기록이 없어요. 첫 월척의 주인공이 되어 보세요!</p>'}
        <h2>🐟 이 연못에 사는 물고기</h2>
        <ul>${d.species.map((f) => `<li>${d.dex[f.id] != null ? `${f.emoji} <b>${esc(f.name)}</b>` : '❔ ???'} — ${f.rarity}</li>`).join('')}</ul>
        <blockquote>💡 타이밍을 정확하게 맞출수록 <b>희귀한 물고기</b>와 <b>큰 물고기</b>가 잘 잡혀요. 전설의 물고기도 있대요…!</blockquote></div>`;
    } catch (e) { $('cardBody').innerHTML = `<div class="doc"><p class="msg err">${esc(e.message)}</p></div>`; }
  }
  $('btnMap').addEventListener('click', openMap);
  $('btnCv').addEventListener('click', openFullCv);
  $('btnHelp').addEventListener('click', openHelp);
  $('btnQuickCv').addEventListener('click', openFullCv);
  $('btnStart').addEventListener('click', () => startGame());

  function startGame() {
    if (mode !== 'title' || fadeTo) return;
    transition(() => {
      mode = 'play';
      $('title').classList.add('hidden');
      $('hud').classList.remove('hidden');
      setPlace();
      claimDaily();
      if (!store.get('cvv.helped')) { store.set('cvv.helped', '1'); setTimeout(() => startDialog(town.npcs[0]), 300); }
    });
  }

  // ================================================================ 업데이트
  const SPEED = 7.5;   // 초당 타일
  function update(dt, time) {
    // 화면 전환 페이드
    if (fadeTo) { fade = Math.min(1, fade + dt * 4); if (fade >= 1) { fadeTo(); fadeTo = null; } }
    else if (fade > 0) fade = Math.max(0, fade - dt * 4);

    updatePetals(dt);
    if (mode !== 'play') return;

    // 고양이 산책
    scene.npcs.forEach((n) => {
      n.fx += (n.x - n.fx) * Math.min(1, dt * 6); n.fy += (n.y - n.fy) * Math.min(1, dt * 6);
      if (!n.wander || dlg) return;
      n.next = (n.next || 0) - dt;
      if (n.next > 0) return;
      n.next = 1.5 + Math.random() * 2.5;
      const [dx, dy] = Object.values(DIRS)[Math.floor(Math.random() * 4)];
      const nx = n.x + dx, ny = n.y + dy, w = n.wander;
      if (nx >= w.x && nx < w.x + w.w && ny >= w.y && ny < w.y + w.h && !scene.solid[ny][nx] && !(nx === me.x && ny === me.y)) { n.x = nx; n.y = ny; n.flip = dx < 0; }
    });

    if (dlg) {
      const page = dlg.n.lines[dlg.i];
      dlg.shown = Math.min(page.length, dlg.shown + dt * 50);
      $('dlgText').textContent = page.slice(0, Math.floor(dlg.shown));
      $('prompt').classList.remove('show');
      return;
    }
    let carry = 0;   // 한 칸을 다 간 뒤 남은 이동량을 다음 칸에 이어 붙여 끊김을 없앤다
    if (me.moving) {
      const want = [...held].pop();
      const [cx, cy] = DIRS[me.dir];
      if (want && DIRS[want][0] === -cx && DIRS[want][1] === -cy) {
        // 반대 방향 키는 칸이 끝나기를 기다리지 않고 바로 돌아선다
        [me.x, me.fromX] = [me.fromX, me.x]; [me.y, me.fromY] = [me.fromY, me.y];
        me.t = 1 - me.t; me.dir = want; path = null; pending = null;
      }
      me.t += dt * SPEED;
      if (me.t >= 1) {
        carry = Math.min(me.t - 1, 0.5);
        me.moving = false; me.t = 0;
        if (path && !path.length) finishPath();
      }
    }
    if (!me.moving && !modalOpen && !fadeTo) {
      let dir = [...held].pop() || tapped;
      tapped = null;
      if (!dir && path && path.length) {
        const [nx, ny] = path[0];
        dir = nx > me.x ? 'right' : nx < me.x ? 'left' : ny > me.y ? 'down' : 'up';
        if (!walkable(nx, ny)) { path = null; pending = null; dir = null; } else path.shift();
      }
      if (dir) {
        me.dir = dir;
        const [dx, dy] = DIRS[dir];
        const nx = me.x + dx, ny = me.y + dy;
        const door = scene.doors.find((d) => d.x === nx && d.y === ny);
        if (door) enterDoor(door);
        else if (scene.exit && nx === scene.exit.x && ny === scene.exit.y) exitHouse();
        else if (walkable(nx, ny)) { me.fromX = me.x; me.fromY = me.y; me.x = nx; me.y = ny; me.moving = true; me.t = carry; me.step++; }
      }
    }
    // 안내 문구
    const t = !me.moving && !fadeTo && nearby();
    const d = !me.moving && !t && doorAhead();
    const prompt = $('prompt');
    const onPlot = !scene.indoor && !me.moving && town.ground[me.y][me.x] === 'soil';
    if (onPlot && !modalOpen) {
      const f = garden[me.x + ',' + me.y];
      prompt.textContent = f ? flowerLabel(f) : `🌱 빈 밭 · Space로 꽃 심기 (${st.costs.flower}G)`; prompt.classList.add('show');
    } else if (t && !modalOpen) { prompt.textContent = `${t.name} · Space`; prompt.classList.add('show'); }
    else if (d && !modalOpen) { prompt.textContent = `🚪 ${d.house.name} 들어가기 · ↑`; prompt.classList.add('show'); }
    else if (scene.exit && me.x === scene.exit.x && me.y === scene.exit.y - 1 && !modalOpen) { prompt.textContent = '🚪 밖으로 나가기 · ↓'; prompt.classList.add('show'); }
    else prompt.classList.remove('show');
  }

  // 벚꽃잎 파티클 (화면 좌표)
  const petals = Array.from({ length: 26 }, (_, i) => ({ x: hash(i, 1) * VW, y: hash(1, i) * VH, v: 8 + hash(i, 9) * 10, s: hash(i, 4) * 6.28 }));
  function updatePetals(dt) {
    petals.forEach((p) => {
      p.y += p.v * dt; p.x += Math.sin(p.s + p.y / 18) * 10 * dt + 4 * dt; p.s += dt;
      if (p.y > VH + 4) { p.y = -4; p.x = Math.random() * VW; }
      if (p.x > VW + 4) p.x = -4;
    });
  }
  function drawPetals(g) {
    petals.forEach((p, i) => { px(g, i % 3 ? '#ffc4d8' : '#ff9ec0', Math.round(p.x), Math.round(p.y), 2, 1); if (i % 2) px(g, '#ffe3ec', Math.round(p.x), Math.round(p.y) + 1, 1, 1); });
  }

  // ================================================================ 렌더
  function render(time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#1a1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (mode === 'title') renderTitle(time); else renderWorld(time);
    if (fade > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(20,10,18,${fade})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  }

  function renderWorld(time) {
    const mx = (me.moving ? me.fromX + (me.x - me.fromX) * me.t : me.x) * T;
    const my = (me.moving ? me.fromY + (me.y - me.fromY) * me.t : me.y) * T;
    const MW = scene.w * T, MH = scene.h * T;
    cam.x = MW <= VW ? (MW - VW) / 2 : Math.max(0, Math.min(MW - VW, mx + 8 - VW / 2));
    // 실내는 방을 화면 아래쪽에 붙여 위쪽 정보창과 겹치지 않게 한다
    cam.y = MH <= VH ? MH - VH : Math.max(0, Math.min(MH - VH, my + 8 - VH / 2));
    cam.x = Math.round(cam.x); cam.y = Math.round(cam.y);
    ctx.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
    ctx.drawImage(scene.groundCanvas, 0, 0);

    // 물결 반짝임
    if (!scene.indoor) {
      const f = Math.floor(time / 600) % 3;
      for (let y = 0; y < scene.h; y++) for (let x = 0; x < scene.w; x++) {
        if (scene.ground[y][x] !== 'water' || hash(x + f, y) < 0.6) continue;
        px(ctx, '#bfe6ff', x * T + 3 + Math.floor(hash(x, y + f) * 8), y * T + 6 + f * 2, 4, 1);
      }
    }
    // 벽에 붙은 전시물/장식은 바닥 다음에 먼저 그림
    scene.objects.filter((o) => o.wall).forEach((o) => drawObject(ctx, o, time));
    if (summaryUnread(scene)) drawGuidePath(summaryOf(scene), time);
    scene.exhibits.filter((e) => e.y + e.h <= 3).forEach((e) => drawExhibit(ctx, e, time));

    const items = [
      ...scene.objects.filter((o) => !o.wall).map((o) => ({ y: o.sortY, draw: () => drawObject(ctx, o, time) })),
      ...scene.exhibits.filter((e) => e.y + e.h > 3).map((e) => ({ y: e.y + e.h - 1, draw: () => drawExhibit(ctx, e, time) })),
      ...scene.npcs.map((n) => ({ y: n.fy, draw: () => drawNpc(n, time) })),
      ...(scene.indoor ? [] : Object.entries(garden).map(([k, f]) => {
        const [fx, fy] = k.split(',').map(Number);
        return { y: fy - 0.05, draw: () => drawFlower(fx, fy, f.kind, time) };
      })),
      { y: my / T + 0.01, draw: () => drawMe(mx, my) },
    ].sort((a, b) => a.y - b.y);
    items.forEach((it) => it.draw());

    // 표지판 / 미방문 표시
    if (!scene.indoor) town.houses.forEach((h) => drawSign(h, time));
    if (!scene.indoor) {
      drawPost('🎣 낚시터', 27.5 * T, 14 * T + 3);
      drawPost('📮 방명록 남기기', 17.5 * T, 11 * T - 1);
      drawPost('⭐ 별점 남기기', 22.5 * T, 11 * T - 1);
      if (!store.get('cvv.fished')) drawBang(27.5 * T, 13 * T + 5, time);
      if (!store.get('cvv.planted')) drawBang(8.5 * T, 10 * T + 4, time);
      if (!store.get('cvv.wrote')) drawBang(17.5 * T, 10 * T + 2, time);
      if (st.myRating == null) drawBang(22.5 * T, 10 * T + 2, time);
    }
    (scene.zones || []).forEach(drawZoneSign);
    // 안내판을 읽기 전에는 안내판만 표시하고, 다른 전시물의 ! 는 숨긴다
    const guide = summaryUnread(scene) && summaryOf(scene);
    if (guide) drawGuide(guide, time);
    scene.exhibits.forEach((e) => { if (guide) return; if (!e.action && !st.visited.includes(e.id)) drawBang(e.x * T + e.w * T / 2, (e.kind === 'trophy' || e.kind === 'telescope' || e.kind === 'lectern' ? e.y * T - 4 : e.y * T + (e.y < 3 ? 2 : -2)), time); });
    scene.npcs.forEach((n) => { if (!st.visited.includes(n.id)) drawBang(n.fx * T + 8, n.fy * T + (n.sprite === 'cat' ? -2 : -14), time); });

    ctx.setTransform(S, 0, 0, S, 0, 0);
    if (!scene.indoor) drawPetals(ctx);
    // 은은한 비네트
    const grd = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.45, VW / 2, VH / 2, VW * 0.65);
    grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, scene.indoor ? 'rgba(30,10,20,.35)' : 'rgba(60,20,40,.18)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, VW, VH);
    if (!scene.indoor) drawMinimap(mx / T, my / T, time);
  }

  function drawMinimap(pxT, pyT, time) {
    if (!MM.s) {
      ctx.font = `5px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillText('N: 미니맵 · M: 지도', 6, VH - 5);
      return;
    }
    const { x, y, s } = MM, W = town.w * s, H = town.h * s;
    px(ctx, '#5b3a22', x - 3, y - 3, W + 6, H + 6); px(ctx, '#b98352', x - 2, y - 2, W + 4, H + 4);
    ctx.globalAlpha = 0.92; ctx.drawImage(MINI, x, y, W, H); ctx.globalAlpha = 1;
    const blink = Math.floor(time / 400) % 2;
    town.houses.forEach((h) => {
      if (scenes[h.id].exhibits.some((e) => !st.visited.includes(e.id))) px(ctx, blink ? '#ff2f7a' : '#ffffff', x + h.door.x * s, y + (h.door.y + 1) * s, s, s);
    });
    town.npcs.forEach((n) => px(ctx, st.visited.includes(n.id) ? '#ffffff' : '#ffd23f', x + n.x * s, y + n.y * s, s, s));
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 0.5;
    ctx.strokeRect(x + cam.x / T * s, y + cam.y / T * s, VW / T * s, VH / T * s);
    px(ctx, '#5b3a22', x + Math.round(pxT * s) - 1, y + Math.round(pyT * s) - 1, s + 2, s + 2);
    px(ctx, blink ? '#ff2f7a' : '#ff8fb8', x + Math.round(pxT * s), y + Math.round(pyT * s), s, s);
    ctx.font = `5px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#fff'; ctx.fillText(s === 2 ? 'M: 지도 · N: 크기' : 'M · N', x, y - 4);
  }

  function shadow(x, y, w = 10) { ctx.fillStyle = 'rgba(40,20,20,.22)'; ctx.fillRect(Math.round(x) + 8 - w / 2, Math.round(y) + 14, w, 3); }
  function drawMe(x, y) {
    const frame = me.moving ? 1 + (me.step % 2) : 0;
    shadow(x, y);
    ctx.drawImage(ME[me.dir][frame], Math.round(x), Math.round(y) - 7);
  }
  function drawNpc(n, time) {
    const x = n.fx * T, y = n.fy * T;
    const bob = n.sprite === 'cat' ? 0 : Math.floor(time / 450 + n.home.x) % 2;
    shadow(x, y, n.sprite === 'cat' ? 9 : 10);
    if (n.flip) { ctx.save(); ctx.translate(Math.round(x) + 16, 0); ctx.scale(-1, 1); ctx.drawImage(NPC_SPRITES[n.sprite], 0, Math.round(y) - 7 - bob); ctx.restore(); }
    else ctx.drawImage(NPC_SPRITES[n.sprite], Math.round(x), Math.round(y) - 7 - bob);
  }
  function drawBang(x, y, time) {
    const by = Math.round(y + Math.sin(time / 220 + x) * 1.5);
    x = Math.round(x);
    px(ctx, '#5b3a22', x - 3, by - 7, 7, 10); px(ctx, '#ffd23f', x - 2, by - 6, 5, 8);
    px(ctx, '#5b3a22', x - 1, by - 5, 2, 4); px(ctx, '#5b3a22', x - 1, by, 2, 1);
  }
  // 문 매트 → 안내판까지 반짝이는 발자국 (바닥 레이어라 캐릭터보다 먼저 그린다)
  function drawGuidePath(g, time) {
    const x = scene.exit.x * T, top = g.y + g.h, step = Math.floor(time / 220);
    for (let ty = scene.exit.y - 1, i = 0; ty >= top; ty--, i++) {
      if (ty === me.y && x === me.x * T) continue;   // 서 있는 칸은 비워 둔다
      const on = (step - i) % 4;
      ctx.globalAlpha = on === 0 ? 1 : on === 1 ? 0.7 : 0.4;
      [[3, 8], [9, 2]].forEach(([fx, fy]) => {
        px(ctx, '#5b3a22', x + fx - 1, ty * T + fy - 1, 6, 7);
        px(ctx, '#ff8fb8', x + fx, ty * T + fy, 4, 5); px(ctx, '#fff3f7', x + fx + 1, ty * T + fy + 1, 2, 2);
      });
    }
    ctx.globalAlpha = 1;
  }
  // 안내판 위 "여기부터!" 말풍선
  function drawGuide(g, time) {
    const cx = (g.x + g.w / 2) * T, cy = g.y * T - 9 + Math.sin(time / 220) * 1.5;
    ctx.font = `6px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const label = '📖 여기부터!', w = Math.ceil(ctx.measureText(label).width) + 8;
    px(ctx, '#5b3a22', cx - w / 2 - 1, cy - 6, w + 2, 11); px(ctx, '#fff3f7', cx - w / 2, cy - 5, w, 9);
    px(ctx, '#5b3a22', cx - 1, cy + 5, 3, 2);
    ctx.fillStyle = '#c2185b'; ctx.fillText(label, cx, cy);
  }
  const FLOWER_INFO = {
    tulip: { name: '튤립', emoji: '🌷', c: '#ff7aa8', c2: '#ffb3cd' },
    rose: { name: '장미', emoji: '🌹', c: '#e8445a', c2: '#ff8a9a' },
    sunflower: { name: '해바라기', emoji: '🌻', c: '#ffd23f', c2: '#8a5a36' },
    lavender: { name: '라벤더', emoji: '💜', c: '#a97ae0', c2: '#d4bdf5' },
    daisy: { name: '데이지', emoji: '🌼', c: '#ffffff', c2: '#ffd23f' },
    sakura: { name: '벚꽃 묘목', emoji: '🌸', c: '#f5a9c6', c2: '#ffd3e3' },
  };
  const flowerLabel = (f) => { const i = FLOWER_INFO[f.kind] || FLOWER_INFO.tulip; return `${i.emoji} ${f.name}님이 심은 ${i.name}`; };
  function drawFlower(x, y, kind, time) {
    const X = x * T, Y = y * T, f = FLOWER_INFO[kind] || FLOWER_INFO.tulip;
    const sway = Math.round(Math.sin(time / 500 + x * 1.7 + y) * 0.8);
    const cx = X + 8 + sway, cy = Y + 3;
    if (kind === 'sakura') {
      px(ctx, '#7a4a35', X + 7, Y + 2, 2, 11); blob(ctx, cx, cy - 1, 5, f.c); blob(ctx, cx - 1, cy - 2, 3, f.c2);
      return;
    }
    px(ctx, '#3f8a32', X + 7, Y + 4, 2, 9); px(ctx, '#5aa845', X + 4, Y + 8, 3, 2); px(ctx, '#5aa845', X + 9, Y + 6, 3, 2);
    if (kind === 'sunflower') { blob(ctx, cx, cy, 4, f.c); blob(ctx, cx, cy, 2, f.c2); }
    else if (kind === 'lavender') { for (let i = 0; i < 4; i++) px(ctx, i % 2 ? f.c2 : f.c, cx - 1, cy - 3 + i * 2, 3, 2); }
    else if (kind === 'daisy') {
      [[-3, 0], [3, 0], [0, -3], [0, 3]].forEach(([dx, dy]) => px(ctx, f.c, cx + dx - 1, cy + dy - 1, 3, 3));
      px(ctx, f.c2, cx - 1, cy - 1, 3, 3);
    } else {
      px(ctx, f.c, cx - 3, cy - 2, 7, 5); px(ctx, f.c2, cx - 2, cy - 1, 2, 2);
      px(ctx, f.c, cx - 3, cy - 4, 2, 2); px(ctx, f.c, cx + 2, cy - 4, 2, 2);
      if (kind === 'rose') px(ctx, '#b82a40', cx - 1, cy, 3, 1);
    }
  }
  function drawPost(text, cx, cy) {
    ctx.font = `6px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = Math.ceil(ctx.measureText(text).width) + 8;
    px(ctx, '#5b3a22', cx - w / 2 - 1, cy - 5, w + 2, 10); px(ctx, '#d9a46a', cx - w / 2, cy - 4, w, 8);
    ctx.fillStyle = '#2b1a10'; ctx.fillText(text, cx, cy);
  }
  function drawZoneSign(z) {
    const cx = (z.x0 + z.x1 + 1) / 2 * T, cy = 5;
    ctx.font = `6px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = Math.ceil(ctx.measureText(z.label).width) + 8;
    px(ctx, '#5b3a22', cx - w / 2 - 1, cy - 5, w + 2, 10); px(ctx, z.sign, cx - w / 2, cy - 4, w, 8);
    ctx.fillStyle = '#2b1a10'; ctx.fillText(z.label, cx, cy);
  }
  function drawSign(h, time) {
    const unread = scenes[h.id].exhibits.filter((e) => !st.visited.includes(e.id)).length;
    const cx = (h.x + h.w / 2) * T, cy = h.y * T + Math.floor(h.h * T * 0.42) + 1;
    ctx.font = `7px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = Math.ceil(ctx.measureText(h.name).width) + 8;
    px(ctx, '#5b3a22', cx - w / 2 - 1, cy - 6, w + 2, 11); px(ctx, '#b98352', cx - w / 2, cy - 5, w, 9); px(ctx, '#d9a46a', cx - w / 2, cy - 5, w, 1);
    ctx.fillStyle = '#3b2414'; ctx.fillText(h.name, cx, cy);
    if (unread) {
      const bx = cx + w / 2 - 2, by = cy - 8 + Math.sin(time / 260) * 1;
      px(ctx, '#5b3a22', bx - 1, by - 5, 11, 9); px(ctx, '#f08cb0', bx, by - 4, 9, 7);
      ctx.fillStyle = '#fff'; ctx.font = `6px ${FONT}`; ctx.fillText(String(unread), bx + 4.5, by - 0.5);
    }
  }

  // ---------------------------------------------------------------- 타이틀 장면
  const titleHome = town.houses[0].canvas;
  function renderTitle(time) {
    ctx.setTransform(S, 0, 0, S, 0, 0);
    const sky = ctx.createLinearGradient(0, 0, 0, VH);
    sky.addColorStop(0, '#8fb8ff'); sky.addColorStop(0.5, '#ffc4dc'); sky.addColorStop(1, '#ffe2c4');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
    blob(ctx, 262, 46, 16, '#fff3c4'); blob(ctx, 262, 46, 12, '#ffe58a');
    for (let i = 0; i < 4; i++) {
      const cx = ((time / (60 + i * 25)) + i * 90) % (VW + 80) - 40, cy = 18 + i * 13;
      blob(ctx, Math.round(cx), cy, 6, '#ffffff'); blob(ctx, Math.round(cx) + 8, cy + 2, 5, '#ffffff'); blob(ctx, Math.round(cx) - 8, cy + 3, 4, '#fff6fb');
    }
    const hill = (base, amp, freq, col, off) => { ctx.fillStyle = col; for (let x = 0; x < VW; x++) { const y = Math.round(base + Math.sin((x + off) / freq) * amp + Math.sin((x + off) / (freq * 0.37)) * amp * 0.4); ctx.fillRect(x, y, 1, VH - y); } };
    hill(112, 8, 40, '#c9a8e0', 0);
    hill(126, 7, 30, '#9fd07a', 60);
    ctx.drawImage(titleHome, 196, 150 - titleHome.height + 6);
    [[24, 'cherry'], [60, 'oak'], [150, 'cherry'], [290, 'cherry']].forEach(([x, k]) => ctx.drawImage(TREE[k], x, 108));
    hill(148, 3, 22, '#86c45a', 10);
    for (let x = 0; x < VW; x += 7) {
      const h1 = hash(x, 2);
      if (h1 > 0.5) { px(ctx, '#4f9a3c', x + 1, 152 + Math.floor(h1 * 20), 1, 3); px(ctx, ['#ff8fb8', '#ffffff', '#ffd23f'][x % 3], x, 151 + Math.floor(h1 * 20), 3, 2); }
    }
    ctx.drawImage(ME.down[Math.floor(time / 350) % 2 ? 0 : 0], 120, 140 + (Math.floor(time / 500) % 2));
    ctx.drawImage(NPC_SPRITES.cat, 138, 141);
    drawPetals(ctx);
  }

  // ================================================================ 루프
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt, now);
    render(now);
    requestAnimationFrame(loop);
  }

  applyState({});
  refresh();
  setInterval(refresh, 30000);
  (document.fonts && document.fonts.load ? document.fonts.load(`12px ${FONT}`) : Promise.resolve()).catch(() => {}).finally(() => requestAnimationFrame(loop));

  // 디버그/테스트용: 콘솔에서 상태 확인
  window.__cvv = { scenes, me, get scene() { return scene; }, ALL_SPOTS, enter: (id) => enterDoor(town.doors.find((d) => d.to === id)), start: startGame, refresh,
    tick: (n = 20) => { for (let i = 0; i < n; i++) { const t = performance.now() + i * 50; update(0.05, t); render(t); } } };
})();
