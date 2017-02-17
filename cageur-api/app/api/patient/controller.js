const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createPatient(req, res, next) {
    const patient = {
      clinicID: req.body['clinic_id'],
      phoneNumber: req.body['phone_number'],
      firstName: req.body['first_name'],
      lastName: req.body['last_name'],
      lineUserID: req.body['line_user_id'],
    };

    if (!patient.clinicID || !patient.firstName || !patient.phoneNumber) {
      throw abort(400, 'Missing required parameters "clinic_id" or "phone_number" or "first_name"');
    }

    db.any(`
      INSERT INTO patient(clinic_id, phone_number, first_name, last_name, line_user_id)
      VALUES($(clinicID), $(phoneNumber), $(firstName), $(lastName), $(lineUserID))
      RETURNING id, clinic_id, phone_number, first_name, last_name, line_user_id, created_at, updated_at`,
      patient
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Patient data succesfully added to db',
      });
    })
    .catch(err => next(err));
  },

  getAllPatient(req, res, next) {
    db.any('SELECT * FROM patient')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No patient data yet', 'Empty patient table');
      }
      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all patient data',
      });
    })
    .catch(err => next(err));
  },

  getAllPatientByClinicID(req, res, next) {
    const clinicID = req.params['clinic_id'];

    db.any(`SELECT * FROM patient WHERE clinic_id = ${clinicID}`)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No patient data yet', 'Empty patient table');
      }
      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all patient data',
      });
    })
    .catch(err => next(err));
  },

  getSinglePatient(req, res, next) {
    const patientID = req.params.id;

    db.any(`
      SELECT *
      FROM patient
      WHERE id = ${patientID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No patient data found', `Patient ${patientID} not found`);
      }
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one patient',
      });
    })
    .catch(err => next(err));
  },

  updatePatient(req, res, next) {
    const patient = {
      id: req.params.id,
      clinicID: req.body['clinic_id'],
      phoneNumber: req.body['phone_number'],
      firstName: req.body['first_name'],
      lastName: req.body['last_name'],
      lineUserID: req.body['line_user_id'],
    };

    if (!patient.clinicID || !patient.firstName || !patient.phoneNumber || !patient.lineUserID) {
      throw abort(400, 'Missing required parameters "clinic_id" or "phone_number" or "first_name"');
    }

    db.one(`
      UPDATE patient
      SET clinic_id=$(clinicID), phone_number=$(phoneNumber), first_name=$(firstName), last_name=$(lastName), line_user_id=$(lineUserID)
      WHERE id = $(id)
      RETURNING id, clinic_id, phone_number, first_name, last_name, line_user_id, created_at, updated_at`,
      patient
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

  removePatient(req, res, next) {
    const patientID = req.params.id;

    db.result(`DELETE FROM patient WHERE id = ${patientID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'Patient not exist or already removed', `${patientID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Patient has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
