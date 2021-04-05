import { Document, Schema, model } from 'mongoose';
import { PointValue } from '@shared-with-ui/types';

const Session = new Schema({
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
    type: [String],
    required: false,
    default: [],
  },
  createdBy: {
    type: String,
    required: true,
  },
  usePermissions: {
    type: Boolean,
    required: false,
    default: false,
  }
});

export interface SessionSchemaProps {
  createdBy: string;
  currentTopic: string;
  id: string;
  pointValues: PointValue[];
  roles: string[];
  showVotes: boolean;
  usePermissions?: boolean;
  useRoles: boolean;
}

export type SessionSchema = Document & SessionSchemaProps;

export default model<SessionSchema>('Session', Session);
