# expressjs-authorization

Expressjs Authorization Package is a Authorization system that it is based in permissions, you can group them by roles.

These permissions are separate by modules, this way you can take control about that modules you give permissions (ex. user, authorization, blog, pages, etc) to the users.

The persistence is make automatically via mongodb, you only have that said how is named (by deafult user) the user field  that you authentication middleware (ex passportjs) load in your request.


## First Steps

These steps are needed for initialize the middleware in Express.

```javascript
const express = require('express');
const Authorize = require('express-authorization');

app.use(Authorize.initialize({userField: 'otherUserField'})); // By default is loaded 'user'
```

### Routes

Optionally, but very recommended. You can load the routes predefined

````javascript
app.use(Authorize.Routes)
````

These are the routes available for authorization proposes and **they are protected with authentication module permissions**.

* [Roles routes](#roles-routes)
* [Permissions routes](#permissions-routes)
* [User authorization routes](#user-authorization-routes)
* [Configuration routes](#initial-configuration-routes)

#### Roles routes.
Get all roles  
Method: **GET**, Route: **/authorizations/roles**

Get a role by id  
Method: **GET**, Route: **/authorizations/roles/:id**

Create a role
Method: **POST**, Route: **/authorizations/roles**
```javascript
// Body request
{ name: 'admin' }
```
Assign a role to a user.  
Method: **GET**, Route: **/authorizations/roles/:roleId/assign/permission/:permissionId**

Revoke a role to a user.  
Method: **GET**, Route: **/authorizations/roles/:roleId/revoke/permission/:permissionId**

Delete a role.  
Method: **DELETE**, Route: **/authorizations/roles/:id**

#### Permissions routes.

Get all permissions  
Method: **GET**, Route: **/authorizations/permissions**

Get a permission by id  
Method: **GET**, Route: **/authorizations/permissions/:id**


Create a new permission  
Method: **POST**, Route: **/authorizations/permissions**
````javascript
// Body request
{ name: 'create', module: 'authorization' }
````

Delete a permission  
Method: **DELETE**, Route:  **/authorizations/permissions/:id** routes.delete(''


#### User authorization routes

Assign the permission indicated to the user via ids.  
Method: **GET**, Route: **/authorizations/users/:userId/assign/permission/:permissionId**

Revoke the permission indicated to the user via ids.  
Method: **GET**, Route: **/authorizations/users/:userId/revoke/permission/:permissionId**

Assign the role indicated to the user via ids.  
Method: **GET**, Route: **/authorizations/users/:userId/assign/roles/:roleId**

Revoke the role indicated to the user via ids.  
Method: **GET**, Route: **/authorizations/users/:userId/revoke/roles/:roleId**

#### Initial configuration routes
These routes are **unprotected** and only is recommended for a initial configuration. To activate these routes you may put the following variable in your .env file (AUTH_INIT=true), if not is configure of this way you don't will be access to these routes.

Make and load the initial roles and permissions  
Method: **GET**, Route: **/authorizations/initialize/**
```
roles: ['admin', 'user', 'guest']

permissions:
module: 'generic', permissions: ['create', 'read', 'update', 'delete', 'manage']
module: 'authorization', permissions: ['create', 'read', 'update', 'delete', 'manage']
```

Assign to the user the roles 'admin' and 'user' with your permissions extended.  
Method: **GET**, Route: **/authorizations/initialize/:userId**

## Authorization Class

Methods:
* [hasAnyPermission](#method-hasanyrole)
* [hasAllPermission](#method-hasallpermission)
* [hasAnyRole](#method-hasanyrole)
* [hasAllRole](#method-hasallrole)
* [createPermission](#method-createpermission)
* [createRole](#method-createrole)
* [assignPermissionToRole](#method-assignpermissiontorole)
* [removePermissionToRole](#method-removepermissiontorole)
* [assignPermissionToUser](#method-assignpermissiontouser)
* [removePermissionToUser](#method-removepermissiontouser)
* [assignRoleToUser](#method-assignroletouser)
* [removeRoleToUser](#method-removeroletouser)
* [getUserAuthorizations](#method-getuserauthorizations)

### hasAnyPermission

Check that the user have any of the permissions passed.

Parameters:
* **Permissions** {string|array<string>} name of the permission required.
* **Module** {string} name of the module that contain the permissions.

Return:
* Return a [authorization middleware](#authorization-middleware-class) class.

### Method hasAllPermission

Check that the user have all the permissions passed.

Parameters:
* **Permissions** {string|array<string>} name of the permission required.
* **Module** {string} name of the module that contain the permissions.

Return:
* Return a [authorization middleware](#authorization-middleware-class) class.

### Method hasAnyRole

Check that the user have any of the roles passed.

Parameters:
* **Roles** {string|array<string>} name of the permission required.
* **Module** {string} name of the module that contain the permissions.

Return:
* Return a [authorization middleware](#authorization-middleware-class) class.

### Method hasAllRole
Check that the user have all the roles passed.

Parameters:
* **Roles** {string|array<string>} name of the permission required.
* **Module** {string} name of the module that contain the permissions.

Return:
* Return a [authorization middleware](#authorization-middleware-class) class.

### Method createPermission
Create a permission.

Parameters:
* **name** {string} name of the permission.
* **module** {string} name of the module that contain the permissions.

Return:
* Return the permission created.

### Method createRole
Create a role.

Parameters:
* **name** {string} name of the role.

Return:
* Return the role created.

### Method assignPermissionToRole
Assign a Permission to a role.

Parameters:
* **roleId** {string} id of the role.
* **permissionId** {string} id of the permission.

Return:
* Return the role with the new permission assigned.

### Method removePermissionToRole
Revoke a Permission to a role.

Parameters:
* **roleId** {string} id of the role.
* **permissionId** {string} id of the permission.

Return:
* Return the role with the permission revoked.

### Method assignPermissionToUser
Assign a Permission to a user.

Parameters:
* **userId** {string} id of the user.
* **permissionId** {string} id of the permission.

Return:
* Return the user with the new permission assigned.

### Method removePermissionToUser
Revoke a Permission to a user.

Parameters:
* **userId** {string} id of the user.
* **permissionId** {string} id of the permission.

Return:
* Return the user with the permission revoked.

### Method assignRoleToUser
Assign a role to a user.

Parameters:
* **userId** {string} id of the user.
* **roleId** {string} id of the role.

Return:
* Return the user with the new role assigned.

### Method removeRoleToUser
Revoke a role to a user.

Parameters:
* **userId** {string} id of the user.
* **roleId** {string} id of the role.

Return:
* Return the user with the role revoked.

### Method getUserAuthorizations
Get roles and permissions of a user.

Parameters:
* **userId** {string} id of the user.

Return:
* Return the user with the roles and permissions assigned.

## Authorization Middleware Class

Methods:
* [middleware](#method-middleware)
* [middlewareOr](#method-middlewareor)
* [pass](#method-pass)

### Method middleware()

Return a middleware and execute the check with the permissions/roles that will be used in a expressjs Route.

Not parameters required:

Return:
* Return a middleware to express.

### Method middlewareOr()
Check if any middleware was true.

Parameters:
* **Middlewares** {middleware|array<middleware>}

Return:
* Return a middleware to express with all the checks.

### Method pass()
Check if the user have the permissions/roles required

Not parameters required:

Return:
* Return {boolean}.

## Example of implementation.
You can watch an example of how you can implement this package in the "example" folder.

## License

This project is licensed with [Apache License 2.0](License.md)
