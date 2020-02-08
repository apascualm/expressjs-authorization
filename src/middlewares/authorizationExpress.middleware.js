const { AuthorizationException, AuthorizationErrors } = require('../exceptions');
const { RoleService, PermissionService, UserAuthorizationService } = require('../services');
const { rolesSeed, permissionsSeed } = require('../seeds');

class authorizationExpressMiddleware {
  static async getRole(req, res, next) {
    try {
      let role = null;
      const { id } = req.params;
      if (!id) {
        role = RoleService.getAll();
      } else {
        role = RoleService.get(id);
      }
      return res.jsonData ? res.jsonData(role) : res.json(role);
    } catch (e) {
      return next(e);
    }
  }

  static async createRole(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const role = RoleService.create(name);
      return res.jsonData ? res.jsonData(role) : res.json(role);
    } catch (e) {
      return next(e);
    }
  }

  static async deleteRole(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const role = RoleService.remove(id);
      return res.jsonData ? res.jsonData(role) : res.json(role);
    } catch (e) {
      return next(e);
    }
  }

  static async getPermission(req, res, next) {
    try {
      let permission = null;
      const { id } = req.params;
      if (!id) {
        permission = PermissionService.getAll();
      } else {
        permission = PermissionService.get(id);
      }
      return res.jsonData ? res.jsonData(permission) : res.json(permission);
    } catch (e) {
      return next(e);
    }
  }

  static async createPermission(req, res, next) {
    try {
      const { module, name } = req.body;
      if (!module) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!name) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const permission = PermissionService.create(module, name);
      return res.jsonData ? res.jsonData(permission) : res.json(permission);
    } catch (e) {
      return next(e);
    }
  }

  static async deletePermission(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const permission = PermissionService.remove(id);
      return res.jsonData ? res.jsonData(permission) : res.json(permission);
    } catch (e) {
      return next(e);
    }
  }

  static async assignPermissionsToRole(req, res, next) {
    try {
      const { permissionId, roleId } = req.body;
      if (!permissionId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!roleId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const role = RoleService.assignPermission(roleId, permissionId);
      return res.jsonData ? res.jsonData(role) : res.json(role);
    } catch (e) {
      return next(e);
    }
  }

  static async revokePermissionsToRole(req, res, next) {
    try {
      const { permissionId, roleId } = req.body;
      if (!permissionId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!roleId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const role = RoleService.removePermission(roleId, permissionId);
      return res.jsonData ? res.jsonData(role) : res.json(role);
    } catch (e) {
      return next(e);
    }
  }

  static async assignRoleToUser(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      if (!userId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!roleId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const user = UserAuthorizationService.assignRole(userId, roleId);
      return res.jsonData ? res.jsonData(user) : res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  static async assignPermissionToUser(req, res, next) {
    try {
      const { userId, permissionId } = req.body;
      if (!userId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!permissionId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const user = UserAuthorizationService.assignPermission(userId, permissionId);
      return res.jsonData ? res.jsonData(user) : res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  static async revokeRoleToUser(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      if (!userId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!roleId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const user = UserAuthorizationService.removeRole(userId, roleId);
      return res.jsonData ? res.jsonData(user) : res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  static async revokePermissionToUser(req, res, next) {
    try {
      const { userId, permissionId } = req.body;
      if (!userId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      if (!permissionId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      const user = UserAuthorizationService.removePermission(userId, permissionId);
      return res.jsonData ? res.jsonData(user) : res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  static async initialize(req, res, next) {
    try {
      for (const permission of permissionsSeed) {
        await PermissionService.create(permission.module, permission.name);
      }
      for (const role of rolesSeed) {
        const newRole = await RoleService.create(role.name);
        if (role.modulesToAdd && role.modulesToAdd.length > 0) {
          for (const module of role.modulesToAdd) {
            const permissions = await PermissionService.getByModule(module);
            for (const permission of permissions) {
              await RoleService.assignPermission(newRole, permission);
            }
          }
        }
      }
      const result = {
        permissions: await PermissionService.getAll(),
        roles: await RoleService.getAll(),
      };
      return res.jsonData ? res.jsonData(result) : res.json(result);
    } catch (e) {
      return next(e);
    }
  }

  static async initializeUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) return next(new AuthorizationException(AuthorizationErrors.BAD_PARAMETERS));
      let user = null;
      user = await UserAuthorizationService.assignRole(userId, 'user');
      user = await UserAuthorizationService.assignRole(userId, 'admin');
      return res.jsonData ? res.jsonData(user) : res.json(user);
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = authorizationExpressMiddleware;
