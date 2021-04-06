import { ValidationSchema } from '@services/validationService/types';
import { StartSessionBody } from '@models/sessionModel';
import {
  ARRAY_LENGTH_MAX,
  ARRAY_LENGTH_MIN,
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  STRING
} from '@services/validationService/validatorKeys';
import { MAX_POINT_VALUES_COUNT, MAX_ROLES_COUNT, MIN_POINT_VALUES_COUNT } from '@shared-with-ui/constants';
import commonValidationSchema from '@services/validationService/validationSchemas/common';

const START_SESSION_BODY: ValidationSchema<StartSessionBody> = {
  ...commonValidationSchema.user,
  useRoles: [
    { key: BOOLEAN },
  ],
  pointValues: [
    { key: ARRAY_OBJECT, schema: commonValidationSchema.pointValue },
    { key: ARRAY_LENGTH_MIN, args: [MIN_POINT_VALUES_COUNT]},
    { key: ARRAY_LENGTH_MAX, args: [MAX_POINT_VALUES_COUNT]},
  ],
  roles: [
    { key: ARRAY_PRIMITIVE, validators: [{ key: STRING }] },
    { key: ARRAY_LENGTH_MAX, args: [MAX_ROLES_COUNT]},
  ],
  usePermissions: [
    { key: BOOLEAN },
  ],
};

export default START_SESSION_BODY;
