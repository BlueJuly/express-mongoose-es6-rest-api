const Org = require('./org.model');

/**
 * Load org and append to req.
 */
function load(req, res, next, id) {
  Org.get(id)
    .then((org) => {
      req.org = org; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get org
 * @returns {Org}
 */
function get(req, res) {
  return res.json(req.org);
}

/**
 * Create new org
 * @property {string} req.body.orgName - The orgName of org.
 * @property {string} req.body.mobileNumber - The mobileNumber of org.
 * @returns {Org}
 */
function create(req, res, next) {
  const org = new Org({
    orgName: req.body.orgName
  });

  org.save()
    .then(savedOrg => res.json(savedOrg))
    .catch(e => next(e));
}

/**
 * Update existing org
 * @property {string} req.body.orgName - The orgName of org.
 * @property {string} req.body.mobileNumber - The mobileNumber of org.
 * @returns {Org}
 */
function update(req, res, next) {
  const org = req.org;
  org.orgName = req.body.orgName;
  org.mobileNumber = req.body.mobileNumber;

  org.save()
    .then(savedOrg => res.json(savedOrg))
    .catch(e => next(e));
}

/**
 * Get org list.
 * @property {number} req.query.skip - Number of orgs to be skipped.
 * @property {number} req.query.limit - Limit number of orgs to be returned.
 * @returns {Org[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Org.list({ limit, skip })
    .then(orgs => res.json(orgs))
    .catch(e => next(e));
}

/**
 * Delete org.
 * @returns {Org}
 */
function remove(req, res, next) {
  const org = req.org;
  org.remove()
    .then(deletedOrg => res.json(deletedOrg))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
