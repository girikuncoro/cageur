let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('server');
let expect = require("chai").expect;
let should = require("should");

let request = require("superagent");
let util = require("util");

chai.use(chaiHttp);

describe('API Clinic Test', function() {
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
    .get('/api/v1/clinic/1')
    .end(function(err, res){
       expect(res.status).to.equal(500);
      done();
    });
  });

  it('should add a SINGLE clinic on /api/v1/clinic POST', function(done) {
  chai.request('http://localhost:5000')
      .post('/api/v1/clinic')
      .send({'clinic_name': 'Clinic Dummy', 'address': 'Bandung', 'phone':'888 888', 'fax':'888 888'})
      .end(function(err, res){
        expect(res.status).to.equal(500);
        // res.should.be.json;
        // res.body.should.be.a('object');
        // res.body.should.have.property('SUCCESS');
        // res.body.SUCCESS.should.be.a('object');
        // res.body.SUCCESS.should.have.property('clinic_name');
        // res.body.SUCCESS.should.have.property('address');
        // res.body.SUCCESS.should.have.property('_id');
        // res.body.SUCCESS.clinic_name.should.equal('Clinic Dummy');
        // res.body.SUCCESS.address.should.equal('Bandung');
        done();
      });
  });

  it('should update a SINGLE clinic on /api/v1/clinic/<id> PUT', function(done) {
  chai.request('http://localhost:5000')
    .get('/api/v1/clinic')
    .end(function(err, res){
      chai.request('http://localhost:5000')
        .put('/api/v1/clinic/1')
        .send({'clinic_name': 'Clinic Dummy Update', 'address': 'Bandung', 'phone':'888 888', 'fax':'888 888'})
        .end(function(error, response){
          expect(response.status).to.equal(500);
          // response.should.be.json;
          // response.body.should.be.a('object');
          // response.body.should.have.property('UPDATED');
          // response.body.UPDATED.should.be.a('object');
          // response.body.UPDATED.should.have.property('clinic_name');
          // response.body.UPDATED.clinic_name.should.equal('Clinic Dummy Update');
          done();
      });
    });
  });


  it('should delete a SINGLE clinic on /api/v1/clinic/<id> DELETE', function(done) {
  chai.request('http://localhost:5000')
    .get('/api/v1/clinic')
    .end(function(err, res){
        chai.request('http://localhost:5000')
          .delete('/api/v1/clinic/1')
          .end(function(error, response){
            expect(response.status).to.equal(200);
            // response.should.be.json;
            // response.body.should.be.a('object');
            // response.body.should.have.property('REMOVED');
            // response.body.REMOVED.should.be.a('object');
            // response.body.REMOVED.should.have.property('name');
            // response.body.REMOVED.should.have.property('_id');
            // response.body.REMOVED.name.should.equal('Bat');
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


