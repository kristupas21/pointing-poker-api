import { Document, Schema, model } from 'mongoose';
import { PointValue, UserRole } from '@shared-with-ui/types';

const Session = new Schema({
    id: { type: String, required: true },
    currentTopic: { type: String, required: false, default: '' },
    showVotes: { type: Boolean, required: false, default: false },
    useRoles: { type: Boolean, required: false, default: false },
    pointValues: {
        type: [{ pos: Number, value: String, id: String }],
        required: false,
        default: [],
    },
    roles: {
        type: [{ name: String, id: String }],
        required: false,
        default: [],
    },
})

export interface SessionSchema extends Document {
    id: string;
    currentTopic: string;
    showVotes: boolean;
    useRoles: boolean;
    pointValues: PointValue[];
    roles: UserRole[];
}

export default model<SessionSchema>('Session', Session);
