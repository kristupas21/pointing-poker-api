import { ValidationSchema } from '@services/validationService/types';
import {
  WSMessage,
  WSMessageModifyUser,
  WSMessageSessionPermissions,
  WSMessageSetTopic,
  WSMessageSetVoteValue,
  WSMessageUserData,
  WSMessageUserPermissions
} from '@shared-with-ui/types';
import {
  BOOLEAN,
  OBJECT,
  REQUIRED,
  STRING,
  STRING_LENGTH_MAX,
  STRING_LENGTH_MIN
} from '@services/validationService/validatorKeys';
import commonValidationSchema from '@services/validationService/validationSchemas/common';
import { INPUT_MAX_CHARS, INPUT_MIN_CHARS } from '@shared-with-ui/constants';

const getSchema = <T extends WSMessage>(schema: ValidationSchema<T['body']>): ValidationSchema<T> => ({
  ...commonValidationSchema.session,
  body: [
    { key: REQUIRED },
    { key: OBJECT, schema },
  ],
});

const USER_DATA: ValidationSchema<WSMessageUserData> = {
  ...getSchema<WSMessageUserData>({
    ...commonValidationSchema.user,
  })
};

const SET_VOTE_VALUE: ValidationSchema<WSMessageSetVoteValue> = {
  ...getSchema<WSMessageSetVoteValue>({
    ...commonValidationSchema.user,
    voteValue: commonValidationSchema.pointValue.value,
  })
};

const SET_TOPIC: ValidationSchema<WSMessageSetTopic> = {
  ...getSchema<WSMessageSetTopic>({
    topic: [
      { key: REQUIRED },
      { key: STRING },
    ],
  })
};

const MODIFY_USER: ValidationSchema<WSMessageModifyUser> = {
  ...getSchema<WSMessageModifyUser>({
    userId: [
      { key: REQUIRED },
      { key: STRING },
    ],
    params: [
      { key: REQUIRED },
      {
        key: OBJECT,
        schema: {
          ...commonValidationSchema.userSchema,
          id: undefined,
          name: [
            { key: STRING },
            { key: STRING_LENGTH_MIN, args: [INPUT_MIN_CHARS] },
            { key: STRING_LENGTH_MAX, args: [INPUT_MAX_CHARS] },
          ],
        }
      }
    ]
  })
};

const SESSION_PERMISSIONS: ValidationSchema<WSMessageSessionPermissions> = {
  ...getSchema<WSMessageSessionPermissions>({
    usePermissions: [
      { key: REQUIRED },
      { key: BOOLEAN },
    ],
  })
};

const USER_PERMISSIONS: ValidationSchema<WSMessageUserPermissions> = {
  ...getSchema<WSMessageUserPermissions>({
    hasPermission: [
      { key: REQUIRED },
      { key: BOOLEAN },
    ],
  })
};

const WS = {
  USER_DATA,
  SET_VOTE_VALUE,
  SET_TOPIC,
  MODIFY_USER,
  SESSION_PERMISSIONS,
  USER_PERMISSIONS,
};

export default WS;
