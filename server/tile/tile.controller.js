const TileModel = require('./tile.model');
const blobService = require('../../blob.service');
/**
 * Load tile and append to req.
 */
function load(req, res, next, id) {
  TileModel.get(id)
    .then((tile) => {
      req.tile = tile; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get tile
 * @returns {Tile}
 */
async function getTileById(tileId) {
  const tile = await TileModel.findOne({ _id: tileId });
  const blobSASUrl = await blobService.getBlobSASUrl(tile.profileImage.filename, 'images', 6000);
  tile.profileImage.blobUrl = blobSASUrl;
  if (tile.resource && Array.isArray(tile.resource)) {
    for (let index = 0; index < tile.resource.length; index++) {
      const resourceBlobSASUrl = await blobService.getBlobSASUrl(tile.resource[index].filename, tile.type, 6000);
      tile.resource[index].blobUrl = resourceBlobSASUrl;
    }
  }
  return tile;
}
async function get(req, res, next) {
  try {
    if (req.params.tileId) {
      const tile = await getTileById(req.params.tileId);
      return res.json(tile);
    }
    // if (req.body.tileName) {
    //   const tile = TileModel.findOne({ username: req.body.tileName });
    //   return res.json(tile);
    // }
    return res.json({ message: 'no tile id in request' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Create new tile
 * @property {string} req.body.tileName - The tileName of tile.
 * @property {string} req.body.mobileNumber - The mobileNumber of tile.
 * @returns {Tile}
 */
async function create(req, res, next) {
  const tile = new TileModel({
    tileName: req.body.tileName,
    type: req.body.type
  });
  if (req.files) {
    if (req.files.tileProfileImage && Array.isArray(req.files.tileProfileImage)) {
      req.files.tileProfileImage.forEach(async (profileImage) => {
        tile.profileImage = profileImage;
        const saveResponse = await blobService.saveBlob(profileImage.filename, profileImage.path, 'images');
      });
    }
    if (req.files.tileResource && Array.isArray(req.files.tileResource)) {
      req.files.tileResource.forEach(async (resource) => {
        tile.resource = [...tile.resource, resource];
        const saveResponse = await blobService.saveBlob(resource.filename, resource.path, tile.type);
      });
    }
  }
  if (req.body.description) {
    tile.description = req.body.description;
  }
  if (req.body.type === 'website') {
    tile.resource = req.body.tileResource;
  }
  tile.save()
    .then((savedTile) => res.json(savedTile))
    .catch((e) => next(e));
}

/**
 * Update existing tile
 * @property {string} req.body.tileName - The tileName of tile.
 * @property {string} req.body.mobileNumber - The mobileNumber of tile.
 * @returns {Tile}
 */
async function update(req, res, next) {
  // console.log(req.body.tileName);
  try {
    const tile = await TileModel.findOne({ tileName: req.body.tileName });
    if (tile) {
      if (req.file) {
        // eslint-disable-next-line no-unused-vars
        const saveBlobResponse = await blobService.saveBlob(req.file.filename, req.file.path, 'images');
        // const updatedUser = Object.assign(user, req.body);
        tile.profileImage = req.file;
        await tile.save();
        // eslint-disable-next-line no-unused-vars
        const updatedTile = await TileModel.findOneAndUpdate(
          { tileName: req.body.tileName },
          req.body, { new: true }
        );
        return res.json(updatedTile);
      }
      const updatedTile = await TileModel.findOneAndUpdate(
        { tileName: req.body.tileName },
        req.body, { new: true }
      );
      return res.json(updatedTile);
    }
    return res.json({ message: 'no such tile' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get tile list.
 * @property {number} req.query.skip - Number of tiles to be skipped.
 * @property {number} req.query.limit - Limit number of tiles to be returned.
 * @returns {Tile[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  TileModel.list({ limit, skip })
    .then((tiles) => res.json(tiles))
    .catch((e) => next(e));
}

/**
 * Delete tile.
 * @returns {Tile}
 */
async function remove(req, res, next) {
  try {
    const tile = await TileModel.findOne({ tileName: req.body.tileName });
    const deleteRes = await tile.deleteOne();
    res.json(deleteRes);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  load, get, create, update, list, remove, getTileById
};
