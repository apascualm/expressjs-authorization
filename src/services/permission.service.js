const { PermissionModel } = require('../models');

/**
 *
 * @param id {string}
 * @return {Query}
 */
const get = async (id) => PermissionModel.findById(id);

/**
 *
 * @return {Query|void|number|bigint|T|T}
 */
const getAll = async () => PermissionModel.find();

/**
 *
 * @param module {string}
 * @return {Promise<Query|void|number|bigint|any>}
 */
const getByModule = async (module) => PermissionModel.find({ module });

/**
 *
 * @param module {string}
 * @param name {string}
 * @return {*}
 */
const create = async (module, name) => PermissionModel.create({ name, module });

/**
 *
 * @param id {string}
 * @return {Query|Promise|*}
 */
const remove = async (id) => PermissionModel.deleteOne({ _id: id });

module.exports = {
  get,
  getAll,
  getByModule,
  create,
  remove,
};
