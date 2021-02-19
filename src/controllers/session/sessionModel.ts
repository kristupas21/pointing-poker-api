import { UserSchema } from '@controllers/user/userSchema';

export interface IdGenerator {
    generate: () => string;
    characters: (chars: string) => void;
}

export interface JoinSessionParams {
    sessionId: string;
    user: UserSchema;
}
