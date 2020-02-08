const mongoose = require('mongoose');
const autoPopulate = require('mongoose-autopopulate');
const arrayUniquePlugin = require('mongoose-unique-array');
const PermissionModel = require('./permission.model');
const RoleModel = require('./role.model');

const { Schema } = mongoose;
let model = null;
const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      unique: true,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'roles',
        autopopulate: true,
        unique: true,
      },
    ],
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'permissions',
        autopopulate: true,
        unique: true,
      },
    ],
  },
  { timestamps: true },
);
schema.plugin(arrayUniquePlugin);
schema.plugin(autoPopulate);

/**
 *
 * @param role {RoleModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
schema.methods.assignRole = async function assignRole(role) {
  let roleInstance = null;
  if (typeof role === 'string') {
    roleInstance = await RoleModel.findOne({ name: role });
    if (!roleInstance) roleInstance = await RoleModel.findById(role);
  } else if (role._id) {
    roleInstance = role;
  }
  if (!roleInstance) return null;
  const user = this.toJSON();
  const currentRoles = [...user.roles];
  const exist = currentRoles.some((currentRole) => {
    return roleInstance._id.equals(currentRole._id);
  });
  // if (exist) throw new Error('duplicate');
  this.roles.push(roleInstance._id);
  return this.save();
};

/**
 *
 * @param role {RoleModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
schema.methods.removeRole = async function removeRole(role) {
  let roleInstance = null;
  if (typeof role === 'string') {
    roleInstance = await RoleModel.findById(role);
  } else if (role._id) {
    roleInstance = role;
  }
  if (!roleInstance) return null;
  this.roles.pull(roleInstance._id);
  return this.save();
};

/**
 *
 * @param permission {PermissionModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
schema.methods.assignPermission = async function assignPermission(permission) {
  let permissionInstance = null;
  if (typeof permission === 'string') {
    permissionInstance = await PermissionModel.findById(permission);
  } else if (permission._id) {
    permissionInstance = permission;
  }
  if (!permissionInstance) return null;
  this.permissions.push(permissionInstance._id);
  return this.save();
};

/**
 *
 * @param permission {PermissionModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
schema.methods.removePermission = async function removePermission(permission) {
  let permissionInstance = null;
  if (typeof permission === 'string') {
    permissionInstance = await PermissionModel.findById(permission);
  } else if (permission._id) {
    permissionInstance = permission;
  }
  if (!permissionInstance) return null;
  this.permissions.pull(permissionInstance._id);
  return this.save();
};

model = mongoose.model('usersWithPermissions', schema);

module.exports = model;
