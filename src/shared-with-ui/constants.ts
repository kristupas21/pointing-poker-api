export const ERROR_CODES = {
  INTERNAL_SERVER: 'error.internalServer',
  MISSING_PARAM: 'error.missingParam',
  NOT_FOUND: 'error.notFound',
  SESSION_NOT_FOUND: 'error.sessionNotFound',
  UNEXPECTED: 'error.unexpected',
  USER_NOT_FOUND: 'error.userNotFound',
  USER_NAME_EXISTS: 'error.userNameExists',
};

export const WS_USER_JOINED = '@@ws/USER_JOINED';
export const WS_USER_LEFT = '@@ws/USER_LEFT';
export const WS_SHOW_VOTES = '@@ws/@voteRound/SHOW_VOTES';
export const WS_HIDE_VOTES = '@@ws/@voteRound/HIDE_VOTES';
export const WS_RESET_VOTE_ROUND = '@@ws/@voteRound/RESET';
export const WS_SET_USER_VOTE_VALUE = '@@ws/@voteRound/SET_USER_VOTE_VALUE';
export const WS_SET_VOTE_ROUND_TOPIC = '@@ws/@voteRound/SET_TOPIC';
export const WS_MODIFY_SESSION_USER = '@@ws/@session/MODIFY_USER';
