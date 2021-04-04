import { ValidationSchema } from '@services/validationService/types';
import { PointValue } from '@shared-with-ui/types';
import {
  NUMBER,
  NUMBER_MIN,
  REQUIRED,
  STRING,
  STRING_NUMBER,
  STRING_NUMBER_MAX,
  STRING_NUMBER_MIN
} from '@services/validationService/validatorKeys';
import {
  NUMBER_INPUT_MAX,
  NUMBER_INPUT_MIN, POINT_VALUE_INFINITY, POINT_VALUE_UNKNOWN,
} from '@shared-with-ui/constants';

const POINT_VALUE: ValidationSchema<PointValue> = {
  pos: [
    { key: REQUIRED },
    { key: NUMBER },
    { key: NUMBER_MIN, args: [0] },
  ],
  id: [
    { key: REQUIRED },
    { key: STRING },
  ],
  value: [
    { key: REQUIRED },
    { key: STRING_NUMBER, exceptions: [POINT_VALUE_UNKNOWN, POINT_VALUE_INFINITY] },
    { key: STRING_NUMBER_MIN, args: [NUMBER_INPUT_MIN]},
    { key: STRING_NUMBER_MAX, args: [NUMBER_INPUT_MAX]},
  ],
}

export default POINT_VALUE;
