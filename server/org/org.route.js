const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const orgCtrl = require('./org.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/orgs - Get list of orgs */
  .get(orgCtrl.list)

  /** POST /api/orgs - Create new org */
  .post(validate(paramValidation.createOrg), orgCtrl.create);

router.route('/:orgId')
  /** GET /api/orgs/:orgId - Get org */
  .get(orgCtrl.get)

  /** PUT /api/orgs/:orgId - Update org */
  //.put(validate(paramValidation.updateOrg), orgCtrl.update)

  /** DELETE /api/orgs/:orgId - Delete org */
  .delete(orgCtrl.remove);

/** Load org when API with orgId route parameter is hit */
router.param('orgId', orgCtrl.load);

module.exports = router;
