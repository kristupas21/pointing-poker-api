import { Socket } from 'socket.io';
import { WS_USER_JOINED, WS_USER_LEFT } from '@shared-with-ui/constants';

class WsService {
    private socket: Socket;

    private sessionId: string;

    constructor(socket: Socket, sessionId: string) {
        this.socket = socket;
        this.sessionId = sessionId;
    }

    private getRoomName(): string {
        return `pp-room_${this.sessionId}`;
    }

    public init(): void {
        const roomName = this.getRoomName();

        this.socket.join(roomName);

        this.socket.on(WS_USER_JOINED, (data) => {
            this.socket.to(roomName).broadcast.emit(WS_USER_JOINED, data);
        });

        this.socket.on(WS_USER_LEFT, (data) => {
            this.socket.to(roomName).broadcast.emit(WS_USER_LEFT, data);
        });
    }

    public destroy(): void {
        const roomName = this.getRoomName();

        this.socket.leave(roomName);
        this.socket = null;
        this.sessionId = null;
    }
}

export default WsService;
