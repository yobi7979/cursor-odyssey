class Lobby {
    constructor() {
        this.rooms = new Map();
        this.setupUI();
    }
    
    setupUI() {
        // 로비 UI 생성
        this.container = document.createElement('div');
        this.container.className = 'lobby-container';
        
        // 방 목록
        this.roomList = document.createElement('div');
        this.roomList.className = 'room-list';
        
        // 방 생성 버튼
        this.createRoomBtn = document.createElement('button');
        this.createRoomBtn.textContent = '방 만들기';
        this.createRoomBtn.className = 'create-room-btn';
        this.createRoomBtn.onclick = () => this.showCreateRoomDialog();
        
        this.container.appendChild(this.roomList);
        this.container.appendChild(this.createRoomBtn);
        document.body.appendChild(this.container);
        
        this.setupStyles();
    }
    
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lobby-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                padding: 20px;
                border-radius: 10px;
                min-width: 300px;
            }
            
            .room-list {
                margin-bottom: 20px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .room-item {
                background: rgba(255, 255, 255, 0.1);
                margin: 10px 0;
                padding: 15px;
                border-radius: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .create-room-btn {
                width: 100%;
                padding: 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            
            .create-room-btn:hover {
                background: #45a049;
            }
            
            .room-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                padding: 20px;
                border-radius: 10px;
                z-index: 1000;
            }
            
            .room-dialog input {
                width: 100%;
                padding: 8px;
                margin: 10px 0;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 4px;
            }
            
            .room-dialog button {
                padding: 8px 15px;
                margin: 5px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .join-btn {
                background: #4CAF50;
                color: white;
                padding: 5px 15px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            
            .join-btn:hover {
                background: #45a049;
            }
        `;
        document.head.appendChild(style);
    }
    
    showCreateRoomDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'room-dialog';
        
        const input = document.createElement('input');
        input.placeholder = '방 이름';
        
        const createBtn = document.createElement('button');
        createBtn.textContent = '생성';
        createBtn.style.background = '#4CAF50';
        createBtn.style.color = 'white';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '취소';
        cancelBtn.style.background = '#f44336';
        cancelBtn.style.color = 'white';
        
        createBtn.onclick = () => {
            if (input.value.trim()) {
                this.createRoom(input.value.trim());
                document.body.removeChild(dialog);
            }
        };
        
        cancelBtn.onclick = () => {
            document.body.removeChild(dialog);
        };
        
        dialog.appendChild(input);
        dialog.appendChild(createBtn);
        dialog.appendChild(cancelBtn);
        document.body.appendChild(dialog);
        
        input.focus();
    }
    
    createRoom(name) {
        const roomId = Date.now().toString();
        const room = new GameRoom(roomId, name, this);
        this.rooms.set(roomId, room);
        this.updateRoomList();
    }
    
    updateRoomList() {
        this.roomList.innerHTML = '';
        this.rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.className = 'room-item';
            
            const roomInfo = document.createElement('div');
            roomInfo.textContent = `${room.name} (${room.players.length}/4)`;
            
            const joinBtn = document.createElement('button');
            joinBtn.textContent = '참가';
            joinBtn.className = 'join-btn';
            joinBtn.onclick = () => this.joinRoom(room.id);
            
            roomElement.appendChild(roomInfo);
            roomElement.appendChild(joinBtn);
            this.roomList.appendChild(roomElement);
        });
    }
    
    joinRoom(roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            this.hide();
            room.show();
        }
    }
    
    show() {
        this.container.style.display = 'block';
    }
    
    hide() {
        this.container.style.display = 'none';
    }
} 