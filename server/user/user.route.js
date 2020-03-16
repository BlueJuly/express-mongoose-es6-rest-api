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
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
