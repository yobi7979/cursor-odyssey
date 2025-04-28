class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 1000/60; // 60 FPS
        
        this.init();
    }
    
    init() {
        // 게임 초기화 로직
        this.player = new Player(this);
        this.gameLoop(0);
    }
    
    update(deltaTime) {
        // 게임 상태 업데이트
        this.player.update(deltaTime);
    }
    
    render() {
        // 게임 렌더링
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 배경 그리기
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 플레이어 렌더링
        this.player.render(this.ctx);
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.accumulator += deltaTime;
        
        while (this.accumulator >= this.timestep) {
            this.update(this.timestep);
            this.accumulator -= this.timestep;
        }
        
        this.render();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}

// 게임 시작
window.onload = () => {
    new Game();
}; 