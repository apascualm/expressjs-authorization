const permissions = [
  { name: 'create', module: 'generic' },
  { name: 'read', module: 'generic' },
  { name: 'update', module: 'generic' },
  { name: 'delete', module: 'generic' },
  { name: 'manage', module: 'generic' },
  { name: 'own', module: 'generic' },
  { name: 'create', module: 'authorization' },
  { name: 'read', module: 'authorization' },
  { name: 'update', module: 'authorization' },
  { name: 'delete', module: 'authorization' },
  { name: 'manage', module: 'authorization' },
  { name: 'own', module: 'authorization' },
];

module.exports = {
  permissions,
};
