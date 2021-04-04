import { ValidationSchema } from '@services/validationService/types';
import { JoinSessionBody } from '@models/sessionModel';
import { OBJECT, REQUIRED, STRING } from '@services/validationService/validatorKeys';
import USER from '@services/validationService/validationSchemas/user';

const JOIN_SESSION_BODY: ValidationSchema<JoinSessionBody> = {
  sessionId: [
    { key: REQUIRED },
    { key: STRING },
  ],
  user: [
    { key: REQUIRED },
    { key: OBJECT, schema: USER },
  ],
}

export default JOIN_SESSION_BODY;
