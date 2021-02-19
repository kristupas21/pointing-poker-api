import { Schema, model, Document } from 'mongoose';

const User = new Schema({
    avatarId: { type: String, required: false },
    id: { type: String, required: true },
    isObserver: { type: Boolean, required: false, default: false },
    name: { type: String, required: true },
    role: { type: String, required: false },
    registeredSessionId: { type: String, required: true },
});

export interface UserSchema extends Document {
    avatarId?: string;
    id: string;
    name: string;
    role?: string;
    registeredSessionId?: string;
    voteValue?: string;
}

export default model<UserSchema>('User', User);
