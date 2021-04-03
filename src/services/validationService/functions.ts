import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import { ValidatorFn } from '@services/validationService/types';

export function isNillable(fn: ValidatorFn): ValidatorFn {
  return (...args) => isNil(args[0]) || fn(...args);
}

export function isProvided(value: any): boolean {
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

export function isStringNotEmpty(value: string): boolean {
  return value !== '' && value.trim() !== '';
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
  return isArray(value) && value.every((v) => (isBoolean(v) || isString(v) || isNumber(v)))
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
