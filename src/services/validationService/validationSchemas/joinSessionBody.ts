import { ValidationSchema } from '@services/validationService/types';
import { JoinSessionBody } from '@models/sessionModel';
import commonValidationSchema from '@services/validationService/validationSchemas/common';

const JOIN_SESSION_BODY: ValidationSchema<JoinSessionBody> = {
  ...commonValidationSchema.session,
  ...commonValidationSchema.user,
};

export default JOIN_SESSION_BODY;
