import { ValueOf } from '@shared-with-ui/types';

export type ValidatorKey = ValueOf<typeof import('@services/validationService/validatorKeys')>;

export type Validator<T extends object = {}> =
    { key: ValidatorKey, args?: any[], schema?: ValidationSchema<T>, validators?: Validator[] };

export type ValidationSchema<T extends object> =
    Record<keyof T, Validator[]>;

export type ValidatorFn = (...args) => boolean;

export type ValidationErrorObject<T extends object> = Record<keyof T, ValidatorKey> | {};
