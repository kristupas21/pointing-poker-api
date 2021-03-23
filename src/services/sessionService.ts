import { IdGenerator, JoinSessionBody, StartSessionBody } from '@models/sessionModel';
import shortid from 'shortid';
import Session, { SessionSchema } from '@schemas/sessionSchema';
import User, { UserSchema } from '@schemas/userSchema';
import { ID_GEN_ALLOWED_CHARS } from '@global/constants';
import { ERROR_CODES } from '@shared-with-ui/constants';
import StatusCodes from 'http-status-codes';

class SessionService {
  private idGenerator: IdGenerator = shortid;

  public constructor() {
    this.idGenerator.characters(ID_GEN_ALLOWED_CHARS)
  }

  private generateSectionId(): string {
    return this.idGenerator.generate();
  }

  public async joinSession(params: JoinSessionBody): Promise<UserSchema> {
    const { sessionId, user } = params;
    const session: SessionSchema =  await Session.findOne({ id: sessionId }).lean();

    if (!session) {
      throw { status: StatusCodes.NOT_FOUND, code: ERROR_CODES.SESSION_NOT_FOUND };
    }

    const roleMissing =
        session.useRoles &&
        !user.role &&
        !user.isObserver;

    const invalidRole =
        session.useRoles &&
        !user.isObserver &&
        user.role &&
        !session.roles.some((r) => r.name === user.role.name);

    if (roleMissing || invalidRole) {
      throw {
        status: StatusCodes.FORBIDDEN,
        code: ERROR_CODES.MUST_CHOOSE_ROLE,
        payload: session.roles,
      };
    }

    const filter = { id: user.id, registeredSessionId: sessionId };
    const userParams = { ...user, registeredSessionId: sessionId };

    await User.updateOne(filter, userParams, { upsert: true });

    return params.user;
  }

  public async loadSession(sessionId: string, userId: string): Promise<any> {
    const session = await Session.findOne({ id: sessionId }).lean();
    const users = await User.find({ registeredSessionId: sessionId }).lean();
    const userExists = users.some((user) => user.id === userId);

    if (!userExists) {
      throw {
        code: ERROR_CODES.USER_NOT_FOUND,
        status: StatusCodes.FORBIDDEN,
      };
    }

    return { ...session, users };
  }

  public async startSession(params: StartSessionBody): Promise<string> {
    const { user, useRoles, pointValues, roles } = params;
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

    return sessionId;
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
}

export default SessionService;
