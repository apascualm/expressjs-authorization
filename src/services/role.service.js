const { RoleModel } = require('../models');

/**
 *
 * @param id {string}
 * @return {Query}
 */
const get = (id) => RoleModel.findById(id).populate('permissions');

/**
 *
 * @return {Query|void|number|bigint|T|T}
 */
const getAll = async () => RoleModel.find().populate('permissions');

/**
 *
 * @param name {string}
 * @return {*}
 */
const create = async (name) => RoleModel.create({ name });

/**
 *
 * @param id {string}
 * @return {Query|Promise|*}
 */
const remove = async (id) => RoleModel.deleteOne({ _id: id });

/**
 *
 * @param role {string|RoleModel}
 * @param permission {string,Array<string>}
 * @return {Promise<Promise|void|*|null>}
 */
const assignPermission = async (role, permission) => {
  const roleInstance = await get(role);
  if (!roleInstance) return null;
  return roleInstance.assignPermission(permission);
};

/**
 *
 * @param role {string|RoleModel}
 * @param permission {string|PermissionModel}
 * @return {Promise<Promise|void|*|null>}
 */
const removePermission = async (role, permission) => {
  const roleInstance = await get(role);
  if (!roleInstance) return null;
  return roleInstance.removePermission(permission);
};

module.exports = {
  get,
  getAll,
  create,
  remove,
  assignPermission,
  removePermission,
};
