const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const crypto = require('crypto');
const paramValidation = require('../../config/param-validation');
const tileCtrl = require('./tile.controller');

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
  /** GET /api/tiles - Get list of tiles */
  .get(tileCtrl.list)
  /** POST /api/tiles - Create new tile */
  .post(Upload.fields([
    { name: 'tileProfileImage', maxCount: 1 },
    { name: 'tileResource', maxCount: 9 }
  ]), tileCtrl.create)
  .put(Upload.fields([
    { name: 'tileProfileImage', maxCount: 1 },
    { name: 'tileResource', maxCount: 9 }
  ]), tileCtrl.update)
  .delete(tileCtrl.remove);

router.route('/:tileId')
  /** GET /api/tiles/:tileId - Get tile */
  .get(tileCtrl.get)

/** PUT /api/tiles/:tileId - Update tile */
// .put(validate(paramValidation.updateTile), tileCtrl.update)

  /** DELETE /api/tiles/:tileId - Delete tile */
  .delete(tileCtrl.remove);

/** Load tile when API with tileId route parameter is hit */
router.param('tileId', tileCtrl.load);

module.exports = router;
