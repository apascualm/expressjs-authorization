const mongoose = require('mongoose');
const autoPopulate = require('mongoose-autopopulate');
const PermissionModel = require('./permission.model');

const { Schema } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
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

schema.plugin(autoPopulate);

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

const model = mongoose.model('roles', schema);

module.exports = model;
