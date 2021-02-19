import { IdGenerator, JoinSessionParams } from '../session/sessionModel';
import shortid from 'shortid';
import Session, { SessionSchema } from '@controllers/session/sessionSchema';
import User, { UserSchema } from '@controllers/user/userSchema';
import { ID_GEN_ALLOWED_CHARS } from '@global/constants';



class SessionService {
    private idGenerator: IdGenerator = shortid;

    public constructor() {
        this.idGenerator.characters(ID_GEN_ALLOWED_CHARS)
    }

    private generateSectionId(): string {
        return this.idGenerator.generate();
    }

    public async joinSession(params: JoinSessionParams): Promise<any> {
        try {
            const { sessionId, user } = params;
            const sessionDB =  await Session.findOne({ id: sessionId }).lean();

            if (!sessionDB) {
                return null;
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
        } catch {
            return null;
        }
    }

    public async loadSession(sessionId: string): Promise<any> {
        try {
            const session = await Session.findOne({ id: sessionId }).lean();
            const users = await User.find({ registeredSessionId: sessionId }).lean();

            return { ...session, users };
        } catch {
            return null;
        }
    }

    public async startSession(user: UserSchema): Promise<string> {
        const sessionId = this.generateSectionId();
        const sessionDB = new Session({
            id: sessionId,
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
