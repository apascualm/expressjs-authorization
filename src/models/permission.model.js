const mongoose = require('mongoose');
const RoleModel = require('./role.model');

const { Schema } = mongoose;

const schema = new Schema(
  {
    module: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

schema.index({ module: 1, name: 1 }, { unique: true });

schema.methods.assignToRole = async function assignToRole(role) {
  let roleInstance = null;
  if (typeof role === 'string') {
    roleInstance = await RoleModel.findById(role);
  } else if (role._id) {
    roleInstance = role;
  }
  if (!roleInstance) return null;
  this.roles.push(roleInstance._id);
  return this.save();
};

const model = mongoose.model('permissions', schema);

module.exports = model;
