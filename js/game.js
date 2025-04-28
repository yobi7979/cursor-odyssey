class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.debug = false; // 디버그 모드
        
        // 게임 시스템 초기화
        this.map = new Map(this);
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.skillManager = new SkillManager();
        this.passiveManager = new PassiveManager();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 게임 루프 시작
        this.lastTime = 0;
        this.gameLoop(0);
    }
    
    setupEventListeners() {
        // 키보드 이벤트
        window.addEventListener('keydown', (e) => {
            this.player.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.player.handleKeyUp(e);
        });
        
        // 디버그 모드 토글
        window.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.debug = !this.debug;
            }
        });
    }
    
    update(deltaTime) {
        // 플레이어 업데이트
        this.player.update(deltaTime);
        
        // 맵 업데이트
        // (현재는 업데이트 로직이 없음)
    }
    
    render() {
        // 화면 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 맵 렌더링
        this.map.render(this.ctx);
        
        // 플레이어 렌더링
        this.player.render(this.ctx);
        
        // 디버그 정보 표시
        if (this.debug) {
            this.renderDebugInfo();
        }
    }
    
    renderDebugInfo() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        const debugInfo = [
            `FPS: ${Math.round(1000 / this.deltaTime)}`,
            `Position: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
            `Health: ${this.player.health}/${this.player.maxHealth}`,
            `Level: ${this.player.level}`,
            `Experience: ${this.player.experience}/${this.player.experienceToNextLevel}`,
            `Mode: ${this.player.mode}`
        ];
        
        debugInfo.forEach((info, index) => {
            this.ctx.fillText(info, 10, 20 + index * 20);
        });
    }
    
    gameLoop(timestamp) {
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(this.deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// 게임 시작
window.onload = () => {
    new Game();
}; 