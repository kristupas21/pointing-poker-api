import { IdGenerator, JoinSessionBody, SessionInfoParams, StartSessionBody } from '@models/sessionModel';
import shortid from 'shortid';
import Session, { SessionSchema } from '@schemas/sessionSchema';
import User, { UserSchema } from '@schemas/userSchema';
import { ID_GEN_ALLOWED_CHARS } from '@global/constants';
import { ERROR_CODES } from '@shared-with-ui/constants';
import StatusCodes from 'http-status-codes';
import UserService from '@services/userService';
import ValidationService from '@services/validationService/validationService';
import {
  VALIDATION_SCHEMA_JOIN_SESSION_BODY,
  VALIDATION_SCHEMA_LOAD_SESSION_PARAMS,
  VALIDATION_SCHEMA_SESSION_INFO_PARAMS,
  VALIDATION_SCHEMA_START_SESSION_BODY
} from '@services/validationService/validationSchemas';
import ErrorService from '@services/errorService/errorService';

const userService = new UserService();
const validationService = new ValidationService();
const errorService = new ErrorService();

class SessionService {
  private idGenerator: IdGenerator = shortid;

  public constructor() {
    this.idGenerator.characters(ID_GEN_ALLOWED_CHARS)
  }

  private generateSectionId(): string {
    return this.idGenerator.generate();
  }

  public async joinSession(body: JoinSessionBody): Promise<UserSchema> {
    validationService.validateBySchema(body, VALIDATION_SCHEMA_JOIN_SESSION_BODY);

    const { sessionId, user } = body;
    const session: SessionSchema = await Session.findOne({ id: sessionId }).lean();

    if (!session) {
      throw errorService.generate(StatusCodes.NOT_FOUND, ERROR_CODES.SESSION_NOT_FOUND);
    }

    if (await userService.userNameExists(sessionId, user.name)) {
      throw errorService.generate(StatusCodes.CONFLICT, ERROR_CODES.USER_NAME_EXISTS);
    }

    return await userService.registerUser(sessionId, user);
  }

  public async loadSession(sessionId: string, userId: string): Promise<any> {
    validationService.validateBySchema(
      { sessionId, userId },
      VALIDATION_SCHEMA_LOAD_SESSION_PARAMS
    );

    const session = await Session.findOne({ id: sessionId }).lean();

    if (!session) {
      throw errorService.generate(
        StatusCodes.NOT_FOUND,
        ERROR_CODES.SESSION_NOT_FOUND,
        sessionId,
      );
    }

    const users = await User.find({ registeredSessionId: sessionId }).lean();
    const userExists = users.some((user) => user.id === userId);

    if (!userExists) {
      throw errorService.generate(StatusCodes.FORBIDDEN, ERROR_CODES.USER_NOT_FOUND);
    }

    return { ...session, users };
  }

  public async startSession(body: StartSessionBody): Promise<{ sessionId: string }> {
    validationService.validateBySchema(body, VALIDATION_SCHEMA_START_SESSION_BODY);

    const { user, useRoles, pointValues, roles } = body;
    const sessionId = this.generateSectionId();

    const sessionDB = new Session({
      id: sessionId,
      useRoles,
      pointValues,
      roles,
    });

    const userDB = new User({
      ...user,
      registeredSessionId: sessionId,
    });

    await sessionDB.save();
    await userDB.save();

    return { sessionId };
  }

  public async setSessionVoteStatus(
    sessionId: string,
    showVotes: boolean
  ): Promise<SessionSchema> {
    return Session.findOneAndUpdate(
      { id: sessionId },
      { showVotes },
      { useFindAndModify: true }
    );
  }

  public async setSessionTopic(sessionId: string, currentTopic: string): Promise<SessionSchema> {
    return Session.findOneAndUpdate(
      { id: sessionId },
      { currentTopic },
      { useFindAndModify: true }
    );
  }

  public async getSessionInfo(params: SessionInfoParams): Promise<SessionSchema> {
    validationService.validateBySchema(params, VALIDATION_SCHEMA_SESSION_INFO_PARAMS);

    const session: SessionSchema = await Session.findOne({ id: params.sessionId }).lean();

    if (!session) {
      throw errorService.generate(StatusCodes.NOT_FOUND, ERROR_CODES.SESSION_NOT_FOUND);
    }

    return session;
  }
}

export default SessionService;
