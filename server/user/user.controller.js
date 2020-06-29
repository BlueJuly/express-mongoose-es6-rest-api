const User = require('./user.model');
const blobService = require('../../blob.service');
const OrgModel = require('../org/org.model');
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
async function get(req, res, next) {
  try {
    if (req.params.userId) {
      const user = await User.findOne({ _id: req.params.userId });
      const blobSASUrl = await blobService.getBlobSASUrl(user.profileImage.filename, 'images', 6000);
      user.profileImage.blobUrl = blobSASUrl;
      return res.json(user);
    }
    if (req.body.username) {
      const user = User.findOne({ username: req.body.username });
      return res.json(user);
    }
    return res.json({ message: 'no user id in request' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber
  });
  if (req.file) {
    user.profileImage = req.file;
    const saveBlobResponse = await blobService.saveBlob(req.file.filename, req.file.path, 'images');
  }
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
  // console.log(req.file);
  try {
    let searchCondition; let updatedUser;
    if (req.body.username) {
      searchCondition = { username: req.body.username };
    }
    if (req.params.userId) {
      searchCondition = { _id: req.params.userId };
    }
    if (req.file) {
      // eslint-disable-next-line no-unused-vars
      const saveBlobResponse = await blobService.saveBlob(req.file.filename, req.file.path, 'images');
      req.body.profileImage = req.file;
      // eslint-disable-next-line no-unused-vars
    }
    // eslint-disable-next-line no-unused-vars
    // const orgtemp = await User.findOne({ username: req.body.username }).populate('org').exec();
    if (req.body.orgName) {
      const org = await OrgModel.findOne({ orgName: req.body.orgName });
      req.body.org = org._id;
    }
    updatedUser = await User.findOneAndUpdate(
      searchCondition,
      req.body, { new: true }
    );
    // const temp = await user.save();
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
