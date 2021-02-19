import { SessionDB } from './sessionModel';
import { User } from '@shared-with-ui/types';
import DatabaseRepository, { Database } from '@database/database.repo';

class SessionRepository extends DatabaseRepository {
    public async getAllSessions(): Promise<SessionDB[]> {
        const db = await super.openDb();
        return db.sessions;
    }

    private findSession(db: Database, sessionId: string): SessionDB {
        return db.sessions.find((s) => s.id === sessionId);
    }

    public async getSessionById(sessionId: string): Promise<SessionDB> {
        const db = await super.openDb();
        const session = this.findSession(db, sessionId);

        return session || null;
    }

    public async replaceUser(sessionId: string, user: User, index: number): Promise<void> {
        const db = await super.openDb();
        const session = this.findSession(db, sessionId);

        session.users[index] = user;

        await super.saveDb(db)
    }

    public async insertUser(sessionId: string, user: User): Promise<void> {
        const db = await super.openDb();
        const session = this.findSession(db, sessionId);

        session.users.push(user);

        await super.saveDb(db)
    }

    public async insertSession(session: SessionDB): Promise<void> {
        const db = await super.openDb();

        db.sessions.push(session);

        await super.saveDb(db);
    }
}

export default SessionRepository;
