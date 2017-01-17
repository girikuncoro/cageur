const db = require('../config/db');

function getAllPatient(req, res, next) {
  db.any('select * from patient')
    .then(function (data) {
      // console.log(res)
      if(data.length === 0) {
        res.status(404)
        .json({
          status: 'failed',
          data: data,
          message: 'There is no patient data'
        });
      }
      else {
        res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all patient data'
        });
      }

    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePatient(req, res, next) {
  let patientID = parseInt(req.params.id);
  db.one('select * from patient where id = $1', patientID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one patient'
        });
    })
    .catch(function (err) {
      // return next(err);
      res.status(404)
        .json({
          status: 'error',
          message: 'failed to Retrieved one clinic'
      });
    });
}

function createPatient(req, res, next) {
    if(!req.body.id_clinic){
      return res.send(400, 'Error. Need a ID Clinic');
    } else if(!req.body.phone_number){
      return res.send(400, 'Error. Need a Phone Number');
    } else if(!req.body.first_name){
      return res.send(400, 'Error. Need a First Name');
    } else {
      let data = {
            id_category : req.body.id_category,
            id_clinic : req.body.id_clinic,
            phone_number : req.body.phone_number,
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            lineid : req.body.lineid
      };

      db.none("insert into patient (clinic_id, phone_number, first_name, last_name, line_user_id) values(${id_clinic}, ${phone_number}, ${first_name}, ${last_name}, ${lineid})", data)
      .then(function () {
          // success;
          res.status(200)
          .json({
            status: 'success',
            message: 'patient data succesfully added to db'
          });
      })
      .catch(function (error) {
        return next(error);
      });

    }
}

function updatePatient(req, res, next) {
    if(!req.body.id_clinic){
      return res.send(400, 'Error. Need a ID Clinic');
    } else if(!req.body.phone_number){
      return res.send(400, 'Error. Need a Phone Number');
    } else if(!req.body.first_name){
      return res.send(400, 'Error. Need a First Name');
    } else {
      let data = {
            id : req.params.id,
            id_category : req.body.id_category,
            id_clinic : req.body.id_clinic,
            phone_number : req.body.phone_number,
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            lineid : req.body.lineid
      };

      db.none("update patient set clinic_id=${id_clinic}, phone_number=${phone_number}, first_name=${first_name} , last_name=${last_name}, line_user_id=${lineid} where id = ${id}", data)
      .then(function () {
          res.status(200)
          .json({
            status: 'success',
            message: 'patient data succesfully updated to db'
          });
      })
      .catch(function (error) {
          return next(error);
      });
    }
}

function removePatient(req, res, next) {
    let patientID = parseInt(req.params.id);
    db.result('delete from patient where id = $1', patientID)
      .then(function (result) {
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} patient`
          });
      })
      .catch(function (err) {
        return next(err);
      });
}

// export all modules
module.exports = {
  getAllPatient,
  getSinglePatient,
  createPatient,
  updatePatient,
  removePatient,
};
