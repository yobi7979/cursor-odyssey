class Enemy {
    constructor(game, type = 'normal') {
        this.game = game;
        this.type = type;
        
        // 스폰 위치 설정
        const spawnPoint = this.game.map.getSpawnPointAwayFrom(this.game.player, 200);
        this.x = spawnPoint.x;
        this.y = spawnPoint.y;
        
        // 기본 속성 설정
        this.setupStats();
        
        // 상태
        this.isAlive = true;
        this.target = this.game.player;
        this.attackCooldown = 0;
    }
    
    setupStats() {
        switch(this.type) {
            case 'fast':
                this.radius = 15;
                this.speed = 4;
                this.health = 50;
                this.maxHealth = 50;
                this.damage = 8;
                this.attackRange = 30;
                this.attackSpeed = 1; // 초당 공격 횟수
                this.color = '#ff4444';
                this.experienceValue = 5;
                break;
            case 'tank':
                this.radius = 30;
                this.speed = 2;
                this.health = 200;
                this.maxHealth = 200;
                this.damage = 15;
                this.attackRange = 40;
                this.attackSpeed = 0.5;
                this.color = '#8844ff';
                this.experienceValue = 15;
                break;
            default: // normal
                this.radius = 20;
                this.speed = 3;
                this.health = 100;
                this.maxHealth = 100;
                this.damage = 10;
                this.attackRange = 35;
                this.attackSpeed = 0.8;
                this.color = '#ff0000';
                this.experienceValue = 10;
        }
    }
    
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // 플레이어 추적
        this.moveTowardsTarget(deltaTime);
        
        // 공격 쿨다운 업데이트
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime / 1000;
        }
        
        // 공격 범위 체크 및 공격
        if (this.isInAttackRange()) {
            this.attack();
        }
    }
    
    moveTowardsTarget(deltaTime) {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.attackRange) {
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            
            this.x += moveX;
            this.y += moveY;
        }
    }
    
    isInAttackRange() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.attackRange;
    }
    
    attack() {
        if (this.attackCooldown <= 0) {
            const damage = this.target.takeDamage(this.damage);
            this.attackCooldown = 1 / this.attackSpeed;
            
            // 공격 효과 생성
            this.game.effects.add(new AttackEffect(this.x, this.y, this.target.x, this.target.y));
        }
    }
    
    takeDamage(amount) {
        const damage = Math.max(1, amount);
        this.health -= damage;
        
        if (this.health <= 0) {
            this.die();
        }
        
        return damage;
    }
    
    die() {
        this.isAlive = false;
        this.target.addExperience(this.experienceValue);
        // 사망 효과 생성
        this.game.effects.add(new DeathEffect(this.x, this.y));
    }
    
    render(ctx) {
        if (!this.isAlive) return;
        
        // 적 캐릭터 그리기
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // 체력바 그리기
        this.renderHealthBar(ctx);
    }
    
    renderHealthBar(ctx) {
        const healthBarWidth = 40;
        const healthBarHeight = 4;
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