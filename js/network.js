class NetworkManager {
    constructor() {
        this.ws = null;
        this.game = null;
        this.playerId = null;
        this.roomId = null;
        this.handlers = new Map();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = window.location.port || '3000';
        
        this.ws = new WebSocket(`${protocol}//${host}:${port}`);
        
        this.ws.onopen = () => {
            console.log('서버에 연결되었습니다.');
            this.trigger('connected');
        };
        
        this.ws.onclose = () => {
            console.log('서버와의 연결이 끊어졌습니다.');
            this.trigger('disconnected');
        };
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        };
    }

    setGame(game) {
        this.game = game;
    }

    createRoom(roomName) {
        this.send({
            type: 'create_room',
            roomName: roomName
        });
    }

    joinRoom(roomId, playerName) {
        this.send({
            type: 'join_room',
            roomId: roomId,
            playerName: playerName
        });
    }

    setReady(ready) {
        this.send({
            type: 'ready',
            ready: ready
        });
    }

    updatePlayerState(position, state) {
        this.send({
            type: 'player_update',
            position: position,
            state: state
        });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    handleMessage(message) {
        switch (message.type) {
            case 'room_list':
                this.trigger('roomList', message.rooms);
                break;
                
            case 'join_success':
                this.playerId = message.playerId;
                this.roomId = message.roomId;
                this.trigger('joinSuccess', message);
                break;
                
            case 'join_failed':
                this.trigger('joinFailed', message);
                break;
                
            case 'player_joined':
                if (this.game) {
                    this.game.addPlayer(message.playerId, message.playerName);
                }
                this.trigger('playerJoined', message);
                break;
                
            case 'player_left':
                if (this.game) {
                    this.game.removePlayer(message.playerId);
                }
                this.trigger('playerLeft', message);
                break;
                
            case 'player_ready':
                this.trigger('playerReady', message);
                break;
                
            case 'game_start':
                if (this.game) {
                    this.game.start();
                }
                this.trigger('gameStart');
                break;
                
            case 'player_update':
                if (this.game) {
                    const player = this.game.players.get(message.playerId);
                    if (player) {
                        player.position = message.position;
                        Object.assign(player, message.state);
                    }
                }
                break;
        }
    }

    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event).push(handler);
    }

    off(event, handler) {
        if (this.handlers.has(event)) {
            const handlers = this.handlers.get(event);
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    trigger(event, data) {
        if (this.handlers.has(event)) {
            this.handlers.get(event).forEach(handler => handler(data));
        }
    }
}

// 전역 네트워크 매니저 인스턴스 생성
window.networkManager = new NetworkManager(); 