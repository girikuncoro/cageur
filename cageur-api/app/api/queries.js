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
          message: 'Retrieved ALL clinic data'
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
          message: 'Retrieved ONE clinic'
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
        fax : req.body.fax,
        dateNow : Date.now()
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

// export all modules
module.exports = {
  getAllClinic: getAllClinic,
  getSingleClinic: getSingleClinic,
  createClinic: createClinic,
  updateClinic: updateClinic,
  removeClinic: removeClinic
};