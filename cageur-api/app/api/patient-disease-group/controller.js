const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createPatientDiseaseGroup(req, res, next) {
    const patientDiseaseGroup = {
      patientID: req.body['patient_id'],
      diseaseGroupID: req.body['disease_group_id'],
    };

    if (!patientDiseaseGroup.patientID || !patientDiseaseGroup.diseaseGroupID) {
      throw abort(400, 'Missing required parameters "patient_id" or "disease_group_id"');
    }

    db.any(`
      INSERT INTO patient_disease_group(patient_id, disease_group_id)
      VALUES($(patientID), $(diseaseGroupID))
      RETURNING id, patient_id, disease_group_id`,
      patientDiseaseGroup
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Patient disease group data succesfully added to db',
      });
    })
    .catch(err => next(err));
  },

  getAllPatientDiseaseGroup(req, res, next) {
    const sqlGetAllData = `
      SELECT p.id AS patient_id, p.first_name, p.last_name, p.phone_number, p.line_user_id, disease_group_id, dg.name AS disease_group_name, clinic_id, c.name AS clinic_name, pdg.id AS patient_disease_group_id
      FROM patient AS p
      LEFT JOIN patient_disease_group AS pdg
        ON p.id = pdg.patient_id
      LEFT JOIN disease_group AS dg
        ON dg.id = pdg.disease_group_id
      JOIN clinic AS c
        ON p.clinic_id = c.id
      ORDER BY p.id`;

    db.any(sqlGetAllData)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No patient data yet', 'Empty patient table');
      }
      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all patient data with disease group',
      });
    })
    .catch(err => next(err));
  },

  getSinglePatientDiseaseGroup(req, res, next) {
    const patientDiseaseGroupID = req.params.id;

    const sqlGetOneData = `
      SELECT p.id AS patient_id, p.first_name, p.last_name, p.phone_number, p.line_user_id, disease_group_id, dg.name AS disease_group_name, clinic_id, c.name AS clinic_name, pdg.id AS patient_disease_group_id
      FROM patient AS p
      LEFT JOIN patient_disease_group AS pdg
        ON p.id = pdg.patient_id
      LEFT JOIN disease_group AS dg
        ON dg.id = pdg.disease_group_id
      JOIN clinic AS c
        ON p.clinic_id = c.id
      WHERE pdg.id = ${patientDiseaseGroupID}
      ORDER BY p.id`;

    db.any(sqlGetOneData)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No patient data found', `Patient disease group ${patientDiseaseGroupID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one patient data with disease group',
      });
    })
    .catch(err => next(err));
  },

  getSinglePatientDiseaseGroupWithPatientID(req, res, next) {
    const patientID = req.params.id;

    const sqlGetOneData = `
      SELECT p.id AS patient_id, p.first_name, p.last_name, p.phone_number, p.line_user_id, disease_group_id, dg.name AS disease_group_name, clinic_id, c.name AS clinic_name, pdg.id AS patient_disease_group_id
      FROM patient AS p
      LEFT JOIN patient_disease_group AS pdg
        ON p.id = pdg.patient_id
      LEFT JOIN disease_group AS dg
        ON dg.id = pdg.disease_group_id
      JOIN clinic AS c
        ON p.clinic_id = c.id
      WHERE p.id = ${patientID}
      ORDER BY p.id`;

    db.any(sqlGetOneData)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No patient data found', `Patient ${patientID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one patient data with disease group',
      });
    })
    .catch(err => next(err));
  },

  updatePatientDiseaseGroup(req, res, next) {
    const patientDiseaseGroup = {
      id: req.params.id,
      patientID: req.body['patient_id'],
      diseaseGroupID: req.body['disease_group_id'],
    };

    if (!patientDiseaseGroup.patientID || !patientDiseaseGroup.diseaseGroupID) {
      throw abort(400, 'Missing required parameters "patient_id" or "disease_group_id"');
    }

    db.one(`
      UPDATE patient_disease_group
      SET patient_id=$(patientID), disease_group_id=$(diseaseGroupID)
      WHERE id = $(id)
      RETURNING id, patient_id, disease_group_id`,
      patientDiseaseGroup
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'Patient data has been updated',
      });
    })
    .catch(err => next(err));
  },

  removePatientDiseaseGroup(req, res, next) {
    const patientDiseaseGroupID = req.params.id;

    db.result(`DELETE FROM patient_disease_group WHERE id = ${patientDiseaseGroupID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'Patient disease group not exist or already removed', `${patientDiseaseGroupID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Patient disease group has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
