import { Socket } from 'socket.io';
import {
  WS_RESET_VOTE_ROUND,
  WS_HIDE_VOTES,
  WS_SET_USER_VOTE_VALUE,
  WS_SHOW_VOTES,
  WS_USER_JOINED,
  WS_USER_LEFT,
  WS_SET_VOTE_ROUND_TOPIC, WS_MODIFY_SESSION_USER
} from '@shared-with-ui/constants';
import UserService from '@services/userService';
import SessionService from '@services/sessionService';
import { WSMessage } from '@models/wsModel';
import { UserSchema } from '@schemas/userSchema';

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

  private getBroadcast(): Socket {
    return this.socket.to(this.roomName).broadcast;
  }

  public init(): void {
    void this.socket.join(this.roomName);

    this.socket.on(WS_USER_JOINED, this.handleUserJoined);

    this.socket.on(WS_SHOW_VOTES, this.handleShowVotes);

    this.socket.on(WS_HIDE_VOTES, this.handleHideVotes);

    this.socket.on(WS_RESET_VOTE_ROUND, this.handleResetVoteRound);

    this.socket.on(WS_SET_USER_VOTE_VALUE, this.handleSetVoteValue);

    this.socket.on(WS_SET_VOTE_ROUND_TOPIC, this.handleSetVoteRoundTopic);

    this.socket.on(WS_MODIFY_SESSION_USER, this.handleModifySessionUser);
  }

  private handleUserJoined = (message: WSMessage<{ user: UserSchema, sessionId: string }>) => {
    this.getBroadcast().emit(WS_USER_JOINED, message);
  }

  private handleShowVotes = async (message: WSMessage<{ user: UserSchema }>) => {
    await sessionService
      .setSessionVoteStatus(this.sessionId, true);

    this.getBroadcast().emit(WS_SHOW_VOTES, message);
  };

  private handleHideVotes = async (message: WSMessage<void>) => {
    await sessionService
      .setSessionVoteStatus(this.sessionId, false);

    this.getBroadcast().emit(WS_HIDE_VOTES, message);
  };

  private handleResetVoteRound = async (message: WSMessage<{ user: UserSchema }>) => {
    await sessionService.setSessionVoteStatus(this.sessionId, false);
    await sessionService.setSessionTopic(this.sessionId, '');
    await userService.clearAllVoteValues(this.sessionId);

    this.getBroadcast().emit(WS_RESET_VOTE_ROUND, message);
  };

  private handleSetVoteValue = async (message: WSMessage<{ user: UserSchema; voteValue: string }>) => {
    await userService
      .setUserVoteValue(this.sessionId, message.body.user.id, message.body.voteValue);

    this.getBroadcast().emit(WS_SET_USER_VOTE_VALUE, message);
  };

  private handleSetVoteRoundTopic = async (message: WSMessage<{ topic: string }>) => {
    await sessionService.setSessionTopic(this.sessionId, message.body.topic);

    this.getBroadcast().emit(WS_SET_VOTE_ROUND_TOPIC, message);
  }

  private handleModifySessionUser = async (
    message: WSMessage<{ params: Partial<UserSchema>; userId: string }>
  ) => {
    const { userId, params } = message.body;
    const user = await userService.modifyUser(this.sessionId, userId, params);
    const newMessage = this.constructWsMessage({ user });

    this.getBroadcast().emit(WS_MODIFY_SESSION_USER, newMessage);
  }

  public async destroy(userId: string): Promise<void> {
    const user = await userService.findUserById(this.sessionId, userId);
    const userLeftMessage = this.constructWsMessage({ user });

    await userService.removeUser(this.sessionId, userId);

    this.getBroadcast().emit(WS_USER_LEFT, userLeftMessage);

    void this.socket.leave(this.roomName);

    this.socket = null;
    this.sessionId = null;
    this.roomName = null;
  }
}

export default WsService;
