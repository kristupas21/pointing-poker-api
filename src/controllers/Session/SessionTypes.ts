import { User } from '@shared/types';

export interface SessionDB {
    id: string;
    users: User[];
}

export interface SessionJoinREQ {
    sessionId: string;
    name: string;
    role: string;
    isObserver?: boolean;
}
