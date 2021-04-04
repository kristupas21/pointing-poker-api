import {
  ValidationErrorObject,
  ValidationSchema,
  Validator,
  ValidatorFn,
  ValidatorKey
} from '@services/validationService/types';
import isEmpty from 'lodash/isEmpty';
import {
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  NUMBER,
  NUMBER_MAX,
  NUMBER_MIN,
  OBJECT,
  REQUIRED,
  STRING,
  STRING_MAX,
  STRING_MIN, STRING_NUMBER, STRING_NUMBER_MAX, STRING_NUMBER_MIN
} from '@services/validationService/validatorKeys';
import {
  castStringToNum,
  isBoolean,
  isNillable,
  isNumber,
  isNumberMaxValid,
  isNumberMinValid,
  isObject,
  isObjectArray,
  isPrimitiveArray,
  isProvided,
  isString,
  isStringMaxLenValid,
  isStringMinLenValid,
} from '@services/validationService/functions';
import { ERROR_CODES } from '@shared-with-ui/constants';
import StatusCodes from 'http-status-codes';
import ErrorService from '@services/errorService/errorService';
import { Primitive } from '@shared-with-ui/types';

const errorService = new ErrorService();

class ValidationService {
  private validationMap: Record<ValidatorKey, ValidatorFn> = {
    [REQUIRED]: isProvided,
    [STRING]: isNillable(isString),
    [NUMBER]: isNillable(isNumber),
    [STRING_MAX]: isNillable(isStringMaxLenValid),
    [STRING_MIN]: isNillable(isStringMinLenValid),
    [NUMBER_MIN]: isNillable(isNumberMinValid),
    [NUMBER_MAX]: isNillable(isNumberMaxValid),
    [ARRAY_PRIMITIVE]: isNillable(isPrimitiveArray),
    [ARRAY_OBJECT]: isNillable(isObjectArray),
    [BOOLEAN]: isNillable(isBoolean),
    [OBJECT]: isNillable(isObject),
    [STRING_NUMBER]: isNillable(castStringToNum(isNumber)),
    [STRING_NUMBER_MAX]: isNillable(castStringToNum(isNumberMaxValid)),
    [STRING_NUMBER_MIN]: isNillable(castStringToNum(isNumberMinValid)),
  }

  private exceptionKey = '__EXCEPTION__';

  private resolveErrorKey(validators: Validator[], value: any): string {
    const errorKey = validators.reduce((result, params) => {
      if (result) {
        return result;
      }

      if (params.exceptions?.includes(value)) {
        return this.exceptionKey;
      }

      const validate = this.validationMap[params.key];
      const validationPassed = validate(value, ...(params.args || []));

      if (!validationPassed) {
        return params.key;
      }

      if (params.key === OBJECT) {
        return this.validateBySchema(value, params.schema);
      }

      if (params.key === ARRAY_PRIMITIVE) {
        return value.forEach((v) => this.validatePrimitive(v, params.validators));
      }

      if (params.key === ARRAY_OBJECT) {
        return value.forEach((v) => this.validateBySchema(v, params.schema));
      }

      return result;
    }, '');

    if (errorKey && errorKey !== this.exceptionKey) {
      return errorKey;
    }

    return undefined;
  }

  private resolveErrorObject<T extends object>(
    item: T,
    schema: ValidationSchema<T>
  ): ValidationErrorObject<T> {
    return Object.entries<Validator[]>(schema).reduce(
      (result, [prop, validators]) => {
        if (!validators) {
          return result;
        }

        const errorKey = this.resolveErrorKey(validators, item[prop]);

        if (!errorKey) {
          return result;
        }

        return {
          ...result,
          [prop]: errorKey,
        };
      }, {});
  }

  public validateBySchema<T extends object>(item: T, schema: ValidationSchema<T>): void {
    const errorObject = this.resolveErrorObject(item, schema);

    if (isEmpty(errorObject)) {
      return;
    }

    throw errorService.generate(
      StatusCodes.BAD_REQUEST,
      ERROR_CODES.INVALID_PARAMS,
      errorObject,
    )
  }

  public validatePrimitive<T extends Primitive>(item: T, validators: Validator[]): void {
    const errorKey = this.resolveErrorKey(validators, item);

    if (!errorKey) {
      return;
    }

    throw errorService.generate(
      StatusCodes.BAD_REQUEST,
      ERROR_CODES.INVALID_PARAMS,
      errorKey,
    )
  }
}

export default ValidationService;
