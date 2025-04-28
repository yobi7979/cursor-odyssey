class Player {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 5;
        
        // 기본 능력치
        this.health = 100;
        this.maxHealth = 100;
        this.attackPower = 10;
        this.defense = 0;
        
        // 경험치 및 레벨 시스템
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 10;
        
        // 모드 시스템
        this.mode = 'normal'; // normal, attack, skill, heal
        this.modeCooldown = 0;
        
        // 스킬 시스템
        this.skills = [];
        this.maxSkills = 5;
        this.selectedSkills = [];
        
        // 패시브 시스템
        this.passives = [];
        this.maxPassives = 2;
        this.selectedPassives = [];
        
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
                case '1':
                    this.setMode('normal');
                    break;
                case '2':
                    this.setMode('attack');
                    break;
                case '3':
                    this.setMode('skill');
                    break;
                case '4':
                    this.setMode('heal');
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
    
    setMode(mode) {
        if (this.modeCooldown <= 0) {
            this.mode = mode;
            this.modeCooldown = 1; // 1초 쿨다운
        }
    }
    
    update(deltaTime) {
        // 모드 쿨다운 업데이트
        if (this.modeCooldown > 0) {
            this.modeCooldown -= deltaTime / 1000;
        }
        
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
        
        // 스킬 업데이트
        this.selectedSkills.forEach(skill => {
            if (skill.cooldown > 0) {
                skill.cooldown -= deltaTime / 1000;
            }
        });
    }
    
    addExperience(amount) {
        this.experience += amount;
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // 레벨업 시 능력치 상승
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.attackPower += 2;
        this.defense += 1;
        this.speed += 0.5;
    }
    
    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.defense);
        this.health -= actualDamage;
        return actualDamage;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    render(ctx) {
        // 캐릭터 그리기
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.getColorByMode();
        ctx.fill();
        ctx.closePath();
        
        // 체력바 그리기
        this.renderHealthBar(ctx);
        
        // 레벨 및 경험치 표시
        this.renderLevel(ctx);
        
        // 모드 표시
        this.renderMode(ctx);
    }
    
    getColorByMode() {
        switch (this.mode) {
            case 'attack':
                return '#ff0000';
            case 'skill':
                return '#0000ff';
            case 'heal':
                return '#00ff00';
            default:
                return '#ffffff';
        }
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
    
    renderLevel(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Lv.${this.level}`, this.x, this.y - this.radius - 20);
        
        // 경험치 바
        const expBarWidth = 50;
        const expBarHeight = 3;
        const x = this.x - expBarWidth / 2;
        const y = this.y - this.radius - 30;
        
        // 경험치 바 배경
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y, expBarWidth, expBarHeight);
        
        // 현재 경험치
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(x, y, (this.experience / this.experienceToNextLevel) * expBarWidth, expBarHeight);
    }
    
    renderMode(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.mode.toUpperCase(), this.x, this.y + this.radius + 15);
    }
} 