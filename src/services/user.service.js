const { UserAuthorizationModel } = require('../models');

/**
 *
 * @param id
 * @return {Promise<Query|void>}
 */
const getByUserId = async function getByUserId(id) {
  let user = await UserAuthorizationModel.findOne({ userId: id });
  if (!user) user = await UserAuthorizationModel.create({ userId: id });
  return user;
};

/**
 *
 * @param user {string} User id
 * @param role {RoleModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
const assignRole = async (user, role) => {
  let userInstance = await getByUserId(user);
  userInstance = await userInstance.assignRole(role);
  return userInstance;
};

/**
 *
 * @param user {string} User id
 * @param role {RoleModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
const removeRole = async (user, role) => {
  const userInstance = await getByUserId(user);
  return userInstance.removeRole(role);
};

/**
 *
 * @param user {string} User id
 * @param permission {PermissionModel|string}
 * @return {Promise<Promise|void|*|null|unknown>}
 */
const assignPermission = async (user, permission) => {
  const userInstance = await getByUserId(user);
  return userInstance.assignPermission(permission);
};

/**
 *
 * @param user {string} User id
 * @param permission {PermissionModel|string}
 * @return {Promise<Promise|void|*|null>}
 */
const removePermission = async (user, permission) => {
  const userInstance = await getByUserId(user);
  return userInstance.removePermission(permission);
};

module.exports = {
  getByUserId,
  assignRole,
  removeRole,
  assignPermission,
  removePermission,
};
