const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const crypto = require('crypto');
const paramValidation = require('../../config/param-validation');
const orgCtrl = require('./org.controller');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${crypto.randomBytes(18).toString('hex')}-${file.originalname}`);
  }
});

// eslint-disable-line new-cap
const Upload = multer({ storage });
const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/orgs - Get list of orgs */
  .get(orgCtrl.list)
  /** POST /api/orgs - Create new org */
  .post(validate(paramValidation.createOrg), orgCtrl.create)
  .put(Upload.single('orgProfileImage'), orgCtrl.update)
  .delete(orgCtrl.remove);

router.route('/:orgId')
  /** GET /api/orgs/:orgId - Get org */
  .get(orgCtrl.get)

/** PUT /api/orgs/:orgId - Update org */
// .put(validate(paramValidation.updateOrg), orgCtrl.update)

  /** DELETE /api/orgs/:orgId - Delete org */
  .delete(orgCtrl.remove);

/** Load org when API with orgId route parameter is hit */
router.param('orgId', orgCtrl.load);

module.exports = router;
