const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const crypto = require('crypto');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${crypto.randomBytes(18).toString('hex')}-${file.originalname}`);
  }
});
const router = express.Router(); // eslint-disable-line new-cap
const Upload = multer({ storage });

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)
  .put(Upload.single('userProfileImage'), userCtrl.update)
  /** POST /api/users - Create new user */
  .post(Upload.single('userProfileImage'), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), Upload.single('userProfileImage'), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/:userId/tiles')
  /** GET /api/users/:userId/tiles - Get a user tiles */
  .get(userCtrl.getUserTiles)

/** PUT /api/users/:userId - Update user */
// .put(userCtrl.updateTiles)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.deleteUserTiles);

router.route('/:userId/tiles/:tileId')

  .get(userCtrl.getUserTileById)

  .post(userCtrl.addUserTileById)

  .delete(userCtrl.deleteUserTileById);
router.route('/:userId/contacts')
  /** GET /api/users/:userId/tiles - Get a user tiles */
  .get(userCtrl.getUserContacts)
/** PUT /api/users/:userId - Update user */
// .put(userCtrl.updateTiles)
  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.deleteUserContacts);

router.route('/:userId/contacts/:contactId')
  .get(userCtrl.getUserContactById)
  .post(userCtrl.addUserContactById)
  .delete(userCtrl.deleteUserContactById);

router.route('/:userId/careteamMembers')
  /** GET /api/users/:userId/tiles - Get a user tiles */
  .get(userCtrl.getUserCareteamMembers)
/** PUT /api/users/:userId - Update user */
// .put(userCtrl.updateTiles)
  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.deleteUserCareteamMembers);

router.route('/:userId/careteamMembers/:careteamMemberId')
  .get(userCtrl.getUserCareteamMemberById)
  .post(userCtrl.addUserCareteamMemberById)
  .delete(userCtrl.deleteUserCareteamMemberById);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
