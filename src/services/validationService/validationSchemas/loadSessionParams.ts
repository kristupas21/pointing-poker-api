import { ValidationSchema } from '@services/validationService/types';
import { LoadSessionParams, LoadSessionQuery } from '@models/sessionModel';
import { REQUIRED, STRING } from '@services/validationService/validatorKeys';
import commonValidationSchema from '@services/validationService/validationSchemas/common';

const LOAD_SESSION_PARAMS: ValidationSchema<LoadSessionParams & LoadSessionQuery> = {
  ...commonValidationSchema.session,
  userId: [
    { key: REQUIRED },
    { key: STRING },
  ],
};

export default LOAD_SESSION_PARAMS;
