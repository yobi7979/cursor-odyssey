class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.players = new Map(); // 플레이어 목록
        this.enemies = [];
        this.effects = new EffectManager();
        this.map = new Map(this);
        this.isGameOver = false;
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 2000; // 2초마다 적 생성
        
        // 게임 상태
        this.state = 'waiting'; // waiting, playing, gameOver
        this.countdown = 10; // 게임 시작 전 카운트다운
        
        // 네트워크 매니저 설정
        this.networkManager = window.networkManager;
        this.networkManager.setGame(this);
        
        this.setupCanvas();
        this.setupNetworkHandlers();
    }
    
    setupCanvas() {
        // 캔버스 크기를 윈도우 크기에 맞게 설정
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 윈도우 크기가 변경될 때 캔버스 크기도 조정
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    setupNetworkHandlers() {
        // 네트워크 이벤트 핸들러 등록
        this.networkManager.on('connected', () => {
            console.log('서버에 연결됨');
        });
        
        this.networkManager.on('disconnected', () => {
            console.log('서버와 연결 끊김');
            this.state = 'waiting';
        });
        
        this.networkManager.on('gameStart', () => {
            this.startCountdown();
        });
    }
    
    addPlayer(id, name) {
        const spawnPoint = this.map.getRandomSpawnPoint();
        const player = new Player(this, spawnPoint.x, spawnPoint.y, name);
        this.players.set(id, player);
        
        // 로컬 플레이어인 경우
        if (id === this.networkManager.playerId) {
            player.isLocalPlayer = true;
        }
        
        return player;
    }
    
    removePlayer(id) {
        this.players.delete(id);
    }
    
    start() {
        this.state = 'playing';
        this.isGameOver = false;
        this.enemies = [];
        this.effects = new EffectManager();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    startCountdown() {
        this.state = 'countdown';
        this.countdown = 10;
        const countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(countdownInterval);
                this.start();
            }
        }, 1000);
    }
    
    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.state === 'playing' && !this.isGameOver) {
            this.update(deltaTime);
            this.render();
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }
    
    update(deltaTime) {
        // 플레이어 업데이트
        this.players.forEach(player => {
            player.update(deltaTime);
            
            // 로컬 플레이어의 상태를 서버에 전송
            if (player.isLocalPlayer) {
                this.networkManager.updatePlayerState(
                    { x: player.x, y: player.y },
                    {
                        health: player.health,
                        mode: player.mode,
                        level: player.level,
                        experience: player.experience
                    }
                );
            }
        });
        
        // 적 생성
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer >= this.enemySpawnInterval) {
            this.enemySpawnTimer = 0;
            this.spawnEnemy();
        }
        
        // 적 업데이트
        this.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.update(deltaTime);
            }
        });
        
        // 이펙트 업데이트
        this.effects.update(deltaTime);
        
        // 죽은 적 제거
        this.enemies = this.enemies.filter(enemy => enemy.isAlive);
    }
    
    spawnEnemy() {
        const spawnPoint = this.map.getRandomSpawnPoint();
        const enemy = new Enemy(this, spawnPoint.x, spawnPoint.y);
        this.enemies.push(enemy);
    }
    
    render() {
        // 화면 클리어
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 맵 렌더링
        this.map.render(this.ctx);
        
        // 적 렌더링
        this.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.render(this.ctx);
            }
        });
        
        // 플레이어 렌더링
        this.players.forEach(player => {
            player.render(this.ctx);
        });
        
        // 이펙트 렌더링
        this.effects.render(this.ctx);
        
        // 게임 상태 표시
        this.renderGameState();
    }
    
    renderGameState() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`플레이어: ${this.players.size}`, 20, 30);
        this.ctx.fillText(`적: ${this.enemies.length}`, 20, 60);
        
        if (this.state === 'countdown') {
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`게임 시작까지: ${this.countdown}초`, this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    gameOver() {
        this.isGameOver = true;
        this.state = 'gameOver';
        
        // 게임 오버 화면 표시
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('게임 오버', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('방으로 돌아가기...', this.canvas.width / 2, this.canvas.height / 2 + 50);
        
        // 3초 후 방으로 돌아가기
        setTimeout(() => {
            window.location.href = '/lobby.html';
        }, 3000);
    }
}

// 게임 시작
window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        const game = new Game(canvas);
        window.networkManager.connect();
    }
}; 