import { User } from '@shared-with-ui/types';

export interface SessionDB {
    id: string;
    users: User[];
}

export interface JoinSessionParams {
    sessionId: string;
    isObserver?: boolean;
    user: User;
}
