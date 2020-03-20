const OrgModel = require('./org.model');
const blobService = require('../../blob.service');
/**
 * Load org and append to req.
 */
function load(req, res, next, id) {
  OrgModel.get(id)
    .then((org) => {
      req.org = org; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get org
 * @returns {Org}
 */
async function get(req, res, next) {
  try {
    if (req.params.orgId) {
      const org = await OrgModel.findOne({ _id: req.params.orgId });
      return res.json(org);
    }
    if (req.body.orgName) {
      const org = OrgModel.findOne({ username: req.body.orgName });
      return res.json(org);
    }
    return res.json({message: 'no org id in request'});
  } catch (error) {
    return next(error);
  }
}

/**
 * Create new org
 * @property {string} req.body.orgName - The orgName of org.
 * @property {string} req.body.mobileNumber - The mobileNumber of org.
 * @returns {Org}
 */
async function create(req, res, next) {
  const org = new OrgModel({
    orgName: req.body.orgName
  });
  if (req.file) {
    org.profileImage = req.file;
    const saveBlobResponse = await blobService.saveBlob(req.file.filename, req.file.path, 'images');
  }
  org.save()
    .then((savedOrg) => res.json(savedOrg))
    .catch((e) => next(e));
}

/**
 * Update existing org
 * @property {string} req.body.orgName - The orgName of org.
 * @property {string} req.body.mobileNumber - The mobileNumber of org.
 * @returns {Org}
 */
async function update(req, res, next) {
  // console.log(req.body.orgName);
  try {
    const org = await OrgModel.findOne({ orgName: req.body.orgName });
    if (org) {
      if (req.file) {
        // eslint-disable-next-line no-unused-vars
        const saveBlobResponse = await blobService.saveBlob(req.file.filename, req.file.path, 'images');
        // const updatedUser = Object.assign(user, req.body);
        org.profileImage = req.file;
        await org.save();
        // eslint-disable-next-line no-unused-vars
        const updatedOrg = await OrgModel.findOneAndUpdate(
          { orgName: req.body.orgName },
          req.body, { new: true }
        );
        return res.json(updatedOrg);
      }
      const updatedOrg = await OrgModel.findOneAndUpdate(
        { orgName: req.body.orgName },
        req.body, { new: true }
      );
      return res.json(updatedOrg);
    }
    return res.json({ message: 'no such org' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get org list.
 * @property {number} req.query.skip - Number of orgs to be skipped.
 * @property {number} req.query.limit - Limit number of orgs to be returned.
 * @returns {Org[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  OrgModel.list({ limit, skip })
    .then((orgs) => res.json(orgs))
    .catch((e) => next(e));
}

/**
 * Delete org.
 * @returns {Org}
 */
async function remove(req, res, next) {
  try {
    const org = await OrgModel.findOne({ orgName: req.body.orgName });
    const deleteRes = await org.deleteOne();
    res.json(deleteRes);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  load, get, create, update, list, remove
};
