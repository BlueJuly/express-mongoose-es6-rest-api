const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const orgRoutes = require('./server/org/org.route');
const tileRoutes = require('./server/tile/tile.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount  auth routes at /orgs
router.use('/orgs', orgRoutes);

router.use('/tiles', tileRoutes);
module.exports = router;
