import { Socket } from 'socket.io';
import { WS_CLEAR_VOTES, WS_HIDE_VOTES, WS_SHOW_VOTES, WS_USER_JOINED, WS_USER_LEFT } from '@shared-with-ui/constants';
import UserService from '@controllers/user/userService';
import SessionService from '@controllers/session/sessionService';

const userService = new UserService();
const sessionService = new SessionService();

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

        this.socket.on(WS_USER_LEFT, async (data) => {
            this.socket.to(roomName).broadcast.emit(WS_USER_LEFT, data);
            await userService.removeUser(data.body.user, this.sessionId);
        });

        this.socket.on(WS_SHOW_VOTES, async (data) => {
            await sessionService.setSessionVoteStatus(this.sessionId, true);
            this.socket.to(roomName).broadcast.emit(WS_SHOW_VOTES, data);
        });

        this.socket.on(WS_HIDE_VOTES, async (data) => {
            await sessionService.setSessionVoteStatus(this.sessionId, false);
            this.socket.to(roomName).broadcast.emit(WS_HIDE_VOTES, data);
        });

        this.socket.on(WS_CLEAR_VOTES, (data) => {
            this.socket.to(roomName).broadcast.emit(WS_CLEAR_VOTES, data);
        })
    }

    public destroy(): void {
        const roomName = this.getRoomName();

        this.socket.leave(roomName);
        this.socket = null;
        this.sessionId = null;
    }
}

export default WsService;
