const User = require('./user.model');
const blobService = require('../../blob.service');
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((err) => next(err));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber
  });

  user.save()
    .then((savedUser) => res.json(savedUser))
    .catch((err) => next(err));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function update(req, res, next) {
  // const user = req.body;
  // user.username = req.body.username;
  // user.mobileNumber = req.body.mobileNumber;
  console.log(req.file);

  console.log(req);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      if (req.file) {
        blobService.saveBlob(req.file.originalname, req.file.path, 'images');
      } else {
        return res.json({ message: 'Upload file error!' });
      }
    } else {
      return res.json({ message: 'no such user' });
    }
    const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, req.body, { new: true });

    console.log(updatedUser);
    return res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const { user } = req;
  user.remove()
    .then((deletedUser) => res.json(deletedUser))
    .catch((err) => next(err));
}

module.exports = {
  load, get, create, update, list, remove
};
