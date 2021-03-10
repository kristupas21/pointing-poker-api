import { UserSchema } from '@schemas/userSchema';
import { PointValue } from '@shared-with-ui/types';

export interface IdGenerator {
  generate: () => string;
  characters: (chars: string) => void;
}

export interface JoinSessionBody {
  sessionId: string;
  user: UserSchema;
}

export interface StartSessionBody {
  user: UserSchema;
  useRoles: boolean;
  pointValues: PointValue[];
  roles?: string[];
}

export interface LoadSessionParams {
  sessionId: string;
}

export interface LoadSessionQuery {
  userId: string;
}
