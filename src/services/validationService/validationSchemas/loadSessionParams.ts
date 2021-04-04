import { ValidationSchema } from '@services/validationService/types';
import { LoadSessionParams, LoadSessionQuery } from '@models/sessionModel';
import { REQUIRED, STRING } from '@services/validationService/validatorKeys';

const LOAD_SESSION_PARAMS: ValidationSchema<LoadSessionParams & LoadSessionQuery> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
  userId: [
    { key: REQUIRED },
    { key: STRING },
  ],
};

export default LOAD_SESSION_PARAMS;
