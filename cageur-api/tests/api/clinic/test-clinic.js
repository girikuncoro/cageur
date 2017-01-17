/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Clinic API Test', () => {
  let currClinicID;

  const sqlInsertClinic = (data) => {
    return `
      INSERT INTO clinic(name, address, phone_number)
      VALUES('${data.name}', '${data.address}', '${data.phoneNumber}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertClinic({
      name: 'klinik persib',
      address: 'jalan abc',
      phoneNumber: '123',
    }))
    .then((data) => {
      currClinicID = data.id;
      return db.any(sqlInsertClinic({
        name: 'klinik nu aing',
        address: 'jalan siliwangi',
        phoneNumber: '456',
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => done());
  });

  describe('POST /api/v1/clinic', () => {
    // test case should be independent on others
    let cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM clinic WHERE id=${cleanedID}`)
      .then(_ => done());
    });

    it('should insert new clinic', (done) => {
      const validRequest = {
        name: 'klinik persija',
        address: 'jalan jakmania',
        phone_number: '333',
      };

      chai.request(app)
      .post('/api/v1/clinic')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data.name).to.equal('klinik persija');
        expect(r.data.address).to.equal('jalan jakmania');
        expect(r.data['phone_number']).to.equal('333');

        cleanedID = r.data.id;

        countRow('clinic').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { address: 'foo bar' },
        { phone_number: '999' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/clinic')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "name"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/clinic', () => {
    it('should retrieve all clinic', (done) => {
      chai.request(app)
      .get('/api/v1/clinic')
      .then((res) => {
        const r = res.body;
        const validClinic = [
          { name: 'klinik persib', address: 'jalan abc', phone_number: '123' },
          { name: 'klinik nu aing', address: 'jalan siliwangi', phone_number: '456' },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all clinic data');

        r.data.forEach((clinic, i) => {
          expect(clinic.name).to.equal(validClinic[i].name);
          expect(clinic.address).to.equal(validClinic[i].address);
          expect(clinic['phone_number']).to.equal(validClinic[i]['phone_number']);

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 when table is empty', (done) => {
      // empty table first
      db.none('DELETE FROM clinic')
      .then((_) => {
        return chai.request(app)
        .get('/api/v1/clinic')
        .then((__) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(404);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('No clinic data yet');
        });
      })
      .then(_ => db.one(sqlInsertClinic({
        name: 'klinik persib',
        address: 'jalan abc',
        phoneNumber: '123',
      })))
      .then((data) => {
        currClinicID = data.id;
        return db.any(sqlInsertClinic({
          name: 'klinik nu aing',
          address: 'jalan siliwangi',
          phoneNumber: '456',
        }));
      })
      .then(_ => done());
    });
  });

  describe('GET /api/v1/clinic/:id', () => {
    it('should retrieve single clinic', (done) => {
      chai.request(app)
      .get(`/api/v1/clinic/${currClinicID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one clinic');

        expect(r.data.name).to.equal('klinik persib');
        expect(r.data.address).to.equal('jalan abc');
        expect(r.data['phone_number']).to.equal('123');
        done();
      });
    });

    it('should return 404 for invalid clinicID', (done) => {
      const invalidClinicID = currClinicID + 999;

      chai.request(app)
      .get(`/api/v1/clinic/${invalidClinicID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No clinic data found');

        done();
      });
    });
  });

  describe('PUT /api/v1/clinic/:id', () => {
    it('should update clinic data', (done) => {
      const updateClinic = {
        name: 'new clinic',
        address: 'jalan baru',
        phone_number: '321',
      };

      chai.request(app)
      .put(`/api/v1/clinic/${currClinicID}`)
      .send(updateClinic)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data.name).to.equal('new clinic');
        expect(r.data.address).to.equal('jalan baru');
        expect(r.data['phone_number']).to.equal('321');
        expect(r.message).to.equal('Clinic data has been updated');

        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { address: 'foo bar' },
        { phone_number: '999' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .put(`/api/v1/clinic/${currClinicID}`)
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "name"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('DELETE /api/v1/clinic/:id', () => {
    it('should remove clinic data', (done) => {
      const clinicID = currClinicID;

      chai.request(app)
      .delete(`/api/v1/clinic/${clinicID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Clinic has been removed');

        done();
      });
    });

    it('should return 404 for invalid clinicID', (done) => {
      const invalidClinicID = currClinicID + 999;

      chai.request(app)
      .delete(`/api/v1/clinic/${invalidClinicID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Clinic not exist or already removed');

        done();
      });
    });
  });
});
