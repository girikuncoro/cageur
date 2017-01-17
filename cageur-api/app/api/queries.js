const db = require('../config/db');

function getAllPatientDiseaseGroup(req, res, next) {
  db.any('select * from patient_disease_group')
    .then(function (data) {
      // console.log(res)
      if(data.length === 0) {
        res.status(404)
        .json({
          status: 'failed',
          data: data,
          message: 'There is no patient_disease_group data'
        });
      }
      else {
        res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all patient_disease_group data'
        });
      }

    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePatientDiseaseGroup(req, res, next) {
  let patient_disease_group_id = parseInt(req.params.id);
  db.one('select * from patient_disease_group where id = $1', patient_disease_group_id)
    .then(function (data) {
      console.log(res)
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one patient disease group'
        });
    })
    .catch(function (err) {
      // return next(err);
       res.status(404)
        .json({
          status: 'error',
          message: 'failed to Retrieved one patient disease group'
      });
    });
}

function createPatientDiseaseGroup(req, res, next) {
    if(!req.body.patient_id){
      return res.send(400, 'Error. Need a Patient ID Field');
    } else if(!req.body.disease_group_id){
      return res.send(400, 'Error. Need a Disease Group ID Field');
    } else {
      let data = {
          patient_id : req.body.patient_id,
          disease_group_id : req.body.disease_group_id
      };

      db.none("insert into patient_disease_group (patient_id, disease_group_id) values(${patient_id}, ${disease_group_id})", data)
      .then(function (xyz) {
          res.status(200)
          .json({
            status: 'success',
            message: 'patient_disease_group data succesfully added to db'
          });
      })
      .catch(function (error) {
          return next(error);
      });
    }
}

function updatePatientDiseaseGroup(req, res, next) {
  if(!req.body.password){
        return res.send(400, 'Error. Need a Clinic Name Field');
  } else if(!req.body.password){
        return res.send(400, 'Error. Need a Clinic Name Field');
  } else {
      let data = {
            id : req.params.id,
            patient_id : req.body.patient_id,
            disease_group_id : req.body.disease_group_id
      };

     db.none("update patient_disease_group set patient_id=${patient_id}, disease_group_id=${disease_group_id} where id = ${id}", data)
     .then(function () {
        res.status(200)
        .json({
            status: 'success',
            message: 'patient_disease_group data succesfully updated to db'
        });
      })
      .catch(function (error) {
        return next(error);
      });
  }
}

function removePatientDiseaseGroup(req, res, next) {
  if(!req.params.id){
    return res.send(400, 'Error. Need a ID');
  } else {
    let patient_disease_group_id = parseInt(req.params.id);
    db.result('delete from patient_disease_group where id = $1', patient_disease_group_id)
      .then(function (result) {
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} patient_disease_group`
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
}

// export all modules
module.exports = {
   getAllPatientDiseaseGroup,
   getSinglePatientDiseaseGroup,
   createPatientDiseaseGroup,
   updatePatientDiseaseGroup,
   removePatientDiseaseGroup,
};
