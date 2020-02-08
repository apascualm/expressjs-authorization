const AuthorizationErrors = require('./AuthorizationErrors');

function checkValidError(errorType) {
  if (!errorType || !errorType.type || !errorType.message) {
    return AuthorizationErrors.MISSING_ERROR;
  }
  return errorType;
}

function AuthorizationException(errorType) {
  const name = 'AuthorizationError';
  const { message } = checkValidError(errorType);
  const myError = new Error(message);
  myError.name = name;
  if (!errorType || !AuthorizationErrors[errorType]) throw myError;
  return myError;
}

module.exports = AuthorizationException;
