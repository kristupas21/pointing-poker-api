import jsonfile from 'jsonfile';
import { SessionDB } from '@controllers/Session/SessionTypes';

interface IDatabase {
    sessions: SessionDB[],
}

class Database {
    private readonly dbFilePath = 'src/daos/Database/Database.json';


    protected openDb(): Promise<IDatabase> {
        return jsonfile.readFile(this.dbFilePath) as Promise<IDatabase>;
    }

    protected saveDb(db: IDatabase): Promise<void> {
        return jsonfile.writeFile(this.dbFilePath, db);
    }
}

export default Database;
