const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../user/user.model');
// sample user, used for authentication
// const user = {
//   username: 'react',
//   password: 'express'
// };

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  try {
    let user = await User.findOne({ username: req.body.username }).exec();
    if (user) {
      const isMatch = user.comparePassword(req.body.password);
      if (isMatch) {
        const token = await jwt.sign({
          username: user.username,
          id: user._id,
        }, config.jwtSecret);
        user = user.toJSON();
        user.token = token;
        return res.json(user);
      }
      return res.status(500).json({ error: 'Authentication error' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  } catch (error) {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber };
