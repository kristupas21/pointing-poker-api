import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import { ValidatorFn } from '@services/validationService/types';

export function allowNil(fn: ValidatorFn): ValidatorFn {
  return (...args) => isNil(args[0]) || fn(...args);
}

export function castStringToNum(fn: ValidatorFn): ValidatorFn {
  return (...args) => {
    args.splice(0, 1, Number(args[0]));
    return fn(...args);
  };
}

export function isNotNil(value: any): boolean {
  return value != null;
}

export function isNil(value: any): boolean {
  return value == null;
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isNumber(value: any): boolean {
  return (
    typeof value === 'number' &&
      !Number.isNaN(value) &&
      value !== Infinity &&
      value !== -Infinity);
}

export function isStringMinLenValid(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export function isStringMaxLenValid(value: string, max: number): boolean {
  return value.trim().length <= max;
}

export function isNumberMinValid(value: number, min: number): boolean {
  return value >= min;
}

export function isNumberMaxValid(value: number, max: number): boolean {
  return value <= max;
}

export function isPrimitiveArray(value: any[]): boolean {
  return isArray(value) && value.every((v) => (isBoolean(v) || isString(v) || isNumber(v)));
}

export function isObjectArray(value: any[]): boolean {
  return isArray(value) && value.every(isObject);
}

export function isArray(value: any[]): boolean {
  return _isArray(value);
}

export function isObject(value: any): boolean {
  return _isPlainObject(value);
}

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

export function isArrayMinLenValid(value: any[], min: number): boolean {
  return value.length >= min;
}

export function isArrayMaxLenValid(value: any[], max: number): boolean {
  return value.length <= max;
}
