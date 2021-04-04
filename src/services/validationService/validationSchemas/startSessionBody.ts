import { ValidationSchema } from '@services/validationService/types';
import { StartSessionBody } from '@models/sessionModel';
import {
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  OBJECT,
  REQUIRED,
  STRING
} from '@services/validationService/validatorKeys';
import USER from '@services/validationService/validationSchemas/user';
import POINT_VALUE from '@services/validationService/validationSchemas/pointValue';

const START_SESSION_BODY: ValidationSchema<StartSessionBody> = {
  user: [
    { key: REQUIRED },
    { key: OBJECT, schema: USER },
  ],
  useRoles: [
    { key: BOOLEAN },
  ],
  pointValues: [
    { key: ARRAY_OBJECT, schema: POINT_VALUE },
  ],
  roles: [
    { key: ARRAY_PRIMITIVE, validators: [{ key: STRING }] },
  ],
}

export default START_SESSION_BODY;
