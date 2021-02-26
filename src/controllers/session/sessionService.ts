import { IdGenerator, JoinSessionParams } from '../session/sessionModel';
import shortid from 'shortid';
import Session, { SessionSchema } from '@controllers/session/sessionSchema';
import User, { UserSchema } from '@controllers/user/userSchema';
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

    public async joinSession(params: JoinSessionParams): Promise<any> {
        const { sessionId, user } = params;
        const session: SessionSchema =  await Session.findOne({ id: sessionId }).lean();

        if (!session) {
            throw { status: StatusCodes.NOT_FOUND, code: ERROR_CODES.SESSION_NOT_FOUND };
        }

        if (session.useRoles && !user.role) {
            throw { status: StatusCodes.FORBIDDEN, code: ERROR_CODES.MUST_CHOOSE_ROLE };
        }

        const filter = { id: user.id, registeredSessionId: sessionId };
        const userParams = { ...user, registeredSessionId: sessionId };
        const existingUser = await User.findOne(filter).lean();

        if (existingUser) {
            await User.replaceOne(filter, userParams)
        } else {
            const newUser = new User(userParams);
            await newUser.save();
        }

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

    public async startSession(user: UserSchema, useRoles = true): Promise<string> {
        const sessionId = this.generateSectionId();
        const sessionDB = new Session({
            id: sessionId,
            useRoles,
        });

        const userDB = new User({
            ...user,
            registeredSessionId: sessionId,
        });

        try {
            await sessionDB.save();
            await userDB.save();

            return sessionId;
        } catch {
            return null;
        }
    }

    public async setSessionVoteStatus(sessionId: string, status: boolean): Promise<SessionSchema> {
        return Session.findOneAndUpdate({ id: sessionId }, { showVotes: status });
    }
}

export default SessionService;
