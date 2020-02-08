const roles = [{ name: 'admin', modulesToAdd: ['authorization', 'generic'] }, { name: 'guest' }, { name: 'user', modulesToAdd: ['generic'] }];

module.exports = {
  roles,
};
