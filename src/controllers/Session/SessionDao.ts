import { SessionJoinREQ, SessionDB } from './SessionTypes';
import Database from '@daos/Database/Database.mod';
import { User } from '@shared/types';
import { getRandomInt } from '@shared/functions';

interface Dao {
    join: (req: SessionJoinREQ) => Promise<SessionDB>;
    get: (sessionId: string) => Promise<SessionDB>;
    start: (user: User) => Promise<SessionDB>;
}

class SessionDao extends Database implements Dao {
    public async join(req: SessionJoinREQ) {
        const db = await super.openDb();
        const session = db.sessions.find((s) => s.id === req.sessionId);

        if (!session) {
            throw new Error('Session not found.')
        }

        const user: User = {
            id: getRandomInt().toString(),
            name: req.name,
            role: req.role,
        };

        const index = session.users.findIndex((u) => u.name === req.name);

        if (index > -1) {
            session.users[index] = user;
        } else {
            session.users.push(user);
        }


        await super.saveDb(db)

        return session;
    }

    public async get(sessionId: string) {
        const db = await super.openDb();
        const session = db.sessions.find((s) => s.id === sessionId);

        if (!session) {
            throw new Error('Session not found.')
        }

        return session;
    }

    public async start(user: User) {
        const session: SessionDB = {
            id: getRandomInt().toString(),
            users: [user],
        };
        const db = await super.openDb();

        db.sessions.push(session);

        await super.saveDb(db);

        return session;
    }
}

export default SessionDao;
