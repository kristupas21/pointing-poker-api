import { ERROR_CODES } from '@shared-with-ui/constants';
import { ValueOf } from '@shared-with-ui/types';

interface ApiErrorBody {
  code: ValueOf<typeof ERROR_CODES>,
  payload?: any;
}

export interface ApiError extends ApiErrorBody {
  status: number,
}

export interface ParsedError {
  status: number,
  error: ApiErrorBody;
}
