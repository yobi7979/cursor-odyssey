class Player {
    constructor(game) {
        this.game = game;
        this.x = game.canvas.width / 2;
        this.y = game.canvas.height / 2;
        this.radius = 20;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.color = '#00ff00';
        
        // 이동 관련 상태
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        
        this.setupControls();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    this.moveLeft = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.moveRight = true;
                    break;
                case 'ArrowUp':
                case 'w':
                    this.moveUp = true;
                    break;
                case 'ArrowDown':
                case 's':
                    this.moveDown = true;
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    this.moveLeft = false;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.moveRight = false;
                    break;
                case 'ArrowUp':
                case 'w':
                    this.moveUp = false;
                    break;
                case 'ArrowDown':
                case 's':
                    this.moveDown = false;
                    break;
            }
        });
    }
    
    update(deltaTime) {
        // 이동 처리
        if (this.moveLeft && this.x > this.radius) {
            this.x -= this.speed;
        }
        if (this.moveRight && this.x < this.game.canvas.width - this.radius) {
            this.x += this.speed;
        }
        if (this.moveUp && this.y > this.radius) {
            this.y -= this.speed;
        }
        if (this.moveDown && this.y < this.game.canvas.height - this.radius) {
            this.y += this.speed;
        }
    }
    
    render(ctx) {
        // 캐릭터 그리기
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // 체력바 그리기
        this.renderHealthBar(ctx);
    }
    
    renderHealthBar(ctx) {
        const healthBarWidth = 50;
        const healthBarHeight = 5;
        const x = this.x - healthBarWidth / 2;
        const y = this.y - this.radius - 10;
        
        // 체력바 배경
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x, y, healthBarWidth, healthBarHeight);
        
        // 현재 체력
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x, y, (this.health / this.maxHealth) * healthBarWidth, healthBarHeight);
    }
} 