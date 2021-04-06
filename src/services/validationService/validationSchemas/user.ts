import { ValidationSchema } from '@services/validationService/types';
import { UserSchemaProps } from '@schemas/userSchema';
import {
  BOOLEAN,
  REQUIRED,
  STRING,
  STRING_LENGTH_MAX,
  STRING_LENGTH_MIN
} from '@services/validationService/validatorKeys';
import { INPUT_MAX_CHARS, INPUT_MIN_CHARS } from '@shared-with-ui/constants';

const USER: ValidationSchema<UserSchemaProps> = {
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

export default USER;
