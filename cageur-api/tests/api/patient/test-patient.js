/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Patient API Test', () => {
  let currClinicID;
  let currPatientID;

  const sqlInsertClinic = `
    INSERT INTO clinic(name, address, phone_number)
    VALUES('klinik lebak bulus', 'jakarta', '031')
    RETURNING id`;

  const sqlInsertPatient = (data) => {
    return `
      INSERT INTO patient(clinic_id, first_name, line_user_id, phone_number)
      VALUES('${data.clinicID}', '${data.firstName}', '${data.lineUserID}', '${data.phoneNumber}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertClinic)
    .then((data) => {
      currClinicID = data.id;
      return db.any(sqlInsertPatient({
        clinicID: currClinicID,
        firstName: 'Ujang',
        lineUserID: 'ujang123',
        phoneNumber: '666',
      }));
    })
    .then(_ => db.any(sqlInsertPatient({
      clinicID: currClinicID,
      firstName: 'Budi',
      lineUserID: 'budi123',
      phoneNumber: '777',
    })))
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => db.none('DELETE FROM patient'))
    .then(_ => done());
  });

  describe('POST /api/v1/patient', () => {
    // test case should be independent on others
    let cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM patient WHERE id=${cleanedID}`)
      .then(_ => done());
    });

    it('should insert patient', (done) => {
      const validRequest = {
        clinic_id: currClinicID,
        first_name: 'Ucok',
        phone_number: '0812',
        line_user_id: 'ucok321',
      };

      chai.request(app)
      .post('/api/v1/patient')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data['clinic_id']).to.equal(currClinicID);
        expect(r.data['first_name']).to.equal('Ucok');
        expect(r.data['last_name']).to.equal(null);
        expect(r.data['phone_number']).to.equal('0812');
        expect(r.data['line_user_id']).to.equal('ucok321');

        cleanedID = r.data.id;

        countRow('patient').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { clinic_id: currClinicID },
        { first_name: 'Ucok' },
        { phone_number: '0812' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/patient')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "clinic_id" or "phone_number" or "first_name"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/patient', () => {
    it('should retrieve all patient', (done) => {
      chai.request(app)
      .get('/api/v1/patient')
      .then((res) => {
        const r = res.body;
        const validPatients = [
          { clinicID: currClinicID, firstName: 'Ujang', lineUserID: 'ujang123', phoneNumber: '666' },
          { clinicID: currClinicID, firstName: 'Budi', lineUserID: 'budi123', phoneNumber: '777' },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all patient data');

        r.data.forEach((data, i) => {
          expect(data['clinic_id']).to.equal(validPatients[i].clinicID);
          expect(data['first_name']).to.equal(validPatients[i].firstName);
          expect(data['last_name']).to.equal(null);
          expect(data['phone_number']).to.equal(validPatients[i].phoneNumber);
          expect(data['line_user_id']).to.equal(validPatients[i].lineUserID);

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 when table is empty', (done) => {
      // empty table first
      db.none('DELETE FROM patient')
      .then((_) => {
        return chai.request(app)
        .get('/api/v1/patient')
        .then((__) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(404);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('No patient data yet');
        });
      })
      .then(_ => db.one(sqlInsertPatient({
        clinicID: currClinicID,
        firstName: 'Ujang',
        lineUserID: 'ujang123',
        phoneNumber: '666',
      })))
      .then((data) => {
        currPatientID = data.id;
        return db.one(sqlInsertPatient({
          clinicID: currClinicID,
          firstName: 'Budi',
          lineUserID: 'budi123',
          phoneNumber: '777',
        }));
      })
      .then(_ => done());
    });
  });

  describe('GET /api/v1/patient/:id', () => {
    it('should retrieve single patient', (done) => {
      chai.request(app)
      .get(`/api/v1/patient/${currPatientID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one patient');

        expect(r.data['clinic_id']).to.equal(currClinicID);
        expect(r.data['first_name']).to.equal('Ujang');
        expect(r.data['last_name']).to.equal(null);
        expect(r.data['phone_number']).to.equal('666');
        expect(r.data['line_user_id']).to.equal('ujang123');

        done();
      });
    });

    it('should return 404 for invalid patientID', (done) => {
      const invalidPatientID = currPatientID + 999;

      chai.request(app)
      .get(`/api/v1/patient/${invalidPatientID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No patient data found');

        done();
      });
    });
  });

  describe('PUT /api/v1/patient/:id', () => {
    it('should update patient data', (done) => {
      const updatePatient = {
        clinic_id: currClinicID,
        first_name: 'Adit',
        line_user_id: 'adit444',
        phone_number: '444',
      };

      chai.request(app)
      .put(`/api/v1/patient/${currPatientID}`)
      .send(updatePatient)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data['clinic_id']).to.equal(currClinicID);
        expect(r.data['first_name']).to.equal('Adit');
        expect(r.data['last_name']).to.equal(null);
        expect(r.data['line_user_id']).to.equal('adit444');
        expect(r.data['phone_number']).to.equal('444');

        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { clinic_id: currClinicID },
        { first_name: 'Ucok' },
        { phone_number: '0812' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .put(`/api/v1/patient/${currPatientID}`)
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "clinic_id" or "phone_number" or "first_name"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('DELETE /api/v1/patient/:id', () => {
    it('should remove patient data', (done) => {
      const patientID = currPatientID;

      chai.request(app)
      .delete(`/api/v1/patient/${patientID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Patient has been removed');

        done();
      });
    });

    it('should return 404 for invalid patientID', (done) => {
      const invalidPatientID = currPatientID + 999;

      chai.request(app)
      .delete(`/api/v1/patient/${invalidPatientID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Patient not exist or already removed');

        done();
      });
    });
  });
});
