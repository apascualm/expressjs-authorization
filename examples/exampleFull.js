// It is a small example of how you can implement this package.
// It is not a functional example because it needs more things for a
// complete server implementation.

const express = require('express');
const Authorize = require('expressjs-authorization');
const { Routes } = require('expressjs-authorization');
const blog = require('./exampleRoutes');

const app = express();
app.use(Authorize.initialize());

app.use('/administration', Routes(Authorize));

// Load your routes, inside are the examples of use.
app.use('/blog', blog);

app.listen(4000);
