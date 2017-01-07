let express = require('express');
let app = express();

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('server');
let expect = require("chai").expect;
let should = require("should");

let request = require("superagent");
let util = require("util");

let id_dummy = 6;
chai.use(chaiHttp);

describe('API Clinic Test', function() {

  it('should add a SINGLE clinic on /api/v1/clinic POST', function(done) {
  var data = {
    clinic_name: 'Clinic Dummy New',
    address: 'Bandung',
    phone: '8',
    fax: '9',
  };

  chai.request('http://localhost:5000')
    .post('/api/v1/clinic/')
    .send(data)
    .end(function(err, res){
        expect(res.status).to.equal(200);
        console.log(err)
        done();
    });
  });


  it('should update a SINGLE clinic on /api/v1/clinic/<id> PUT', function(done) {
  var data = {
    clinic_name: 'Clinic Dummy Update 2',
    address: 'Bandung Update',
    phone: '9',
    fax: '8',
  };

  chai.request('http://localhost:5000')
    .put('/api/v1/clinic/' + id_dummy)
    .send(data)
    .end(function(err, res){
        console.log(err)
        expect(res.status).to.equal(200);
        done();
    });
  });

  it('should list ALL clinic on /api/v1/clinic GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/api/v1/clinic')
    .end(function(err, res){
        expect(res.status).to.equal(200);
      done();
    });
  });

  it('should list a SINGLE clinic on /api/v1/clinic/<id> GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/api/v1/clinic/' + id_dummy)
    .end(function(err, res){
       expect(res.status).to.equal(200);
      done();
    });
  });

  it('should delete a SINGLE clinic on /api/v1/clinic/<id> DELETE', function(done) {
  chai.request('http://localhost:5000')
    .get('/api/v1/clinic')
    .end(function(err, res){
        chai.request('http://localhost:5000')
          .delete('/api/v1/clinic/' + id_dummy)
          .end(function(error, response){
            expect(response.status).to.equal(200);
            done();
        });
      });
  });


});

// describe('API Disease Group Test', function() {
//   it('should list ALL disease_group on /api/v1/disease_group GET');
//   it('should list a SINGLE disease_group on /api/v1/disease_group/<id> GET');
//   it('should add a SINGLE disease_group on /api/v1/disease_group POST');
//   it('should update a SINGLE disease_group on /api/v1/disease_group/<id> PUT');
//   it('should delete a SINGLE disease_group on /api/v1/disease_group/<id> DELETE');
// });


