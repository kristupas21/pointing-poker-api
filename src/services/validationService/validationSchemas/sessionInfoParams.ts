import { ValidationSchema } from '@services/validationService/types';
import { SessionInfoParams } from '@models/sessionModel';
import { REQUIRED, STRING } from '@services/validationService/validatorKeys';

const SESSION_INFO_PARAMS: ValidationSchema<SessionInfoParams> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
};

export default SESSION_INFO_PARAMS;
