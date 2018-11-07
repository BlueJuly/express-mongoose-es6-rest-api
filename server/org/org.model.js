const Promise = require('bluebird');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const httpStatus = require('http-status');

const APIError = require('../helpers/APIError');

const User = require('../user/user.model');

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
    match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  email: {
    type: String,
    required: false,
    match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid email address.']
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

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

  // add new user to org by user objectID and org name
  addUser(orgName, userObejctId) {
    return this.update(
      { orgName: orgName, users: { $ne: userObejctId } },
      {
        $push: {
          users: userObejctId
        }
      },
      { multi: false },
      function(err, numAffected){
        if (err) {
          console.log(err)
        }
      }
    );
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
