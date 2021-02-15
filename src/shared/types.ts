import { Request } from 'express';

export interface User {
    avatarId?: string;
    id: string;
    name: string;
    role?: string;
    registeredSessionId?: string;
    voteValue?: string;
}

export interface AppRequest<T = null> extends Request {
    body: T;
}
