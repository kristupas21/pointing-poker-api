import jsonfile from 'jsonfile';
import { SessionDB } from '@controllers/session/sessionModel';

export interface Database {
    sessions: SessionDB[],
}

class DatabaseRepository {
    private readonly dbFilePath = 'src/database/database.json';


    protected openDb(): Promise<Database> {
        return jsonfile.readFile(this.dbFilePath) as Promise<Database>;
    }

    protected saveDb(db: Database): Promise<void> {
        return jsonfile.writeFile(this.dbFilePath, db);
    }
}

export default DatabaseRepository;
