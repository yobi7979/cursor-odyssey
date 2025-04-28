# Cursor Odyssey

멀티플레이어 웹 게임 프로젝트입니다.

## 설치 방법

1. 저장소 클론:
```bash
git clone https://github.com/yobi7979/cursor-odyssey.git
cd cursor-odyssey
```

2. 의존성 설치:
```bash
npm install
```

## 실행 방법

1. 서버 실행:
```bash
npm start
```

2. 웹 브라우저에서 접속:
```
http://localhost:3000/lobby.html
```

## 게임 방법

1. 로비에서 플레이어 이름과 방 이름을 입력하여 방을 생성하거나 기존 방에 참가
2. 모든 플레이어가 준비 상태가 되면 게임 시작
3. WASD 또는 화살표 키로 이동
4. 1-4 키로 모드 변경
5. 마우스 클릭으로 공격

## 기술 스택

- Frontend: HTML5 Canvas, JavaScript
- Backend: Node.js, Express, WebSocket 