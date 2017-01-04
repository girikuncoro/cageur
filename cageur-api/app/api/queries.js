// module requirement
const promise = require('bluebird');
const options = { promiseLib: promise };
const pgp = require('pg-promise')(options);

// define configuration file
let cn = {
    host: 'localhost',
    port: 5432,
    database: 'cageur_db',
    user: 'cageur_user',
    password: '123456'
};

// initiate db
let db = pgp(cn);

// routes start here
function getAllClinic(req, res, next) {
  db.any('select * from clinic')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all clinic data'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleClinic(req, res, next) {
  let clinicID = parseInt(req.params.id);
  db.one('select * from clinic where id = $1', clinicID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one clinic'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createClinic(req, res, next) {
    let data = {
        name : req.body.clinic_name,
        address : req.body.address,
        phone : req.body.phone,
        fax : req.body.fax
    };

    db.none("insert into clinic (name, address, phone, fax) values(${name}, ${address}, ${phone}, ${fax})", data)
    .then(function () {
        // success;
        res.status(200)
        .json({
          status: 'success',
          message: 'clinic data succesfully added to db'
        });
    })
    .catch(function (error) {
        return next(error);
    });

}

function updateClinic(req, res, next) {

  let data = {
        id : req.params.id,
        name : req.body.clinic_name,
        address : req.body.address,
        phone : req.body.phone,
        fax : req.body.fax
  };

  db.none("update clinic set name=${name}, address=${address}, phone=${phone}, fax=${fax} where id = ${id}", data)
      .then(function () {
          res.status(200)
          .json({
            status: 'success',
            message: 'clinic data succesfully updated to db'
          });
      })
      .catch(function (error) {
          return next(error);
      });

}

function removeClinic(req, res, next) {
  var clinicID = parseInt(req.params.id);
  db.result('delete from clinic where id = $1', clinicID)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} clinic`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllPatient(req, res, next) {
  db.any('select * from patient')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all patient data'
        });
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
      return next(err);
    });
}

function createPatient(req, res, next) {
    let data = {
        id_category : req.body.id_category,
        id_clinic : req.body.id_clinic,
        phone_number : req.body.phone_number,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        lineid : req.body.lineid
    };

    db.none("insert into patient (id_category, id_clinic, phone_number, first_name, last_name, lineid) values(${id_category}, ${id_clinic}, ${phone_number}, ${first_name}, ${last_name}, ${lineid})", data)
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


function updatePatient(req, res, next) {

  let data = {
        id : req.params.id,
        id_category : req.body.id_category,
        id_clinic : req.body.id_clinic,
        phone_number : req.body.phone_number,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        lineid : req.body.lineid
  };

  db.none("update patient set id_category=${id_category}, id_clinic=${id_clinic}, phone_number=${phone_number}, first_name=${first_name} , last_name=${last_name}, lineid=${lineid} where id = ${id}", data)

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

function removePatient(req, res, next) {
  var patientID = parseInt(req.params.id);
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
  getAllClinic: getAllClinic,
  getSingleClinic: getSingleClinic,
  createClinic: createClinic,
  updateClinic: updateClinic,
  removeClinic: removeClinic,

  getAllPatient: getAllPatient,
  getSinglePatient: getSinglePatient,
  createPatient: createPatient,
  updatePatient: updatePatient,
  removePatient: removePatient
};