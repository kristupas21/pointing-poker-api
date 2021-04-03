import { ValidationSchema } from '@services/validationService/types';
import {
  JoinSessionBody,
  LoadSessionParams,
  LoadSessionQuery,
  SessionInfoParams,
  StartSessionBody
} from '@models/sessionModel';
import {
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  NUMBER,
  NUMBER_MIN,
  OBJECT,
  REQUIRED,
  STRING,
  STRING_MAX,
  STRING_MIN
} from '@services/validationService/validatorKeys';
import { UserSchemaProps } from '@schemas/userSchema';
import { INPUT_MAX_CHARS, INPUT_MIN_CHARS } from '@shared-with-ui/constants';
import { PointValue } from '@shared-with-ui/types';

export const VALIDATION_SCHEMA_USER: ValidationSchema<UserSchemaProps> = {
  avatarId: [
    { key: STRING },
  ],
  id: [
    { key: REQUIRED },
    { key: STRING },
  ],
  isObserver: [
    { key: BOOLEAN },
  ],
  name: [
    { key: REQUIRED },
    { key: STRING },
    { key: STRING_MIN, args: [INPUT_MIN_CHARS] },
    { key: STRING_MAX, args: [INPUT_MAX_CHARS] },
  ],
  role: [
    { key: STRING },
  ],
  voteValue: [
    { key: STRING },
  ],
  registeredSessionId: undefined,
}

export const VALIDATION_SCHEMA_JOIN_SESSION_BODY: ValidationSchema<JoinSessionBody> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
  user: [
    { key: REQUIRED },
    { key: OBJECT, schema: VALIDATION_SCHEMA_USER },
  ],
}

export const VALIDATION_SCHEMA_LOAD_SESSION_PARAMS: ValidationSchema<LoadSessionParams & LoadSessionQuery> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
  userId: [
    { key: REQUIRED },
    { key: STRING },
  ],
}

export const VALIDATION_SCHEMA_POINT_VALUE: ValidationSchema<PointValue> = {
  pos: [
    { key: REQUIRED },
    { key: NUMBER },
    { key: NUMBER_MIN, args: [0] },
  ],
  id: [
    { key: REQUIRED },
    { key: STRING },
  ],
  value: [
    { key: REQUIRED },
    { key: STRING },
  ]
}

export const VALIDATION_SCHEMA_START_SESSION_BODY: ValidationSchema<StartSessionBody> = {
  user: [
    { key: REQUIRED },
    { key: OBJECT, schema: VALIDATION_SCHEMA_USER },
  ],
  useRoles: [
    { key: BOOLEAN },
  ],
  pointValues: [
    { key: ARRAY_OBJECT, schema: VALIDATION_SCHEMA_POINT_VALUE },
  ],
  roles: [
    { key: ARRAY_PRIMITIVE, validators: [{ key: STRING }] },
  ],
}

export const VALIDATION_SCHEMA_SESSION_INFO_PARAMS: ValidationSchema<SessionInfoParams> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
}
