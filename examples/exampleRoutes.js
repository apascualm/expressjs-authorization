const express = require('express');
const Authorize = require('expressjs-authorization');
const router = express.Router();

// This route contain your final response in each case.
const appRouteMiddleware = (req, res, next) => {
  // Example of how you can check inside you middleware.
  if (!Authorize.hasAnyRole(['admin', 'posts']).pass(req)) {
    return res.status(403).send('Not Authenticated');
    // other option.
    // return next(new Error('Not Authenticated'));
  };
  // Your code...
  res.send('something');
};

// This route may be a example of passport jwt or other
// authentication middleware that authenticates the user.
const authenticateMiddleware = (req, res, next) => {
  // You are authenticated..
  next();
};


// In this case you return all your posts without restriction, for example.
router.get('/posts', appRouteMiddleware);

// Roles
// In this other case you delete the post if you have authentication
// and if you are also authorized as admin role.
router.delete('/posts/:id', authenticateMiddleware, Authorize.hasAnyRole('admin').middleware(), appRouteMiddleware);

// Permissions
// In this other case you delete the post if you have authentication
// and if you are also authorized with delete permission inside to posts module.
router.delete('/posts/:id', authenticateMiddleware, Authorize.hasAnyPermission('delete', 'posts').middleware(), appRouteMiddleware);

// Concatenated permissions (same that one use the logical AND)
// In this other case you delete the post if you have authentication,
// if you are also authorized with delete permission inside to posts module
// and you have permission manage in administration module.
router.delete('/posts/:id', authenticateMiddleware, Authorize.hasAnyPermission('delete', 'posts').middleware(), Authorize.hasAnyPermission('manage', 'administration').middleware(), appRouteMiddleware);

// Optional permissions (same ones that use the logical OR)
// In this other case you delete the post if you have authentication,
// if you are also authorized with delete permission inside to posts module
// or you have permission manage in administration module.
router.delete('/posts/:id', authenticateMiddleware, Authorize.hasAnyPermission('delete', 'posts').orMiddleware(Authorize.hasAnyPermission('manage', 'administration')), appRouteMiddleware);


module.exports = router;
