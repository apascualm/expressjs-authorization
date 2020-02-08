const AuthorizationExpressErrors = (error) => {
  const message = error.message || 'Internal Authorization Error';
  const status = 403;
  return { data: null, status, message };
};

module.exports = AuthorizationExpressErrors;
