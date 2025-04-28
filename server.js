const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 정적 파일 제공
app.use(express.static(path.join(__dirname)));

// 방 관리
const rooms = new Map();

class Room {
    constructor(id, name, maxPlayers = 4) {
        this.id = id;
        this.name = name;
        this.players = new Map();
        this.maxPlayers = maxPlayers;
        this.state = 'waiting'; // waiting, playing, finished
    }

    addPlayer(playerId, playerName, ws) {
        if (this.players.size >= this.maxPlayers) {
            return false;
        }
        
        this.players.set(playerId, {
            id: playerId,
            name: playerName,
            ws: ws,
            ready: false
        });
        
        return true;
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
        
        // 모든 플레이어가 나가면 방 삭제
        if (this.players.size === 0) {
            rooms.delete(this.id);
        }
    }

    broadcast(message, excludePlayerId = null) {
        this.players.forEach((player, id) => {
            if (id !== excludePlayerId && player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(JSON.stringify(message));
            }
        });
    }
}

// 웹소켓 연결 처리
wss.on('connection', (ws) => {
    console.log('새로운 클라이언트 연결');
    let currentRoom = null;
    let playerId = null;

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch (data.type) {
            case 'create_room':
                const roomId = Date.now().toString();
                const room = new Room(roomId, data.roomName);
                rooms.set(roomId, room);
                
                // 방 생성 후 목록 업데이트
                broadcastRoomList();
                break;
                
            case 'join_room':
                currentRoom = rooms.get(data.roomId);
                if (currentRoom) {
                    playerId = Date.now().toString();
                    const success = currentRoom.addPlayer(playerId, data.playerName, ws);
                    
                    if (success) {
                        // 입장 성공
                        ws.send(JSON.stringify({
                            type: 'join_success',
                            roomId: currentRoom.id,
                            playerId: playerId
                        }));
                        
                        // 다른 플레이어들에게 새 플레이어 입장 알림
                        currentRoom.broadcast({
                            type: 'player_joined',
                            playerId: playerId,
                            playerName: data.playerName
                        }, playerId);
                    } else {
                        // 입장 실패
                        ws.send(JSON.stringify({
                            type: 'join_failed',
                            reason: '방이 가득 찼습니다.'
                        }));
                    }
                }
                break;
                
            case 'player_update':
                if (currentRoom) {
                    // 플레이어 상태 업데이트를 다른 플레이어들에게 브로드캐스트
                    currentRoom.broadcast({
                        type: 'player_update',
                        playerId: playerId,
                        position: data.position,
                        state: data.state
                    }, playerId);
                }
                break;
                
            case 'ready':
                if (currentRoom) {
                    const player = currentRoom.players.get(playerId);
                    if (player) {
                        player.ready = data.ready;
                        
                        // 모든 플레이어가 준비되었는지 확인
                        let allReady = true;
                        currentRoom.players.forEach(p => {
                            if (!p.ready) allReady = false;
                        });
                        
                        if (allReady && currentRoom.players.size >= 2) {
                            // 게임 시작
                            currentRoom.state = 'playing';
                            currentRoom.broadcast({
                                type: 'game_start'
                            });
                        }
                        
                        // 준비 상태 변경 브로드캐스트
                        currentRoom.broadcast({
                            type: 'player_ready',
                            playerId: playerId,
                            ready: data.ready
                        });
                    }
                }
                break;
        }
    });

    ws.on('close', () => {
        if (currentRoom && playerId) {
            // 플레이어 퇴장 처리
            currentRoom.removePlayer(playerId);
            
            // 다른 플레이어들에게 퇴장 알림
            currentRoom.broadcast({
                type: 'player_left',
                playerId: playerId
            });
            
            // 방 목록 업데이트
            broadcastRoomList();
        }
    });
});

// 방 목록 브로드캐스트
function broadcastRoomList() {
    const roomList = Array.from(rooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        playerCount: room.players.size,
        maxPlayers: room.maxPlayers,
        state: room.state
    }));
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'room_list',
                rooms: roomList
            }));
        }
    });
}

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 