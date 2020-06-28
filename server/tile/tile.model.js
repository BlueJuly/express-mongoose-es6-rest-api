const Promise = require('bluebird');

const mongoose = require('mongoose');

const { Schema } = mongoose;

const httpStatus = require('http-status');

const APIError = require('../helpers/APIError');

const UserModel = require('../user/user.model');

// const bcrypt = require('bcrypt');
/**
 * Organization Schema
 */
const TileSchema = new mongoose.Schema({
  tileName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    // match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  type: {
    type: String,
    required: false,
    // match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid email address.']
  },
  resource: {
    type: Array,
    required: false
  },
  profileImage: {
    type: Object,
    required: false
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  org: {
    type: Schema.Types.ObjectId,
    ref: 'Org'
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
// TileSchema.pre('deleteOne', { document: true, query: false }, async function preDelete(next) {
//   try {
//     const deletingOrg = this;
//     // eslint-disable-next-line no-unused-vars
//     const updateRes = await UserModel.updateMany({ tile: deletingOrg._id }, { tile: undefined });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
/**
 * Methods
 */
TileSchema.method({
});

/**
 * Statics
 */
TileSchema.statics = {
  /**
   * Get org
   * @param {ObjectId} id - The objectId of org.
   * @returns {Promise<Org, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((tile) => {
        if (tile) {
          return tile;
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
 * @typedef Tile
 */
module.exports = mongoose.model('Tile', TileSchema);
