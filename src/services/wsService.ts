import { Socket } from 'socket.io';
import {
  WS_RESET_VOTE_ROUND,
  WS_HIDE_VOTES,
  WS_SET_USER_VOTE_VALUE,
  WS_SHOW_VOTES,
  WS_USER_JOINED,
  WS_USER_LEFT,
  WS_SET_VOTE_ROUND_TOPIC,
  WS_MODIFY_SESSION_USER,
  WS_UPDATE_SESSION_PERMISSIONS,
  WS_UPDATE_VOTE_ROUND_USER_PERMISSIONS,
  WS_SOCKET_ERROR
} from '@shared-with-ui/constants';
import UserService from '@services/userService';
import SessionService from '@services/sessionService';
import {
  WSMessage,
  WSMessageModifyUser,
  WSMessageUserData,
  WSMessageSessionPermissions,
  WSMessageSetTopic,
  WSMessageSetVoteValue,
  WSMessageUserPermissions
} from '@shared-with-ui/types';
import { ValidationSchema } from '@services/validationService/types';
import ValidationService from '@services/validationService';
import VALIDATION_SCHEMA from '@services/validationService/validationSchemas';

const userService = new UserService();
const sessionService = new SessionService();
const validationService = new ValidationService();

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

    this.socket.on(WS_UPDATE_SESSION_PERMISSIONS, this.handleUpdateSessionPermissions);

    this.socket.on(WS_UPDATE_VOTE_ROUND_USER_PERMISSIONS, this.handleUpdateUserPermissions);
  }

  private validateMessage<T extends WSMessage>(message: T, schema: ValidationSchema<T>): boolean {
    const error = validationService.validateBySchemaNonBlocking(message, schema);

    if (error) {
      this.socket.emit(WS_SOCKET_ERROR, error);
      return false;
    }

    return true;
  }

  private async shouldUpdateUserPermission(userId: string): Promise<boolean> {
    const user = await userService.findUserById(this.sessionId, userId);
    const session = await sessionService.findSessionById(this.sessionId);

    return user.id === session.createdBy && session.usePermissions;
  }

  private handleUserJoined = async (message: WSMessageUserData) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.USER_DATA)) {
      return;
    }

    if (await this.shouldUpdateUserPermission(message.body.user.id)) {
      this.getBroadcast().emit(
        WS_UPDATE_VOTE_ROUND_USER_PERMISSIONS,
        this.constructWsMessage({ hasPermission: false })
      );
    }

    this.getBroadcast().emit(WS_USER_JOINED, message);
  }

  private handleShowVotes = async (message: WSMessageUserData) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.USER_DATA)) {
      return;
    }

    await sessionService
      .modifySessionParams(this.sessionId, { showVotes: true });

    this.getBroadcast().emit(WS_SHOW_VOTES, message);
  };

  private handleHideVotes = async (message: WSMessage<null>) => {
    await sessionService
      .modifySessionParams(this.sessionId, { showVotes: false });

    this.getBroadcast().emit(WS_HIDE_VOTES, message);
  };

  private handleResetVoteRound = async (message: WSMessageUserData) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.USER_DATA)) {
      return;
    }

    await sessionService.modifySessionParams(this.sessionId, { showVotes: false, currentTopic: '' });
    await userService.clearAllVoteValues(this.sessionId);

    this.getBroadcast().emit(WS_RESET_VOTE_ROUND, message);
  };

  private handleSetVoteValue = async (message: WSMessageSetVoteValue) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.SET_VOTE_VALUE)) {
      return;
    }

    await userService
      .setUserVoteValue(this.sessionId, message.body.user.id, message.body.voteValue);

    this.getBroadcast().emit(WS_SET_USER_VOTE_VALUE, message);
  };

  private handleSetVoteRoundTopic = async (message: WSMessageSetTopic) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.SET_TOPIC)) {
      return;
    }

    await sessionService
      .modifySessionParams(this.sessionId, { currentTopic: message.body.topic });

    this.getBroadcast().emit(WS_SET_VOTE_ROUND_TOPIC, message);
  }

  private handleModifySessionUser = async (message: WSMessageModifyUser) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.MODIFY_USER)) {
      return;
    }

    const { userId, params } = message.body;
    const user = await userService.modifyUser(this.sessionId, userId, params);
    const newMessage = this.constructWsMessage({ user });

    this.getBroadcast().emit(WS_MODIFY_SESSION_USER, newMessage);
  }

  private handleUpdateSessionPermissions = async (message: WSMessageSessionPermissions) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.SESSION_PERMISSIONS)) {
      return;
    }

    await sessionService.modifySessionParams(
      this.sessionId,
      { usePermissions: message.body.usePermissions }
    );

    this.getBroadcast().emit(WS_UPDATE_SESSION_PERMISSIONS, message);
  }

  private handleUpdateUserPermissions = async (message: WSMessageUserPermissions) => {
    if (!this.validateMessage(message, VALIDATION_SCHEMA.WS.USER_PERMISSIONS)) {
      return;
    }

    await userService
      .updateAllUserPermissions(this.sessionId, message.body.hasPermission);

    this.getBroadcast().emit(WS_UPDATE_VOTE_ROUND_USER_PERMISSIONS, message);
  }

  public async destroy(userId: string): Promise<void> {
    if (await this.shouldUpdateUserPermission(userId)) {
      this.getBroadcast().emit(
        WS_UPDATE_VOTE_ROUND_USER_PERMISSIONS,
        this.constructWsMessage({ hasPermission: true })
      );
    }

    const user = await userService.findUserById(this.sessionId, userId);

    await userService.removeUser(this.sessionId, userId);

    this.getBroadcast().emit(WS_USER_LEFT, this.constructWsMessage({ user }));

    void this.socket.leave(this.roomName);

    this.socket = null;
    this.sessionId = null;
    this.roomName = null;
  }
}

export default WsService;
