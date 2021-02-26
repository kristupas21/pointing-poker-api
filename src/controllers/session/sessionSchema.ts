import { Document, Schema, model } from 'mongoose';

const Session = new Schema({
    id: { type: String, required: true },
    currentTopic: { type: String, required: false, default: '' },
    showVotes: { type: Boolean, required: false, default: false },
    useRoles: { type: Boolean, required: false, default: false },
})

export interface SessionSchema extends Document {
    id: string;
    currentTopic?: string;
    showVotes?: boolean;
    useRoles: boolean;
}

export default model<SessionSchema>('Session', Session);
