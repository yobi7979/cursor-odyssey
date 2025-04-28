class Effect {
    constructor(x, y, duration = 1000) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.currentTime = 0;
        this.isFinished = false;
    }
    
    update(deltaTime) {
        this.currentTime += deltaTime;
        if (this.currentTime >= this.duration) {
            this.isFinished = true;
        }
    }
    
    render(ctx) {
        // 기본 렌더링 (하위 클래스에서 구현)
    }
}

class AttackEffect extends Effect {
    constructor(startX, startY, targetX, targetY) {
        super(startX, startY, 300); // 300ms 지속
        this.targetX = targetX;
        this.targetY = targetY;
    }
    
    render(ctx) {
        const progress = this.currentTime / this.duration;
        const alpha = 1 - progress;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + (this.targetX - this.x) * progress,
            this.y + (this.targetY - this.y) * progress
        );
        ctx.stroke();
    }
}

class DeathEffect extends Effect {
    constructor(x, y) {
        super(x, y, 500); // 500ms 지속
        this.particles = [];
        
        // 파티클 생성
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            this.particles.push({
                x: x,
                y: y,
                speed: 3,
                angle: angle
            });
        }
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 파티클 업데이트
        this.particles.forEach(particle => {
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
        });
    }
    
    render(ctx) {
        const progress = this.currentTime / this.duration;
        const alpha = 1 - progress;
        
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        this.particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

class EffectManager {
    constructor() {
        this.effects = [];
    }
    
    add(effect) {
        this.effects.push(effect);
    }
    
    update(deltaTime) {
        this.effects.forEach(effect => effect.update(deltaTime));
        // 완료된 이펙트 제거
        this.effects = this.effects.filter(effect => !effect.isFinished);
    }
    
    render(ctx) {
        this.effects.forEach(effect => effect.render(ctx));
    }
} 