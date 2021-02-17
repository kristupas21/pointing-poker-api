export interface User {
    avatarId?: string;
    id: string;
    name: string;
    role?: string;
    registeredSessionId?: string;
    voteValue?: string;
}

export interface WSMessage<T = never> {
    eventType: string;
    body: T;
}

export interface WSBodySessionJoined {
    session: {
        id: string;
        users: User[];
    }
}
