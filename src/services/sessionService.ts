import { IdGenerator, JoinSessionBody, SessionInfoParams, StartSessionBody } from '@models/sessionModel';
import shortid from 'shortid';
import Session, { SessionSchema } from '@schemas/sessionSchema';
import { UserSchema } from '@schemas/userSchema';
import { ID_GEN_ALLOWED_CHARS } from '@global/constants';
import { ERROR_CODES } from '@shared-with-ui/constants';
import StatusCodes from 'http-status-codes';
import UserService from '@services/userService';
import ValidationService from '@services/validationService';
import VALIDATION_SCHEMA from '@services/validationService/validationSchemas';
import ErrorService from '@services/errorService';

const userService = new UserService();
const validationService = new ValidationService();
const errorService = new ErrorService();

class SessionService {
  private idGenerator: IdGenerator = shortid;

  public constructor() {
    this.idGenerator.characters(ID_GEN_ALLOWED_CHARS);
  }

  private generateSectionId(): string {
    return this.idGenerator.generate();
  }

  private async registerNewSession(params: Partial<SessionSchema>): Promise<string> {
    const sessionId = this.generateSectionId();
    const session = new Session({
      id: sessionId,
      ...params,
    });

    await session.save();

    return sessionId;
  }

  public async findSessionById(id: string): Promise<SessionSchema> {
    return Session.findOne({ id }).lean();
  }

  public async modifySessionParams(id: string, params: Partial<SessionSchema>): Promise<SessionSchema> {
    return Session.findOneAndUpdate({ id }, params, { useFindAndModify: true });
  }

  public async joinSession(body: JoinSessionBody): Promise<UserSchema> {
    validationService.validateBySchema(body, VALIDATION_SCHEMA.JOIN_SESSION_BODY);

    const { sessionId, user } = body;
    const session = await this.findSessionById(sessionId);

    if (!session) {
      throw errorService.generate(StatusCodes.NOT_FOUND, ERROR_CODES.SESSION_NOT_FOUND);
    }

    if (await userService.userNameExists(sessionId, user.name)) {
      throw errorService.generate(StatusCodes.CONFLICT, ERROR_CODES.USER_NAME_EXISTS);
    }

    const hasPermission = session.createdBy === user.id || !session.usePermissions;

    return await userService.registerUser(sessionId, user, hasPermission);
  }

  public async loadSession(sessionId: string, userId: string): Promise<any> {
    validationService.validateBySchema(
      { sessionId, userId },
      VALIDATION_SCHEMA.LOAD_SESSION_PARAMS
    );

    const session = await this.findSessionById(sessionId);

    if (!session) {
      throw errorService.generate(
        StatusCodes.NOT_FOUND,
        ERROR_CODES.SESSION_NOT_FOUND,
        sessionId,
      );
    }

    const users = await userService.findAllSessionUsers(sessionId);
    const userExists = users.some((user) => user.id === userId);

    if (!userExists) {
      throw errorService.generate(StatusCodes.FORBIDDEN, ERROR_CODES.USER_NOT_FOUND);
    }

    return { ...session, users };
  }

  public async startSession(body: StartSessionBody): Promise<string> {
    validationService.validateBySchema(body, VALIDATION_SCHEMA.START_SESSION_BODY);

    const { user, useRoles, pointValues, roles, usePermissions } = body;
    const sessionParams = {
      useRoles,
      pointValues,
      roles,
      createdBy: user.id,
      usePermissions,
    };
    const sessionId = await this.registerNewSession(sessionParams);

    await userService.registerUser(sessionId, user, true);

    return sessionId;
  }

  public async getSessionInfo(params: SessionInfoParams): Promise<SessionSchema> {
    validationService.validateBySchema(params, VALIDATION_SCHEMA.SESSION_INFO_PARAMS);

    const session = await this.findSessionById(params.sessionId);

    if (!session) {
      throw errorService.generate(StatusCodes.NOT_FOUND, ERROR_CODES.SESSION_NOT_FOUND);
    }

    return session;
  }
}

export default SessionService;
