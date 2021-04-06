import { ValidationSchema } from '@services/validationService/types';
import {
  BOOLEAN,
  NUMBER,
  NUMBER_MIN,
  OBJECT,
  REQUIRED,
  STRING, STRING_LENGTH_MAX, STRING_LENGTH_MIN,
  STRING_NUMBER, STRING_NUMBER_MAX,
  STRING_NUMBER_MIN
} from '@services/validationService/validatorKeys';
import { UserSchemaProps } from '@schemas/userSchema';
import { PointValue } from '@shared-with-ui/types';
import {
  INPUT_MAX_CHARS,
  INPUT_MIN_CHARS,
  NUMBER_INPUT_MAX,
  NUMBER_INPUT_MIN,
  POINT_VALUE_INFINITY,
  POINT_VALUE_UNKNOWN
} from '@shared-with-ui/constants';

const pointValue: ValidationSchema<PointValue> = {
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
    { key: STRING_NUMBER, exceptions: [POINT_VALUE_UNKNOWN, POINT_VALUE_INFINITY] },
    { key: STRING_NUMBER_MIN, args: [NUMBER_INPUT_MIN]},
    { key: STRING_NUMBER_MAX, args: [NUMBER_INPUT_MAX]},
  ],
};

const userSchema: ValidationSchema<UserSchemaProps> = {
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
    { key: STRING_LENGTH_MIN, args: [INPUT_MIN_CHARS] },
    { key: STRING_LENGTH_MAX, args: [INPUT_MAX_CHARS] },
  ],
  role: [
    { key: STRING },
  ],
  voteValue: [
    { key: STRING },
  ],
  hasPermission: [
    { key: BOOLEAN },
  ]
};

const session: ValidationSchema<{ sessionId: string }> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
};

const user: ValidationSchema<{ user: UserSchemaProps }> = {
  user: [
    { key: REQUIRED },
    { key: OBJECT, schema: userSchema },
  ],
};

const commonValidationSchema = {
  userSchema,
  pointValue,
  user,
  session,
};

export default commonValidationSchema;
