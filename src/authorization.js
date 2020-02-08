const { AuthorizationExpressErrors } = require('./exceptions');
const { AuthorizationMiddleware } = require('./middlewares');
const { PermissionService, RoleService, UserAuthorizationService } = require('./services');
const expressRoutes = require('./express');

let AuthorizeModule = null;

function Authorize() {
  this._reqUserField = 'user';
  this._module = 'generic';
}

Authorize.prototype.initialize = function initialize(params = {}) {
  this._reqUserField = params.userField || 'user';
  return (req, res, next) => {
    req.authorize = this;
    if (!req[this._reqUserField]) {
      req[this._reqUserField] = {};
    }
    this._user = req[this._reqUserField];
    next();
  };
};

Authorize.prototype.setModule = function setModule(module) {
  this._module = module;
  return this;
};

Authorize.prototype._loadAuthorizationMiddleware = function loadAuthMiddleware(method, authentication, module) {
  this._module = module;
  if (!module) this._module = 'generic';
  AuthorizationMiddleware.prototype.assignRole = function assignRole(role) {
    console.log('WE ARE USING THE ASSIGN ROLE OF MAIN CLASS');
    AuthorizeModule.assignRoleToUser(role, this._user._id);
  };
  const mid = new AuthorizationMiddleware(method, authentication);
  return Object.assign(mid, this);
};

Authorize.prototype.hasAnyPermission = function hasAnyPermission(permission, module = null) {
  return this._loadAuthorizationMiddleware('hasAnyPermission', permission, module);
};

Authorize.prototype.hasAllPermission = function hasAllPermission(permission, module = null) {
  return this._loadAuthorizationMiddleware('hasAllPermission', permission, module);
};

Authorize.prototype.hasAnyRole = function hasAnyRole(role) {
  return this._loadAuthorizationMiddleware('hasAnyRole', role, null);
};

Authorize.prototype.hasAllRole = function hasAllRole(role) {
  return this._loadAuthorizationMiddleware('hasAllRole', role, null);
};

Authorize.prototype.createPermission = function createPermission(module, name) {
  return PermissionService.create(module, name);
};
Authorize.prototype.createRole = function createRole(name) {
  return RoleService.create(name);
};
Authorize.prototype.assignPermissionToRole = function assignPermissionToRole(roleId, permissionId) {
  return RoleService.assignPermission(roleId, permissionId);
};

Authorize.prototype.assignPermissionToUser = function assignPermissionToUser(permissionId, userId) {
  return UserAuthorizationService.assignPermission(userId, permissionId);
};

Authorize.prototype.removePermissionToUser = function removePermissionToUser(permissionId, userId) {
  return UserAuthorizationService.removePermission(userId, permissionId);
};

Authorize.prototype.assignRoleToUser = function assignRoleToUser(roleId, userId) {
  return UserAuthorizationService.assignRole(userId, roleId);
};

Authorize.prototype.removeRoleToUser = function removeRoleToUser(roleId, userId) {
  return UserAuthorizationService.removeRole(userId, roleId);
};
AuthorizeModule = new Authorize();

module.exports = AuthorizeModule;
module.exports.AuthorizationExpressErrors = AuthorizationExpressErrors;
module.exports.Routes = expressRoutes;
