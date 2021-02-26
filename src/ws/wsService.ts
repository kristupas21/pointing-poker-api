import { Socket } from 'socket.io';
import {
    WS_RESET_VOTE_ROUND,
    WS_HIDE_VOTES,
    WS_SET_USER_VOTE_VALUE,
    WS_SHOW_VOTES,
    WS_USER_JOINED,
    WS_USER_LEFT, WS_SET_VOTE_ROUND_TOPIC
} from './wsConstants';
import UserService from '@controllers/user/userService';
import SessionService from '@controllers/session/sessionService';
import { WSMessage } from './wsModel';
import { UserSchema } from '@controllers/user/userSchema';

const userService = new UserService();
const sessionService = new SessionService();

class WsService {
    private socket: Socket;

    private sessionId: string;

    private roomName: string;

    constructor(socket: Socket, sessionId: string) {
        this.socket = socket;
        this.sessionId = sessionId;
        this.roomName = this.getRoomName();
    }

    private getRoomName(): string {
        return `pp-room_${this.sessionId}`;
    }

    private constructWsMessage(body): WSMessage<typeof body> {
        return { body, sessionId: this.sessionId };
    }

    public init(): void {
        this.socket.join(this.roomName);

        this.socket.on(WS_USER_JOINED, this.userJoinedListener);
        this.socket.on(WS_SHOW_VOTES, this.showVotesListener);
        this.socket.on(WS_HIDE_VOTES, this.hideVotesListener);
        this.socket.on(WS_RESET_VOTE_ROUND, this.resetVoteRoundListener);
        this.socket.on(WS_SET_USER_VOTE_VALUE, this.voteValueListener);
        this.socket.on(WS_SET_VOTE_ROUND_TOPIC, this.voteRoundTopicListener);
    }

    private userJoinedListener = (message: WSMessage<{ user: UserSchema, sessionId: string }>) => {
        this.socket.to(this.roomName).broadcast.emit(WS_USER_JOINED, message);
    }

    private showVotesListener = async (message: WSMessage<void>) => {
        await sessionService
            .setSessionVoteStatus(this.sessionId, true);

        this.socket.to(this.roomName).broadcast.emit(WS_SHOW_VOTES, message);
    };

    private hideVotesListener = async (data: WSMessage<void>) => {
        await sessionService
            .setSessionVoteStatus(this.sessionId, false);

        this.socket.to(this.roomName).broadcast.emit(WS_HIDE_VOTES, data);
    };

    private resetVoteRoundListener = async (data: WSMessage<void>) => {
        await sessionService.setSessionVoteStatus(this.sessionId, false);
        await sessionService.setSessionTopic(this.sessionId, '');
        await userService.clearAllVoteValues(this.sessionId);

        this.socket.to(this.roomName).broadcast.emit(WS_RESET_VOTE_ROUND, data);
    };

    private voteValueListener = async (data: WSMessage<{ userId: string; voteValue: string }>) => {
        await userService
            .setUserVoteValue(this.sessionId, data.body.userId, data.body.voteValue);

        this.socket.to(this.roomName).broadcast.emit(WS_SET_USER_VOTE_VALUE, data);
    };

    private voteRoundTopicListener = async (data: WSMessage<{ topic: string }>) => {
        await sessionService.setSessionTopic(this.sessionId, data.body.topic);

        this.socket.to(this.roomName).broadcast.emit(WS_SET_VOTE_ROUND_TOPIC, data);
    }

    public async destroy(userId: string): Promise<void> {
        const userLeftMessage = this.constructWsMessage({ user: { id: userId } });

        await userService.removeUser(this.sessionId, userId);

        this.socket.to(this.roomName).broadcast.emit(WS_USER_LEFT, userLeftMessage);
        this.socket.leave(this.roomName);
        this.socket = null;
        this.sessionId = null;
        this.roomName = null;
    }
}

export default WsService;
