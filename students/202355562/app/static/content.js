/* 집 안 전시물(포스터, 게시판, TV …)을 클릭하면 열리는 문서들.
 * 마크다운으로 작성하고 game.js의 작은 렌더러가 HTML로 바꾼다.
 *   {{MEDIA}}  → 서버 설정(MEDIA_BASE)의 미디어 주소
 *   @video     → 서버 설정(VIDEO_URL)의 졸업과제 영상 플레이어
 */
window.CV_DOCS = {
  // ------------------------------------------------------------ 소미의 집
  home_profile: {
    title: '🌸 옥소미 자기소개',
    md: `
# 안녕하세요, 옥소미입니다!

![증명사진]({{MEDIA}}profile.webp)

**부산대학교 정보컴퓨터공학부 컴퓨터공학전공** (2023.03 – 2027.02 졸업 예정)

> 로봇이 보고, 이해하고, 스스로 움직이게 만드는 **Physical AI**를 공부하고 있어요.

## 관심 연구 분야
- **Vision-Language-Action (VLA)** 모델
- **Robot Manipulation** — 로봇팔로 물체를 집고, 옮기고, 쌓기
- **Reinforcement Learning** · **Sim-to-Real** 전이
- **Robot Foundation Models**

## 지금 하고 있는 것
- 🔬 **DTPLab 학부연구생** (2026.01 – 현재)
- 🦾 졸업과제 **LeRobot SO-101 로봇팔 제어** — 피지컬 AI 트랙 성능 **1위**

## 연락처
- 📧 [osm0071@pusan.ac.kr](mailto:osm0071@pusan.ac.kr)
- 🐙 [github.com/oxomi](https://github.com/oxomi)

---
마을 곳곳의 집에 들어가 포스터와 게시판을 둘러보세요. 처음 읽을 때마다 **💰 10G**를 드려요!
`,
  },
  home_summary: {
    title: '📖 소미의 집 안내판',
    md: `
# 📖 소미의 집 안내판

> 📍 **지금 있는 곳: 🌸 소미의 집**
> 마을 주인 옥소미가 사는 집이에요. 소미가 어떤 사람인지, 그리고 마을 어디에 무엇이 있는지 안내해 드릴게요.

## 🗺️ 이 방 둘러보기
| 위치 | 전시물 | 볼 수 있는 내용 |
|---|---|---|
| ⬅️ 왼쪽 벽 | 🌸 자기소개 액자 | 증명사진, 관심 연구 분야, 연락처 |
| ⬆️ 가운데 책상 | 💻 소미의 컴퓨터 | GitHub 프로젝트 목록 |
| ➡️ 오른쪽 벽 | 📚 기술 책장 | 다뤄 본 기술 스택 |

## 🙋 옥소미는요
로봇이 보고, 이해하고, 움직이게 만드는 **Physical AI**를 공부하는 부산대학교 정보컴퓨터공학부 학생이에요.

## ⭐ 하이라이트
- 🔬 부산대학교 **DTPLab 학부연구생** (2026.01 – 현재)
- 🏆 졸업과제 피지컬 AI 트랙 **성능 1위** (블록 옮기기 4.95/5, 쌓기 4.6/5)
- 🏅 2025 PNU SW 창의융합 해커톤 **최우수상** — 온기 (백엔드)
- 🛰️ 데이터 크리에이터 캠프 — 산업단지 분할 **mIoU 0.977**
- 🎓 동아리 — 정보보안 **구) Keeper 부회장**, 인공지능 동아리 **AID**, IT 서비스 동아리 **APPTIVE** 백엔드 트랙

## 🏘️ 다른 집에는요
| 집 | 들어 있는 이야기 |
|---|---|
| 🔬 **DTPLab 연구실** | 학부연구생 — Isaac Sim 강화학습, ROS 로봇 시스템, SO-101 모방학습 비교 |
| 🏆 **캡스톤 홀** | 졸업과제 — LeRobot SO-101 로봇팔 제어, **성능 1위** |
| 🔧 **프로젝트 공방** | 팀 프로젝트 — 주로 **백엔드**, AWS 배포·CI/CD |
| 🎪 **대외활동 센터** | 데이터 크리에이터 캠프, SW 해커톤 **최우수상**, 동아리 |

## 🎮 G로 즐기는 미니게임
| 장소 | 놀이 | 비용 |
|---|---|---|
| 🎣 광장 동쪽 **연못 낚시터** | 타이밍 낚시 — 물고기 8종 도감 모으기, 🏆 **월척 랭킹** 도전 | 미끼 10G |
| 🌱 마을 서쪽 **방문자 꽃밭** | 내 이름이 적힌 꽃 심기 — 다른 방문자들에게도 보여요 | 씨앗 15G |

길을 잃으면 **M** 키로 지도를 열어 보세요!
---
💡 전시물 앞에서 **Space**를 누르거나 클릭하면 자세히 볼 수 있어요. 처음 보는 전시물은 💰**10G**!
`,
  },
  home_skills: {
    title: '📚 기술 책장',
    md: `
# 기술 스택

## 🤖 AI · 로보틱스
| 분야 | 다뤄 본 것 |
|---|---|
| 딥러닝 | PyTorch, ACT, SmolVLA, Diffusion Policy, U-Net++, YOLOv8-pose, KLUE-BERT |
| 강화학습 | PPO, SAC, Residual RL, Reward Shaping |
| 로봇 / 시뮬레이션 | ROS, LeRobot, Isaac Sim, MuJoCo, NVIDIA Jetson |

## 🧩 백엔드 · 인프라
| 분야 | 다뤄 본 것 |
|---|---|
| 서버 | Java · Spring Boot, Node.js · Express, gRPC |
| 데이터베이스 | MySQL |
| 클라우드 / DevOps | AWS (App Runner, RDS, S3), GitHub Actions CI/CD, Linux, Git |
| 컨테이너 | Podman, OpenShift (바로 이 마을이 OpenShift 위에서 돌아가요!) |

## 💬 언어
\`Python\` \`C++\` \`Java\` \`Kotlin\` \`JavaScript\` \`TypeScript\` \`C\`
`,
  },
  home_github: {
    title: '💻 소미의 컴퓨터 — GitHub',
    md: `
# 🐙 github.com/oxomi

## 대표 프로젝트
- **[kidzania-family](https://github.com/kidzania-family)** — 🏆 졸업과제: LeRobot SO-101 로봇팔 제어 (피지컬 AI 트랙 성능 1위)
- **[PNUSW-2025-OnGi-10](https://github.com/oxomi/PNUSW-2025-OnGi-10)** — 🏅 해커톤 최우수상, 가족 건강 소통 앱 *온기* (백엔드)
- **[ComTogether](https://github.com/ApptiveDev/ComTogether)** — AI 기반 PC 부품 호환성 분석 & 전문가 상담 (APPTIVE · 백엔드)
- **[PPP](https://github.com/PNU-PPP/PPP)** — PNU 학사 도우미 앱 *피플플*
- **[PraisePrisonApp](https://github.com/oxomi/PraisePrisonApp)** — 칭찬감옥: 나를 칭찬하는 SNS 일기 앱 (Kotlin)
- **[PNUin](https://github.com/oxomi/PNUin)** — 웹응용프로그래밍 텀프로젝트 (Node.js, Express)
- **[db_Termproject](https://github.com/oxomi/db_Termproject)** — 탄소중립 스마트 SCM 플랫폼 DB 설계
- **[pixel-cv-quest](https://github.com/oxomi/pixel-cv-quest)** — 지금 보고 있는 이 마을! (OpenShift 배포)
`,
  },

  // ------------------------------------------------------------ DTPLab 연구실
  lab_intro: {
    title: '📖 DTPLab 연구실 안내판',
    md: `
# 📖 DTPLab 연구실 안내판

> 📍 **지금 있는 곳: 🔬 DTPLab 연구실**
> 소미가 **학부연구생**으로 있는 연구실이에요 (2026.01 – 현재). 로봇에게 보고·판단하고·움직이는 법을 가르치는 연구를 하고 있어요.

## 🗺️ 이 방 둘러보기
| 위치 | 전시물 | 볼 수 있는 내용 |
|---|---|---|
| ⬅️ 왼쪽 벽 | 🧪 Isaac Sim 강화학습 포스터 | Dofbot pick-and-place 환경 구축, PPO·SAC 학습 |
| ⬆️ 가운데 벽 | 📊 SO-101 모델 비교 화이트보드 | 원격조작 데이터셋, ACT·SmolVLA·Diffusion Policy 비교 |
| ➡️ 오른쪽 벽 | 📡 ROS 시스템 포스터 | GPU 서버 ↔ 로봇 실시간 통신 파이프라인 |

## 🔬 연구 요약
- **연구 분야**: Vision-Language-Action(VLA), 강화학습, Sim-to-Real 로봇 매니퓰레이션
- **시뮬레이션** — Isaac Sim에서 강화학습 환경을 직접 만들고 보상 설계와 Sim-to-Real 문제를 분석
- **모방학습** — 실물 로봇 시연 데이터로 여러 정책 모델을 학습·비교
- **시스템** — 무거운 추론은 GPU 서버, 제어는 로봇에서 하는 분산 구조 설계

> "시뮬레이션에서 배운 것을 실제 로봇에서 그대로 쓰려면 무엇이 필요할까?" — 요즘 가장 많이 하는 고민이에요.
---
💡 전시물 앞에서 **Space**를 누르거나 클릭하면 자세히 볼 수 있어요. 처음 보는 전시물은 💰**10G**!
`,
  },
  lab_isaac: {
    title: '🧪 Isaac Sim 강화학습 (Dofbot)',
    md: `
# Isaac Sim 강화학습 — Dofbot Pick & Place

## 한 일
- **Isaac Sim**에서 로봇팔 매니퓰레이션 강화학습 환경을 직접 구축
- **PPO**, **SAC** 알고리즘으로 pick-and-place 정책 학습 실험
- **보상 설계(reward design)**가 학습 결과에 미치는 영향 분석
- 시뮬레이션 정책을 실물로 옮길 때 생기는 **Sim-to-Real 문제** 분석

## 배운 것
- on-policy(PPO)와 off-policy(SAC)의 샘플 효율·안정성 차이
- 보상이 조금만 어긋나도 로봇이 "보상만 챙기는" 이상한 행동을 배운다는 것
`,
  },
  lab_ros: {
    title: '📡 ROS 기반 로봇 시스템',
    md: `
# ROS 기반 로봇 시스템

## 한 일
- **GPU 서버 ↔ 실제 로봇** 사이에서 state(관절 상태)와 action(제어값)을 주고받는 통신 파이프라인 설계·구현
- 무거운 모델 추론은 GPU 서버에서, 제어는 로봇 쪽에서 하는 **분산 실시간 제어 시스템** 개발

\`\`\`
[Robot] --state--> [ROS] --> [GPU Server: Policy]
   ^                                  |
   +------------ action <-------------+
\`\`\`

이 경험이 졸업과제의 **서버(RTX 4090) + 엣지(Jetson) 비동기 추론** 구조로 이어졌어요.
`,
  },
  lab_vla: {
    title: '🖥️ SO-101 모방학습 모델 비교',
    md: `
# SO-101 모방학습 모델 비교

- SO-101 로봇팔 **원격조작(teleoperation) 데이터셋** 구축
- 같은 데이터로 세 가지 정책을 학습하고 비교

| 모델 | 특징 |
|---|---|
| **ACT** | Transformer 기반, 처음부터 학습. 가볍고 빠름 |
| **SmolVLA** | 이미지·언어로 사전학습된 VLA를 파인튜닝 |
| **Diffusion Policy** | 확산 모델로 행동 분포를 생성 |

세 모델 모두 **여러 스텝의 행동(action chunk)**을 한 번에 예측해서 움직임이 부드러워요.
`,
  },

  // ------------------------------------------------------------ 캡스톤 홀
  cap_trophy: {
    title: '📖 캡스톤 홀 안내 — 🏆 성능 1위 트로피',
    md: `
# 📖 캡스톤 홀 안내

> 📍 **지금 있는 곳: 🏆 캡스톤 홀**
> 소미의 **졸업과제**를 전시한 곳이에요. 가운데 트로피가 이 방의 안내판이에요!

## 🗺️ 이 방 둘러보기
| 위치 | 전시물 | 볼 수 있는 내용 |
|---|---|---|
| ⬅️ 왼쪽 벽 | 🖼️ 졸업과제 포스터 | 발표회 포스터 전체 (크게 보기 가능) |
| ↙️ 왼쪽 바닥 | 🦾 SO-101 로봇팔 전시대 | ACT를 고른 이유, 잔차 강화학습, 서버+엣지 비동기 추론 |
| ⬆️ 가운데 벽 | 📊 데이터 이야기 화이트보드 | 실물 데이터의 한계 → MuJoCo 시뮬레이션 3,200개 → Domain Randomization |
| ➡️ 오른쪽 | 📺 발표 영상 TV | 졸업과제 발표 영상 (약 11분) |

## 🏆 졸업과제 요약
**LeRobot SO-101을 활용한 지능형 로봇팔 제어 : Sim2Real 및 잔차 강화학습 기반 정책 개선**

- 2026 정보컴퓨터공학부 졸업과제 · 23번 팀 **키자니아패밀리** (여채언, 문여원, **옥소미**) · 지도교수 김원석
- **피지컬 AI 트랙 5팀 중 성능 1위**
- 미션: 카메라 영상을 보고 무작위로 놓인 블록 5개를 **지정 영역으로 옮기기**(1차), **탑처럼 쌓기**(2차)

| 미션 (각 20회, 제한시간 5분) | 평균 성공 | 평균 소요시간 |
|---|---|---|
| 옮기기 (Place) | **4.95 / 5개** | 34.3초 |
| 쌓기 (Stack) | **4.6 / 5개** | 58.5초 |

두 미션 모두 **하나의 모델**로 수행해요.

🔗 [GitHub: kidzania-family](https://github.com/kidzania-family)
---
💡 전시물 앞에서 **Space**를 누르거나 클릭하면 자세히 볼 수 있어요. 처음 보는 전시물은 💰**10G**!
`,
  },
  cap_poster: {
    title: '🖼️ 졸업과제 포스터',
    md: `
# 졸업과제 포스터

![LeRobot SO-101 졸업과제 포스터]({{MEDIA}}capstone-poster.webp)

[🔍 원본 크기로 보기]({{MEDIA}}capstone-poster.webp)
`,
  },
  cap_data: {
    title: '📊 데이터 이야기 — Sim2Real',
    md: `
# 데이터를 어떻게 모았나

## 1) 실물 데이터의 한계
- **텔레오퍼레이션**으로 사람이 직접 로봇을 조종해 시연 수집
- 실패 직전에 사람이 개입하는 **mini-DAgger (Human-in-the-Loop)**로 교정 데이터 수집
- 하지만 **100개 모으는 데 약 3시간**, 블록 배치도 사람이 매번 바꿔야 해서 다양성이 부족

## 2) MuJoCo 시뮬레이션으로 확장
- 경기장을 MuJoCo 안에 똑같이 재현
- 블록 위치를 알 수 있으니 **IK(역기구학) 기반 교사 정책**이 시연을 자동 생성
- **3,200개를 5시간 이내**에 생성 (실물 100개 = 3시간과 비교!)
- 실물에서 약했던 상황(흩어진 배치, 어질러진 목표 영역, 놓친 뒤 다시 잡기)을 일부러 추가

## 3) Sim2Real Gap 줄이기
- 카메라·모터 보정, 경기장 실측
- **Domain Randomization** — 조명, 카메라 위치, 블록 색, 마찰, 통신 지연을 매 판 무작위로

## 결과: 학습 데이터에 따른 성능 (ACT, Pick & Place)
| 학습 데이터 | 평균 완료 | 관찰된 특징 |
|---|---|---|
| Real only (200개) | 2.2 / 5 | 낯선 배치에서 불안정 |
| Sim only (1,000개) | 3.4 / 5 | 손목 회전·실패 복구 향상, 일부 파지 실패 |
| **Sim + Real (3,800개)** | **4.95 / 5** | 낯선 배치에도 안정적 |

> 시뮬레이션 데이터가 실물보다 5배 넘게 많아도 실물에서 잘 동작 → Gap을 줄이는 작업이 효과가 있었어요.
`,
  },
  cap_policy: {
    title: '🦾 정책과 추론 파이프라인',
    md: `
# 어떤 모델로, 어떻게 움직이나

## Base Policy: ACT vs SmolVLA
| 모델 | 1회 추론 시간 | 선택 |
|---|---|---|
| SmolVLA (Pretrained VLA) | 약 0.24초 | ✗ |
| **ACT** (Transformer, from scratch) | **약 0.01초** | ✓ |

대회 채점에 **수행 속도**도 들어가서 ACT를 기본 정책으로 선택했어요.
입력은 손목·탑 카메라 영상 + 6-joint 상태, 출력은 6D action(5관절 + 그리퍼) chunk.

## 잔차 강화학습 (Residual RL) — 연구 진행 중
남은 실패는 대부분 **몇 mm 차이의 파지 오차**였어요. 시연을 더 모아도 잘 안 고쳐져서 강화학습을 적용!
- 기존 정책은 **고정**, 그 위에 더하는 **작은 보정값(잔차)**만 학습
- 보정은 관절마다 **최대 3°**로 제한 → 잘못 배워도 원래 동작에서 크게 안 벗어남
- 보상: 접근·중심정렬·운반 진행도(dense) + 집기·놓기·완료(event) + 시간 보너스

## 실물 추론: 서버 + 엣지 + 비동기 추론
\`\`\`
SO-101 ──관측──▶ Jetson Orin Nano ──gRPC──▶ RTX 4090 서버
                 (Residual 보정)            (ACT: action chunk K개)
최종 action = base action + λ · Δaction
\`\`\`
영상 두 장 전송에만 약 0.3초 → 로봇이 받아 둔 chunk를 실행하는 동안 서버가 다음 chunk를 미리 계산하는
**Async Inference**로 끊김 없이 움직여요.
`,
  },
  cap_video: {
    title: '📺 졸업과제 발표 영상',
    md: `
# 졸업과제 발표 영상

@video

> 2026 전기 졸업과제 · 23번 키자니아패밀리
`,
  },

  // ------------------------------------------------------------ 프로젝트 공방
  ws_summary: {
    title: '📖 프로젝트 공방 안내판',
    md: `
# 📖 프로젝트 공방 안내판

> 📍 **지금 있는 곳: 🔧 프로젝트 공방**
> 소미가 참여한 **팀·수업 프로젝트**가 모여 있는 곳이에요. 주로 **백엔드**를 맡았고, **AWS 배포와 CI/CD 파이프라인 구축**까지 책임졌어요.

## 🗺️ 이 방 둘러보기
| 위치 | 전시물 | 볼 수 있는 내용 |
|---|---|---|
| ⬅️ 왼쪽 벽 | 😇 칭찬감옥 포스터 | 나를 칭찬하는 SNS 일기 앱 |
| ⬆️ 가운데 벽 | 📱 PNU 학사 도우미 게시판 | PPlusPlus — 부산대 공지·학사 정보 통합 앱 |
| ➡️ 오른쪽 벽 | 🌐 PNUin 포스터 | 웹응용프로그래밍 텀프로젝트 |
| ⬅️ 왼쪽 끝 책상 | 💻 ComTogether 컴퓨터 | AI PC 부품 호환성 분석 & 전문가 상담 (APPTIVE) |
| ➡️ 오른쪽 끝 책상 | 🌱 탄소중립 SCM 노트북 | DB 텀프로젝트 |

## 🛠️ 내가 주로 맡은 일
- **API 서버 설계·구현** — Java · Spring Boot, Node.js · Express
- **데이터베이스 설계** — MySQL, 서비스 도메인 모델링
- **배포·운영** — AWS(App Runner, RDS, S3)에 배포, GitHub Actions로 **CI/CD** 자동화
- **성능 개선** — 비동기 병렬 처리로 외부 AI API 응답 시간 단축

## 📋 프로젝트 요약
| 프로젝트 | 한 줄 요약 | 역할 · 기술 |
|---|---|---|
| 💻 [ComTogether](https://github.com/ApptiveDev/ComTogether) | AI로 PC 부품 호환성을 분석하고 전문가 상담을 연결 (APPTIVE) | **백엔드** · Gemini API, 비동기 처리, AWS CI/CD |
| 📱 [PPlusPlus](https://github.com/PNU-PPP/PPP) | 부산대 공지·학사 정보를 모은 학사 도우미 앱 | 크롤링 데이터 수집 · Java, Node.js, FCM |
| 😇 [칭찬감옥](https://github.com/oxomi/PraisePrisonApp) | 나를 칭찬하는 SNS 일기 앱 | Kotlin · KLUE-BERT 감성 분석 |
| 🌐 [PNUin](https://github.com/oxomi/PNUin) | 웹응용프로그래밍 텀프로젝트 | Node.js · Express |
| 🌱 [DB 텀프로젝트](https://github.com/oxomi/db_Termproject) | 탄소중립 스마트 SCM 플랫폼 | DB 설계 |

대회에서 만든 **온기(해커톤 최우수상)**는 🎪 대외활동 센터에 있어요!
---
💡 전시물 앞에서 **Space**를 누르거나 클릭하면 자세히 볼 수 있어요. 처음 보는 전시물은 💰**10G**!
`,
  },
  ws_ongi: {
    title: '🏅 온기 — 해커톤 최우수상',
    md: `
# 🏅 2025 PNU SW 창의융합 해커톤 최우수상

## 온기 — 부모와 자식 간 건강 관리 및 정서적 소통 앱
멀리 사는 부모님의 건강을 기록하고 가족과 공유하는 모바일 서비스예요.

### 주요 기능
- **통증 부위 기록**, **복용 약 체크**, **운동 시간·걸음 수 관리**
- 부모님 건강 데이터를 자녀가 실시간으로 확인
- 하루 한 장 **일상 사진 공유**로 가족 간 대화 트리거

### 내 역할: 백엔드 개발
| 구분 | 기술 |
|---|---|
| Backend | Spring Boot 3.5 · Java 21, MySQL 8.4 |
| Infra | AWS App Runner, RDS, S3, FCM/APNs, GitHub Actions |

🔗 [GitHub: PNUSW-2025-OnGi-10](https://github.com/oxomi/PNUSW-2025-OnGi-10)
`,
  },
  ws_pc: {
    title: '💻 AI PC 부품 호환성 분석 시스템',
    md: `
# 💻 ComTogether (컴투게더)
### AI 기반 PC 부품 호환성 분석 & 전문가 상담 시스템
> 세상의 컴알못이 사라질 때까지!

**역할: 백엔드** · IT 서비스 동아리 **APPTIVE**에서 진행한 팀 프로젝트 (2025)

## 서비스
- 초보자를 위한 **단계별 PC 조립 가이드**와 용어 사전
- 선택한 부품 간 **호환성 체크** (좋음 / 보통 / 나쁨)
- 전문가와의 **1:1 상담** 예약, 질문·답변 **커뮤니티**

## 내가 한 일
- **Gemini API** 프롬프트 기반으로 부품 간 **호환성 추론 로직** 설계
- 전문가가 견적을 도와주는 **전문가 상담 기능** 구현
- **비동기 병렬 처리**로 응답 시간 단축
- **AWS** 배포 + **CI/CD** 파이프라인 구축

🔗 [GitHub: ApptiveDev/ComTogether](https://github.com/ApptiveDev/ComTogether)
`,
  },
  ws_praise: {
    title: '😇 칭찬감옥',
    md: `
# 😇 칭찬감옥 — Praise Prison
> 하루 한 번, 나를 칭찬하고 긍정의 언어를 나누는 SNS 일기 앱

- 스스로를 칭찬하는 **소셜 일기장** (Android · Kotlin)
- **KLUE-BERT** 기반 감성 분석으로 게시글·댓글의 부정적 표현 감지
- 긍정 피드백 중심의 따뜻한 커뮤니티 설계

🔗 [GitHub: PraisePrisonApp](https://github.com/oxomi/PraisePrisonApp)
`,
  },
  ws_pnu: {
    title: '📱 PNU 학사 도우미',
    md: `
# 📱 PPlusPlus (피플플) — PNU 학사 도우미 앱
**부산대학교 학생 편의를 위한 안드로이드 앱** · 4인 팀 · 2024 여름방학

- 학교 곳곳에 흩어진 **공지사항과 학사 정보를 한 곳에** 모은 통합 플랫폼
- **웹 크롤링 기반 데이터 수집 시스템** 구현 — 모든 학과 홈페이지 공지, 비교과 활동 정보를 실시간 수집

## 주요 기능
- 학과 공지사항·비교과 활동 **통합 조회**
- 학사일정 조회와 새 공지 **푸시 알림** (FCM)
- 학점 평균 계산기, 학점 예측
- 학교 근처 맛집 검색·랜덤 추천

| 구분 | 기술 |
|---|---|
| Frontend | Android (Java), KakaoMaps |
| Backend | Java, Node.js (Express), FCM |

🔗 [GitHub: PNU-PPP/PPP](https://github.com/PNU-PPP/PPP)
`,
  },
  ws_pnuin: {
    title: '🌐 PNUin',
    md: `
# 🌐 PNUin
**웹응용프로그래밍 텀프로젝트**

- **Node.js · Express** 기반 웹 서비스

🔗 [GitHub: PNUin](https://github.com/oxomi/PNUin)
`,
  },
  ws_db: {
    title: '🌱 탄소중립 스마트 SCM 플랫폼',
    md: `
# 🌱 탄소중립 스마트 SCM 플랫폼
**데이터베이스 텀프로젝트**

- 공급망(SCM) 데이터와 탄소 배출 정보를 함께 관리하는 서비스의 **DB 설계**

🔗 [GitHub: db_Termproject](https://github.com/oxomi/db_Termproject)
`,
  },

  // ------------------------------------------------------------ 대외활동 센터
  ext_summary: {
    title: '📖 대외활동 센터 안내판',
    md: `
# 📖 대외활동 센터 안내판

> 📍 **지금 있는 곳: 🎪 대외활동 센터**
> 학교 밖 **캠프·대회**와 **동아리** 활동을 모아 둔 곳이에요. 방이 벽지 색으로 **세 구역**으로 나뉘어 있어요.

## 🗺️ 이 방 둘러보기
| 구역 | 전시물 | 볼 수 있는 내용 |
|---|---|---|
| ⬅️ 왼쪽 · 보라색 | 🛰️ 망원경 | 데이터 크리에이터 캠프 소개 |
| ⬅️ 왼쪽 · 보라색 | 🗺️ 산업단지 분할 포스터 · 🏭 굴뚝 탐지 포스터 | 위성 영상 분석 모델과 결과 |
| ⬆️ 가운데 | 🎓 동아리 게시판 | Keeper · AID · APPTIVE |
| ➡️ 오른쪽 · 분홍색 | 🏅 온기 게시판 | SW 해커톤 최우수상 프로젝트 |

## 🎪 활동 요약
| 활동 | 결과 |
|---|---|
| 🛰️ **데이터 크리에이터 캠프** (과기정통부·NIA, 2025.08–10) | 산업단지 분할 **mIoU 0.977**, 굴뚝 높이 RMSE ≈ 8m |
| 🎓 **동아리** — Keeper · AID · APPTIVE | **다양한 분야 탐색** — 보안 · AI · 서비스 개발 |
| 🏅 **2025 PNU SW 창의융합 해커톤** — 온기 | **최우수상**, 백엔드 담당 |

- 🛰️ 위성 영상으로 대기오염 배출원(산업단지·굴뚝)을 찾는 end-to-end 파이프라인
- 🏅 부모님 건강 기록을 가족과 나누는 앱 *온기* — Spring Boot · MySQL · AWS
- 🎓 정보보안 → 인공지능 → IT 서비스 백엔드로 이어진 동아리 활동
---
💡 전시물 앞에서 **Space**를 누르거나 클릭하면 자세히 볼 수 있어요. 처음 보는 전시물은 💰**10G**!
`,
  },
  clubs: {
    title: '🎓 동아리 활동',
    md: `
# 🎓 동아리 활동

| 기간 | 동아리 | 활동 |
|---|---|---|
| 2023-2학기 – 2024-2학기 | 🔐 **Keeper** (정보보안 동아리) | **구) 부회장** |
| 2025-1, 2학기 | 🤖 **AID** (인공지능 동아리) | 부원 |
| 2025-1, 2학기 | 📱 **APPTIVE** (IT 서비스 동아리) | 부원 · **백엔드 트랙** |

> 보안에서 시작해 AI와 서비스 개발까지, 관심 있는 분야를 동아리로 직접 부딪혀 보며 넓혀 왔어요.

APPTIVE에서 만든 팀 프로젝트 **ComTogether**는 🔧 프로젝트 공방에 다른 프로젝트들과 함께 있어요.
`,
  },
  dcc_intro: {
    title: '🛰️ 데이터 크리에이터 캠프',
    md: `
# 🛰️ 2025 데이터 크리에이터 캠프 (대외활동)
**과학기술정보통신부 · NIA** (2025.08 – 2025.10)

## 주제: 위성 이미지로 대기오염 배출원 찾기
위성 영상만으로 **산업단지**를 찾고, 그 안의 **굴뚝 위치와 높이**까지 알아내는 end-to-end 파이프라인을 만들었어요.

| 단계 | 문제 유형 | 결과 |
|---|---|---|
| 산업단지 영역 분할 | Semantic Segmentation | **mIoU 0.977** |
| 굴뚝 위치 탐지 + 높이 추정 | Detection + Regression | 높이 **RMSE ≈ 8m** |

벽의 두 포스터에서 각각 자세히 볼 수 있어요.
`,
  },
  dcc_seg: {
    title: '🗺️ 산업단지 영역 분할',
    md: `
# 🗺️ 산업단지 영역 분할 (Semantic Segmentation)

- 모델: **U-Net++** + **ResNet50** 백본
- 손실 함수: **BCE + Dice + Boundary IoU** 조합으로 경계 분할 개선
- 입력: RGB에 **NDVI**(식생 지수), **NDWI**(수분 지수)를 더한 **6채널** 피처 엔지니어링

## 결과
**mIoU 0.977** 🎯

> 식물과 물을 잘 걸러 내는 지수를 채널로 넣어 주니 산업단지 경계가 훨씬 또렷해졌어요.
`,
  },
  dcc_chimney: {
    title: '🏭 굴뚝 탐지 & 높이 추정',
    md: `
# 🏭 굴뚝 탐지 & 높이 추정 (Detection & Regression)

- **YOLOv8-pose**로 굴뚝 박스와 키포인트를 함께 검출
- bbox ↔ keypoint 매칭으로 **학습 데이터 생성 파이프라인** 구축
- **ROIAlign** + **ResNet50** 백본으로 특징을 융합해 높이 회귀

## 결과
높이 추정 **RMSE 약 8m**
`,
  },
};
