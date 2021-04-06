import { ValidationSchema } from '@services/validationService/types';
import { SessionInfoParams } from '@models/sessionModel';
import commonValidationSchema from '@services/validationService/validationSchemas/common';

const SESSION_INFO_PARAMS: ValidationSchema<SessionInfoParams> = {
  ...commonValidationSchema.session,
};

export default SESSION_INFO_PARAMS;
