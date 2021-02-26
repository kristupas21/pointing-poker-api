import { Schema, model, Document } from 'mongoose';
import { AvatarId } from '@shared-with-ui/types';

const User = new Schema({
    avatarId: { type: String, enum: Object.values(AvatarId), required: false },
    id: { type: String, required: true },
    isObserver: { type: Boolean, required: false, default: false },
    name: { type: String, required: true },
    role: { type: String, required: false },
    registeredSessionId: { type: String, required: true },
    voteValue: { type: String, required: false, default: null },
});

export interface UserSchema extends Document {
    avatarId?: AvatarId;
    id: string;
    isObserver?: boolean;
    name: string;
    role?: string;
    registeredSessionId?: string;
    voteValue?: string;
}

export default model<UserSchema>('User', User);
