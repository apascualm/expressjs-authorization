const { AuthorizationException, AuthorizationErrors } = require('../exceptions');
const { UserAuthorizationService } = require('../services');

function Middleware(method, authentication) {
  if (Array.isArray(authentication)) {
    this._permission = authentication;
  } else {
    this._permission = [authentication];
  }
  this._type = method;
}
Middleware.prototype._processRequest = function processRequest(req) {
  if (!req) throw new AuthorizationException(AuthorizationErrors.REQUEST);
  if (!req[this._reqUserField]) throw new AuthorizationException(AuthorizationErrors.NOT_AUTHENTICATED);
  this._req = req;
  this._user = req[this._reqUserField];
};

Middleware.prototype._checkAuthorization = async function checkAuthorization() {
  if (!this[`_${this._type}`]) throw new AuthorizationException(AuthorizationErrors.METHOD_NOT_FOUND);
  const user = await UserAuthorizationService.getByUserId(this._user._id);
  if (!user) throw new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED);
  this._userAuthorizations = user;
  if (!this[`_${this._type}`]()) throw new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED);
  return true;
};

Middleware.prototype._getAllPermissions = function getAllPermissions() {
  const user = this._userAuthorizations.toJSON();
  let permissions = [...user.permissions];
  for (const role of user.roles) {
    permissions = permissions.concat(role.permissions);
  }
  return permissions;
};

Middleware.prototype._getAllRoles = function getAllRoles() {
  const user = this._userAuthorizations.toJSON();
  let permissions = [];
  for (const role of user.roles) {
    permissions.push(role.name);
  }
  return permissions;
};

Middleware.prototype._hasAnyPermission = function hasAnyPermission() {
  const permissions = this._getAllPermissions();
  if (!permissions || permissions.length < 1) {
    throw new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED);
  }
  return this._permission.some((myPermission) => permissions
    .some((permission) => (permission.module === this._module && permission.name === myPermission)));
};

Middleware.prototype._hasAllPermission = function hasAllPermission() {
  const permissions = this._getAllPermissions();
  if (!permissions || permissions.length < 1) {
    throw new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED);
  }
  return this._permission.every((myPermission) => permissions
    .some((permission) => (permission.module === this._module && permission.name === myPermission)));
};

Middleware.prototype._hasAnyRole = function hasAnyRole() {
  const permissions = this._getAllRoles();
  if (!permissions || permissions.length < 1) {
    throw new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED);
  }
  return this._permission.some((myPermission) => permissions
    .some((permission) => permission === myPermission));
};

Middleware.prototype._hasAllRole = function hasAllRole() {
  const permissions = this._getAllRoles();
  if (!permissions || permissions.length < 1) {
    throw new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED);
  }
  return this._permission.every((myPermission) => permissions
    .some((permission) => permission === myPermission));
};

Middleware.prototype.middleware = function middleware() {
  const thisMiddleware = this;
  return async (req, res, next) => {
    try {
      await thisMiddleware.pass(req);
    } catch (e) {
      next(e);
    }
    next();
  };
};

Middleware.prototype.middlewareOr = function middleware(...arrayMiddlewares) {
  let middlewares = arrayMiddlewares;
  middlewares.push(this);
  return async (req, res, next) => {
    try {
      const checks = [];
      for (const middleware of middlewares) {
        try{
          checks.push(await middleware.pass(req));
        } catch (e) {
          checks.push(false);
        }
      }
      if (!checks.some((check) => check)) next(new AuthorizationException(AuthorizationErrors.NOT_AUTHORIZED));
    } catch (e) {
      next(e);
    }
    next();
  };
};

Middleware.prototype.pass = async function pass(req) {
  this._processRequest(req);
  return this._checkAuthorization();
};

module.exports = Middleware;
