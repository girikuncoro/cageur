const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createDiseaseGroup(req, res, next) {
    const diseaseGroup = {
      name: req.body.name,
    };

    if (!diseaseGroup.name) {
      throw abort(400, 'Missing required parameters "name"');
    }

    db.any(`
      INSERT INTO disease_group(name)
      VALUES('${diseaseGroup.name}')
      RETURNING id, name, created_at, updated_at
    `)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Disease group data succesfully added to db',
      });
    })
    .catch(err => next(err));
  },

  getAllDiseaseGroup(req, res, next) {
    db.any('SELECT * FROM disease_group')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No disease group data yet', 'Empty disease_group table');
      }
      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all disease group data',
      });
    })
    .catch(err => next(err));
  },

  getSingleDiseaseGroup(req, res, next) {
    const diseaseGroupID = req.params.id;

    db.any(`
      SELECT *
      FROM disease_group
      WHERE id = ${diseaseGroupID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No disease group data found', `Disease group ${diseaseGroupID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one disease group',
      });
    })
    .catch(err => next(err));
  },

  updateDiseaseGroup(req, res, next) {
    const diseaseGroup = {
      id: req.params.id,
      name: req.body.name,
    };

    if (!diseaseGroup.name) {
      throw abort(400, 'Missing required parameters "name"');
    }

    db.one(`
      UPDATE disease_group
      SET name=$(name)
      WHERE id = $(id)
      RETURNING id, name, created_at, updated_at`,
      diseaseGroup
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'Disease group has been updated',
      });
    })
    .catch(err => next(err));
  },

  removeDiseaseGroup(req, res, next) {
    const diseaseGroupID = req.params.id;

    db.result(`DELETE FROM disease_group WHERE id = ${diseaseGroupID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'Disease group not exist or already removed', `${diseaseGroupID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Disease group has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
