class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 2;
        this.health = 50;
        this.maxHealth = 50;
        this.damage = 10;
        this.color = '#ff0000';
        this.experienceValue = 1;
    }
    
    update(deltaTime) {
        // 플레이어를 향해 이동
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
        
        // 플레이어와 충돌 체크
        if (distance < this.radius + this.game.player.radius) {
            this.game.player.health -= this.damage;
            this.health = 0; // 적은 충돌 시 사라짐
        }
    }
    
    render(ctx) {
        // 적 그리기
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // 체력바 그리기
        this.renderHealthBar(ctx);
    }
    
    renderHealthBar(ctx) {
        const healthBarWidth = 30;
        const healthBarHeight = 3;
        const x = this.x - healthBarWidth / 2;
        const y = this.y - this.radius - 5;
        
        // 체력바 배경
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x, y, healthBarWidth, healthBarHeight);
        
        // 현재 체력
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x, y, (this.health / this.maxHealth) * healthBarWidth, healthBarHeight);
    }
} 