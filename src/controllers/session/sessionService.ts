import { JoinSessionParams, SessionDB } from '../session/sessionModel';
import SessionRepository from '../session/sessionRepository';
import { User } from '@shared-with-ui/types';
import shortid from 'shortid';

type IdGenerator = {
    generate: () => string;
    characters: (chars: string) => void;
}

const idGenerator: IdGenerator = shortid;
const sessionRepository = new SessionRepository();

idGenerator.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@&')

class SessionService {
    public static generateSectionId(): string {
        return idGenerator.generate();
    }

    public async joinSession(params: JoinSessionParams): Promise<SessionDB> {
        const { sessionId, user } = params;
        const session = await sessionRepository.getSessionById(sessionId);

        if (!session) {
            return null;
        }

        const index = session.users.findIndex((u) => u.id === user.id);

        if (index > -1) {
            await sessionRepository.replaceUser(sessionId, user, index);
        } else {
            await sessionRepository.insertUser(sessionId, user);
        }

        return await sessionRepository.getSessionById(sessionId);
    }

    public async loadSession(sessionId: string): Promise<SessionDB> {
        return await sessionRepository.getSessionById(sessionId);
    }

    public async startSession(user: User): Promise<SessionDB> {
        const sessionId = SessionService.generateSectionId();
        const session: SessionDB = { id: sessionId, users: [user] };

        await sessionRepository.insertSession(session);

        return session;
    }
}

export default SessionService;
