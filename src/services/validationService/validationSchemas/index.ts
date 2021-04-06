import JOIN_SESSION_BODY from '@services/validationService/validationSchemas/joinSessionBody';
import LOAD_SESSION_PARAMS from '@services/validationService/validationSchemas/loadSessionParams';
import SESSION_INFO_PARAMS from '@services/validationService/validationSchemas/sessionInfoParams';
import START_SESSION_BODY from '@services/validationService/validationSchemas/startSessionBody';
import WS from '@services/validationService/validationSchemas/wsMessages';

const VALIDATION_SCHEMA = {
  JOIN_SESSION_BODY,
  LOAD_SESSION_PARAMS,
  SESSION_INFO_PARAMS,
  START_SESSION_BODY,
  WS,
};

export default VALIDATION_SCHEMA;
