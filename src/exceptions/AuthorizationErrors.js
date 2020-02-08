const AuthorizationErrors = {
  REQUEST: {
    message: 'Param request is needed.',
    type: 'REQUEST',
  },
  NOT_AUTHENTICATED: {
    message: 'Not Authenticated.',
    type: 'NOT_AUTHENTICATED',
  },
  NOT_AUTHORIZED: {
    message: 'Not Authorized.',
    type: 'NOT_AUTHORIZED',
  },
  MISSING_ERROR: {
    message: 'Error type missing.',
    type: 'MISSING_ERROR',
  },
  METHOD_NOT_FOUND: {
    message: 'Internal Method not found.',
    type: 'METHOD_NOT_FOUND',
  },
  BAD_PARAMETERS: {
    message: 'Bad request by parameters missing or invalid.',
    type: 'BAD_PARAMETERS',
  },
};

module.exports = AuthorizationErrors;
