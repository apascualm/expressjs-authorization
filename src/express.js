const { Router } = require('express');
const { AuthorizationExpressMiddleware: AuthController } = require('./middlewares');

const authorizationRoutes = (Authorize) => {
  const routes = Router();

  // Roles routes
  routes.get('/authorizations/roles', Authorize.hasAnyPermission(['read', 'manage'], 'authorization').middleware(), AuthController.getRole);
  routes.get('/authorizations/roles/:id', Authorize.hasAnyPermission(['read', 'manage'], 'authorization').middleware(), AuthController.getRole);
  routes.post('/authorizations/roles', Authorize.hasAnyPermission(['create', 'manage'], 'authorization').middleware(), AuthController.createRole);
  routes.get(
    '/authorizations/roles/:roleId/assign/permission/:permissionId',
    Authorize.hasAnyPermission(['update', 'manage'], 'authorization').middleware(),
    AuthController.assignPermissionsToRole,
  );
  routes.get(
    '/authorizations/roles/:roleId/revoke/permission/:permissionId',
    Authorize.hasAnyPermission(['update', 'manage'], 'authorization').middleware(),
    AuthController.revokePermissionsToRole,
  );
  routes.delete('/authorizations/roles/:id', Authorize.hasAnyPermission(['delete', 'manage'], 'authorization').middleware(), AuthController.deleteRole);

  // Permissions routes
  routes.get('/authorizations/permissions', Authorize.hasAnyPermission(['read', 'manage'], 'authorization').middleware(), AuthController.getRole);
  routes.get('/authorizations/permissions/:id', Authorize.hasAnyPermission(['read', 'manage'], 'authorization').middleware(), AuthController.getRole);
  routes.post('/authorizations/permissions', Authorize.hasAnyPermission(['create', 'manage'], 'authorization').middleware(), AuthController.createPermission);
  routes.delete('/authorizations/permissions/:id', Authorize.hasAnyPermission(['delete', 'manage'], 'authorization').middleware(), AuthController.deletePermission);

  // User authorization routes
  routes.get(
    '/authorizations/users/:userId/assign/permission/:permissionId',
    Authorize.hasAnyPermission(['update', 'manage'], 'authorization').middleware(),
    AuthController.assignPermissionToUser,
  );
  routes.get(
    '/authorizations/users/:userId/revoke/permission/:permissionId',
    Authorize.hasAnyPermission(['update', 'manage'], 'authorization').middleware(),
    AuthController.revokePermissionToUser,
  );
  routes.get('/authorizations/users/:userId/assign/roles/:roleId', Authorize.hasAnyPermission(['update', 'manage'], 'authorization').middleware(), AuthController.assignRoleToUser);
  routes.get('/authorizations/users/:userId/revoke/roles/:roleId', Authorize.hasAnyPermission(['update', 'manage'], 'authorization').middleware(), AuthController.revokeRoleToUser);

  if (process.env.AUTH_INIT) {
    routes.get('/authorizations/initialize', AuthController.initialize);
    routes.get('/authorizations/initialize/:userId', AuthController.initializeUser);
  }
  return routes;
};
module.exports = authorizationRoutes;
