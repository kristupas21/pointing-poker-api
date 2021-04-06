import {
  ValidationErrorObject,
  ValidationSchema,
  Validator,
  ValidatorFn,
  ValidatorKey
} from '@services/validationService/types';
import isEmpty from 'lodash/isEmpty';
import {
  ARRAY_LENGTH_MAX, ARRAY_LENGTH_MIN,
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  NUMBER,
  NUMBER_MAX,
  NUMBER_MIN,
  OBJECT,
  REQUIRED,
  STRING,
  STRING_LENGTH_MAX,
  STRING_LENGTH_MIN,
  STRING_NUMBER,
  STRING_NUMBER_MAX,
  STRING_NUMBER_MIN
} from '@services/validationService/validatorKeys';
import {
  castStringToNum, isArrayMaxLenValid, isArrayMinLenValid,
  isBoolean,
  allowNil,
  isNumber,
  isNumberMaxValid,
  isNumberMinValid,
  isObject,
  isObjectArray,
  isPrimitiveArray,
  isNotNil,
  isString,
  isStringMaxLenValid,
  isStringMinLenValid,
} from '@services/validationService/functions';
import { ERROR_CODES } from '@shared-with-ui/constants';
import StatusCodes from 'http-status-codes';
import ErrorService from '@services/errorService';
import { Primitive } from '@shared-with-ui/types';
import { ApiError } from '@services/errorService/types';

const errorService = new ErrorService();

class ValidationService {
  private validationMap: Record<ValidatorKey, ValidatorFn> = {
    [ARRAY_LENGTH_MAX]: allowNil(isArrayMaxLenValid),
    [ARRAY_LENGTH_MIN]: allowNil(isArrayMinLenValid),
    [ARRAY_OBJECT]: allowNil(isObjectArray),
    [ARRAY_PRIMITIVE]: allowNil(isPrimitiveArray),
    [BOOLEAN]: allowNil(isBoolean),
    [NUMBER]: allowNil(isNumber),
    [NUMBER_MAX]: allowNil(isNumberMaxValid),
    [NUMBER_MIN]: allowNil(isNumberMinValid),
    [OBJECT]: allowNil(isObject),
    [REQUIRED]: isNotNil,
    [STRING]: allowNil(isString),
    [STRING_LENGTH_MAX]: allowNil(isStringMaxLenValid),
    [STRING_LENGTH_MIN]: allowNil(isStringMinLenValid),
    [STRING_NUMBER]: allowNil(castStringToNum(isNumber)),
    [STRING_NUMBER_MAX]: allowNil(castStringToNum(isNumberMaxValid)),
    [STRING_NUMBER_MIN]: allowNil(castStringToNum(isNumberMinValid)),
  }

  private exceptionKey = Symbol('exception');

  private resolveErrorKey(validators: Validator[], value: any): ValidatorKey {
    const errorKey = validators.reduce((result: ValidatorKey | Symbol, params) => {
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
    }, undefined);

    if (errorKey && errorKey !== this.exceptionKey) {
      return errorKey as ValidatorKey;
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

        const { args } = schema[prop].find((v) => v.key === errorKey);

        return {
          ...result,
          [prop]: {
            type: errorKey,
            value: item[prop],
            ...(args && { shouldMatch: args }),
          },
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
    );
  }

  public validatePrimitive<T extends Primitive>(item: T, validators: Validator[]): void {
    const errorKey = this.resolveErrorKey(validators, item);

    if (!errorKey) {
      return;
    }

    const { args } = validators.find((v) => v.key === errorKey);
    const errorObject = {
      type: errorKey,
      value: item,
      ...(args && { shouldMatch: args }),
    };

    throw errorService.generate(
      StatusCodes.BAD_REQUEST,
      ERROR_CODES.INVALID_PARAMS,
      errorObject,
    );
  }

  public validateBySchemaNonBlocking<T extends object>(
    item: T,
    schema: ValidationSchema<T>
  ): ApiError | void {
    try {
      return this.validateBySchema(item, schema);
    } catch (e) {
      return e as ApiError;
    }
  }

}

export default ValidationService;
