import { Document, Schema, model } from 'mongoose';
import { PointValue, UserRole } from '@shared-with-ui/types';
import { DAY_IN_SECONDS } from '@global/constants';

const Session = new Schema({
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
    expires: DAY_IN_SECONDS
  },
  id: {
    type: String,
    required: true
  },
  currentTopic: {
    type: String,
    required: false,
    default: ''
  },
  showVotes: {
    type: Boolean,
    required: false,
    default: false
  },
  useRoles: {
    type: Boolean,
    required: false,
    default: false
  },
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
  dateCreated: Date;
  id: string;
  currentTopic: string;
  pointValues: PointValue[];
  roles: UserRole[];
  showVotes: boolean;
  useRoles: boolean;
}

export default model<SessionSchema>('Session', Session);
