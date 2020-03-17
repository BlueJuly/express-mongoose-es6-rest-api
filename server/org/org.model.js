const Promise = require('bluebird');

const mongoose = require('mongoose');

// const {Schema} = mongoose;

const httpStatus = require('http-status');

const APIError = require('../helpers/APIError');

const UserModel = require('../user/user.model');

// const bcrypt = require('bcrypt');
/**
 * Organization Schema
 */
const OrgSchema = new mongoose.Schema({
  orgName: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: false,
    // match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  email: {
    type: String,
    required: false,
    // match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid email address.']
  },
  profileImage: {
    type: Object,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hook
 * - validations
 * - virtuals
 */
OrgSchema.pre('deleteOne', { document: true, query: false }, async function preDelete(next) {
  try {
    const deletingOrg = this;
    // eslint-disable-next-line no-unused-vars
    const updateRes = await UserModel.updateMany({ org: deletingOrg._id }, { org: undefined });
    next();
  } catch (error) {
    next(error);
  }
});
/**
 * Methods
 */
OrgSchema.method({
});

/**
 * Statics
 */
OrgSchema.statics = {
  /**
   * Get org
   * @param {ObjectId} id - The objectId of org.
   * @returns {Promise<Org, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((org) => {
        if (org) {
          return org;
        }
        const err = new APIError('No such organization exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List orgs in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of orgs to be skipped.
   * @param {number} limit - Limit number of orgs to be returned.
   * @returns {Promise<Org[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Org
 */
module.exports = mongoose.model('Org', OrgSchema);
