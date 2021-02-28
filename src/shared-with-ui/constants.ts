import { PointValue } from '@shared-with-ui/types';

export const ERROR_CODES: Record<string, string> = {
    INTERNAL_SERVER: 'error.internalServer',
    MISSING_PARAM: 'error.missingParam',
    MUST_CHOOSE_ROLE: 'error.mustChooseRole',
    NOT_FOUND: 'error.notFound',
    SESSION_NOT_FOUND: 'error.sessionNotFound',
    UNEXPECTED: 'error.unexpected',
    USER_NOT_FOUND: 'error.userNotFound',
};

export const POINT_VALUE_INFINITY = '∞';
export const POINT_VALUE_UNKNOWN = '?';

export const DEFAULT_POINT_VALUES: PointValue[] = [
    { id: 'default-0', pos: 0, value: '0' },
    { id: 'default-1', pos: 1, value: '1' },
    { id: 'default-2', pos: 2, value: '2' },
    { id: 'default-3', pos: 3, value: '3' },
    { id: 'default-4', pos: 4, value: '5' },
    { id: 'default-5', pos: 5, value: '8' },
    { id: 'default-6', pos: 6, value: '13' },
    { id: 'default-7', pos: 7, value: '21' },
    { id: 'default-8', pos: 8, value: '40' },
    { id: 'default-9', pos: 9, value: '100' },
    { id: 'default-10', pos: 10, value: POINT_VALUE_INFINITY },
    { id: 'default-11', pos: 11, value: POINT_VALUE_UNKNOWN },
];
