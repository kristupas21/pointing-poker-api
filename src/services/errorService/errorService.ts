import StatusCodes from 'http-status-codes';
import { ERROR_CODES } from '@shared-with-ui/constants';
import { ApiError, ParsedError } from '@services/errorService/types';
import { ValueOf } from '@shared-with-ui/types';

class ErrorService {
  public generate(
    status: number,
    code: ValueOf<typeof ERROR_CODES>,
    payload?: any,
  ): ApiError {
    return {
      code,
      status,
      payload,
    };
  }

  public parse(e: any): ParsedError {
    const status = e?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const error = e?.code ? { code: e.code, payload: e.payload } : e;

    return { status, error };
  }
}

export default ErrorService;
