export const ERROR_CODES = {
  INTERNAL_SERVER: 'error.internalServer',
  MISSING_PARAM: 'error.missingParam',
  NOT_FOUND: 'error.notFound',
  SESSION_NOT_FOUND: 'error.sessionNotFound',
  UNEXPECTED: 'error.unexpected',
  USER_NOT_FOUND: 'error.userNotFound',
  USER_NAME_EXISTS: 'error.userNameExists',
  INVALID_PARAMS: 'error.invalidParams',
};

export const WS_SOCKET_ERROR = '@@ws/SOCKET_ERROR';
export const WS_USER_JOINED = '@@ws/USER_JOINED';
export const WS_USER_LEFT = '@@ws/USER_LEFT';
export const WS_SHOW_VOTES = '@@ws/@voteRound/SHOW_VOTES';
export const WS_HIDE_VOTES = '@@ws/@voteRound/HIDE_VOTES';
export const WS_RESET_VOTE_ROUND = '@@ws/@voteRound/RESET';
export const WS_SET_USER_VOTE_VALUE = '@@ws/@voteRound/SET_USER_VOTE_VALUE';
export const WS_SET_VOTE_ROUND_TOPIC = '@@ws/@voteRound/SET_TOPIC';
export const WS_MODIFY_SESSION_USER = '@@ws/@session/MODIFY_USER';
export const WS_UPDATE_SESSION_PERMISSIONS ='@@ws/UPDATE_SESSION_PERMISSIONS';
export const WS_UPDATE_VOTE_ROUND_USER_PERMISSIONS = '@@ws/@voteRound/UPDATE_USER_PERMISSIONS';

export const INPUT_MIN_CHARS = 2;
export const INPUT_MAX_CHARS = 50;
export const NUMBER_INPUT_MIN = 0;
export const NUMBER_INPUT_MAX = 100;

export const POINT_VALUE_INFINITY = '∞';
export const POINT_VALUE_UNKNOWN = '?';

export const MIN_POINT_VALUES_COUNT = 2;
export const MAX_POINT_VALUES_COUNT = 16;

export const MIN_ROLES_COUNT = 2;
export const MAX_ROLES_COUNT = 8;
