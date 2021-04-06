import { Schema, model, Document } from 'mongoose';
import { AvatarId } from '@shared-with-ui/types';

const User = new Schema({
  avatarId: {
    type: String,
    enum: Object.values(AvatarId),
    required: true
  },
  id: {
    type: String,
    required: true
  },
  isObserver: {
    type: Boolean,
    required: false,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  hasPermission: {
    type: Boolean,
    required: false,
    default: true,
  },
  role: {
    type: String,
    default: '',
    required: false
  },
  registeredSessionId: {
    type: String,
    required: true
  },
  voteValue: {
    type: String,
    required: false,
    default: null
  },
});

export interface UserSchemaProps {
  avatarId: AvatarId;
  id: string;
  isObserver?: boolean;
  name: string;
  role?: string;
  registeredSessionId?: string;
  hasPermission?: boolean;
  voteValue?: string;
}

export type UserSchema = Document & UserSchemaProps;

export default model<UserSchema>('User', User);
