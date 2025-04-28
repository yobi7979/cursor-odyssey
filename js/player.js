class Player {
    constructor(game, x, y, name = '플레이어') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.name = name;
        this.radius = 20;
        this.speed = 7; // 이동 속도 증가
        
        // 기본 능력치 강화
        this.health = 200;
        this.maxHealth = 200;
        this.attackPower = 25;
        this.defense = 5;
        this.attackRange = 150; // 공격 범위 증가
        this.attackSpeed = 1.5; // 초당 공격 횟수
        this.attackCooldown = 0;
        
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
        
        // 마우스 위치
        this.mouseX = 0;
        this.mouseY = 0;
        
        // 네트워크 관련
        this.isLocalPlayer = false;
        
        // 로컬 플레이어인 경우에만 컨트롤 설정
        if (this.isLocalPlayer) {
            this.setupControls();
        }
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('click', (e) => this.handleClick(e));
    }
    
    handleMouseMove(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    handleClick(e) {
        if (this.mode === 'attack') {
            this.attack();
        }
    }
    
    handleKeyDown(e) {
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
    }
    
    handleKeyUp(e) {
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
    }
    
    setMode(mode) {
        if (this.modeCooldown <= 0) {
            this.mode = mode;
            this.modeCooldown = 1; // 1초 쿨다운
        }
    }
    
    update(deltaTime) {
        // 로컬 플레이어가 아닌 경우 업데이트 건너뛰기
        if (!this.isLocalPlayer) {
            return;
        }
        
        // 모드 쿨다운 업데이트
        if (this.modeCooldown > 0) {
            this.modeCooldown -= deltaTime / 1000;
        }
        
        // 공격 쿨다운 업데이트
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime / 1000;
        }
        
        // 이동 처리
        let moveX = 0;
        let moveY = 0;
        
        if (this.moveLeft) moveX -= this.speed;
        if (this.moveRight) moveX += this.speed;
        if (this.moveUp) moveY -= this.speed;
        if (this.moveDown) moveY += this.speed;
        
        // 대각선 이동 속도 정규화
        if (moveX !== 0 && moveY !== 0) {
            const normalize = Math.sqrt(2) / 2;
            moveX *= normalize;
            moveY *= normalize;
        }
        
        // 이동 범위 제한
        const nextX = this.x + moveX;
        const nextY = this.y + moveY;
        
        if (nextX >= this.radius && nextX <= this.game.canvas.width - this.radius) {
            this.x = nextX;
        }
        if (nextY >= this.radius && nextY <= this.game.canvas.height - this.radius) {
            this.y = nextY;
        }
        
        // 자동 공격 (attack 모드일 때)
        if (this.mode === 'attack' && this.attackCooldown <= 0) {
            this.attack();
        }
    }
    
    attack() {
        if (this.attackCooldown <= 0) {
            // 가장 가까운 적 찾기
            let nearestEnemy = null;
            let minDistance = this.attackRange;
            
            this.game.enemies.forEach(enemy => {
                if (enemy.isAlive) {
                    const distance = Math.sqrt(
                        Math.pow(enemy.x - this.x, 2) + 
                        Math.pow(enemy.y - this.y, 2)
                    );
                    
                    if (distance <= this.attackRange && (nearestEnemy === null || distance < minDistance)) {
                        nearestEnemy = enemy;
                        minDistance = distance;
                    }
                }
            });
            
            // 가장 가까운 적 공격
            if (nearestEnemy) {
                const damage = nearestEnemy.takeDamage(this.attackPower);
                this.attackCooldown = 1 / this.attackSpeed;
                
                // 공격 이펙트 생성
                this.game.effects.add(new AttackEffect(
                    this.x, this.y,
                    nearestEnemy.x, nearestEnemy.y
                ));
            }
        }
    }
    
    takeDamage(amount) {
        const damage = Math.max(1, amount - this.defense);
        this.health -= damage;
        
        if (this.health <= 0) {
            this.die();
        }
        
        // 데미지를 입었을 때 상태 업데이트
        if (this.isLocalPlayer) {
            this.game.networkManager.updatePlayerState(
                { x: this.x, y: this.y },
                { health: this.health }
            );
        }
        
        return damage;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
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
        this.maxHealth += 30;
        this.health = this.maxHealth;
        this.attackPower += 5;
        this.defense += 2;
        this.speed += 0.2;
        
        // 레벨업 정보 전송
        if (this.isLocalPlayer) {
            this.game.networkManager.updatePlayerState(
                { x: this.x, y: this.y },
                {
                    level: this.level,
                    experience: this.experience,
                    health: this.health,
                    maxHealth: this.maxHealth,
                    attackPower: this.attackPower,
                    defense: this.defense,
                    speed: this.speed
                }
            );
        }
    }
    
    die() {
        // 게임 오버 처리
        this.game.gameOver();
    }
    
    render(ctx) {
        // 공격 범위 표시 (attack 모드일 때)
        if (this.mode === 'attack') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.attackRange, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.stroke();
        }
        
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
        
        // 이름 표시
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.radius - 25);
    }
    
    getColorByMode() {
        switch (this.mode) {
            case 'attack':
                return '#ff4444';
            case 'skill':
                return '#4444ff';
            case 'heal':
                return '#44ff44';
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
        ctx.font = '12px Arial';
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
} 