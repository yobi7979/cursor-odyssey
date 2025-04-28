class Map {
    constructor(game) {
        this.game = game;
        this.width = game.canvas.width;
        this.height = game.canvas.height;
        this.tileSize = 50;
        this.tiles = [];
        this.spawnPoints = [];
        
        this.generateMap();
    }
    
    generateMap() {
        // 기본 맵 생성 (나중에 랜덤 생성으로 변경)
        for (let y = 0; y < this.height; y += this.tileSize) {
            for (let x = 0; x < this.width; x += this.tileSize) {
                this.tiles.push({
                    x: x,
                    y: y,
                    type: 'ground',
                    walkable: true
                });
            }
        }
        
        // 스폰 포인트 생성
        this.generateSpawnPoints();
    }
    
    generateSpawnPoints() {
        // 맵 가장자리에 스폰 포인트 생성
        const margin = 100;
        
        // 상단 스폰 포인트
        for (let x = margin; x < this.width - margin; x += 200) {
            this.spawnPoints.push({ x: x, y: margin });
        }
        
        // 하단 스폰 포인트
        for (let x = margin; x < this.width - margin; x += 200) {
            this.spawnPoints.push({ x: x, y: this.height - margin });
        }
        
        // 좌측 스폰 포인트
        for (let y = margin; y < this.height - margin; y += 200) {
            this.spawnPoints.push({ x: margin, y: y });
        }
        
        // 우측 스폰 포인트
        for (let y = margin; y < this.height - margin; y += 200) {
            this.spawnPoints.push({ x: this.width - margin, y: y });
        }
    }
    
    getRandomSpawnPoint() {
        const index = Math.floor(Math.random() * this.spawnPoints.length);
        return this.spawnPoints[index];
    }
    
    getSpawnPointAwayFrom(player, minDistance) {
        let attempts = 0;
        let spawnPoint;
        
        do {
            spawnPoint = this.getRandomSpawnPoint();
            attempts++;
            
            if (attempts > 100) {
                // 최대 시도 횟수 초과 시 기본 스폰 포인트 반환
                return spawnPoint;
            }
        } while (this.getDistance(player, spawnPoint) < minDistance);
        
        return spawnPoint;
    }
    
    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    render(ctx) {
        // 맵 렌더링
        this.tiles.forEach(tile => {
            ctx.fillStyle = tile.type === 'ground' ? '#2a2a2a' : '#1a1a1a';
            ctx.fillRect(tile.x, tile.y, this.tileSize, this.tileSize);
            
            // 타일 경계선
            ctx.strokeStyle = '#333333';
            ctx.strokeRect(tile.x, tile.y, this.tileSize, this.tileSize);
        });
        
        // 스폰 포인트 표시 (디버그용)
        if (this.game.debug) {
            this.spawnPoints.forEach(point => {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
} 