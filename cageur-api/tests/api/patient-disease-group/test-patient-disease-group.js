/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Patient Disease Group API Test', () => {
  let currClinicID;
  let currDiseaseGroupID;
  const currPatientIDs = [];
  let currPatientDiseaseGroupID;

  const sqlInsertClinic = `
    INSERT INTO clinic(name, address, phone_number)
    VALUES('klinik lebak bulus', 'jakarta', '031')
    RETURNING id`;

  const sqlInsertDiseaseGroup = `
    INSERT INTO disease_group(name)
    VALUES('ginjal')
    RETURNING id`;

  const sqlInsertPatient = (data) => {
    return `
      INSERT INTO patient(clinic_id, first_name, line_user_id, phone_number)
      VALUES('${data.clinicID}', '${data.firstName}', '${data.lineUserID}', '${data.phoneNumber}')
      RETURNING id`;
  };

  const sqlInsertPatientDiseaseGroup = (data) => {
    return `
      INSERT INTO patient_disease_group(patient_id, disease_group_id)
      VALUES('${data.patientID}', '${data.diseaseGroupID}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertClinic)
    .then((data) => {
      currClinicID = data.id;
      return db.one(sqlInsertDiseaseGroup);
    })
    .then((data) => {
      currDiseaseGroupID = data.id;
      return db.one(sqlInsertPatient({
        clinicID: currClinicID,
        firstName: 'Ujang',
        lineUserID: 'ujang123',
        phoneNumber: '666',
      }));
    })
    .then((data) => {
      currPatientIDs.push(data.id);
      return db.one(sqlInsertPatientDiseaseGroup({
        patientID: data.id,
        diseaseGroupID: currDiseaseGroupID,
      }));
    })
    .then((data) => {
      currPatientDiseaseGroupID = data.id;
      return db.one(sqlInsertPatient({
        clinicID: currClinicID,
        firstName: 'Budi',
        lineUserID: 'budi123',
        phoneNumber: '777',
      }));
    })
    .then((data) => { currPatientIDs.push(data.id); })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => db.none('DELETE FROM patient'))
    .then(_ => db.none('DELETE FROM disease_group'))
    .then(_ => db.none('DELETE FROM patient_disease_group'))
    .then(_ => done());
  });

  describe('POST /api/v1/patient', () => {
    // test case should be independent on others
    let cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM patient_disease_group WHERE id=${cleanedID}`)
      .then(_ => done());
    });

    it('should insert patient disease group', (done) => {
      const validRequest = {
        patient_id: currPatientIDs[0],
        disease_group_id: currDiseaseGroupID,
      };

      chai.request(app)
      .post('/api/v1/patient_disease_group')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data['patient_id']).to.equal(currPatientIDs[0]);
        expect(r.data['disease_group_id']).to.equal(currDiseaseGroupID);

        cleanedID = r.data.id;

        countRow('patient_disease_group').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(2);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { patient_id: currPatientIDs[0] },
        { disease_group_id: currDiseaseGroupID },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/patient_disease_group')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "patient_id" or "disease_group_id"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/patient_disease_group', () => {
    it('should retrieve all patient with disease group info', (done) => {
      chai.request(app)
      .get('/api/v1/patient_disease_group')
      .then((res) => {
        const r = res.body;
        const validPatients = [
          {
            patientID: currPatientIDs[0],
            firstName: 'Ujang',
            lineUserID: 'ujang123',
            phoneNumber: '666',
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'ginjal',
            clinicID: currClinicID,
            clinicName: 'klinik lebak bulus',
            patientDiseaseGroupID: currPatientDiseaseGroupID,
          },
          {
            patientID: currPatientIDs[1],
            firstName: 'Budi',
            lineUserID: 'budi123',
            phoneNumber: '777',
            diseaseGroupID: null,
            diseaseGroupName: null,
            clinicID: currClinicID,
            clinicName: 'klinik lebak bulus',
            patientDiseaseGroupID: null,
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all patient data with disease group');

        r.data.forEach((data, i) => {
          expect(data['patient_id']).to.equal(validPatients[i].patientID);
          expect(data['first_name']).to.equal(validPatients[i].firstName);
          expect(data['last_name']).to.equal(null);
          expect(data['phone_number']).to.equal(validPatients[i].phoneNumber);
          expect(data['line_user_id']).to.equal(validPatients[i].lineUserID);
          expect(data['disease_group_id']).to.equal(validPatients[i].diseaseGroupID);
          expect(data['disease_group_name']).to.equal(validPatients[i].diseaseGroupName);
          expect(data['clinic_id']).to.equal(validPatients[i].clinicID);
          expect(data['clinic_name']).to.equal(validPatients[i].clinicName);
          expect(data['patient_disease_group_id']).to.equal(validPatients[i].patientDiseaseGroupID);

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/patient_disease_group/:id', () => {
    it('should retrieve single patient', (done) => {
      chai.request(app)
      .get(`/api/v1/patient_disease_group/${currPatientDiseaseGroupID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one patient data with disease group');

        expect(r.data['patient_id']).to.equal(currPatientIDs[0]);
        expect(r.data['first_name']).to.equal('Ujang');
        expect(r.data['last_name']).to.equal(null);
        expect(r.data['phone_number']).to.equal('666');
        expect(r.data['line_user_id']).to.equal('ujang123');
        expect(r.data['clinic_id']).to.equal(currClinicID);
        expect(r.data['clinic_name']).to.equal('klinik lebak bulus');
        expect(r.data['disease_group_id']).to.equal(currDiseaseGroupID);
        expect(r.data['disease_group_name']).to.equal('ginjal');
        expect(r.data['patient_disease_group_id']).to.equal(currPatientDiseaseGroupID);

        done();
      });
    });

    it('should return 404 for invalid patientDiseaseGroupID', (done) => {
      const invalidPatientDiseaseGroupID = currPatientDiseaseGroupID + 999;

      chai.request(app)
      .get(`/api/v1/patient_disease_group/${invalidPatientDiseaseGroupID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No patient data found');

        done();
      });
    });
  });

  describe('GET /api/v1/patient_disease_group/patient/:id', () => {
    it('should retrieve single patient', (done) => {
      chai.request(app)
      .get(`/api/v1/patient_disease_group/patient/${currPatientIDs[0]}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one patient data with disease group');

        expect(r.data['patient_id']).to.equal(currPatientIDs[0]);
        expect(r.data['first_name']).to.equal('Ujang');
        expect(r.data['last_name']).to.equal(null);
        expect(r.data['phone_number']).to.equal('666');
        expect(r.data['line_user_id']).to.equal('ujang123');
        expect(r.data['clinic_id']).to.equal(currClinicID);
        expect(r.data['clinic_name']).to.equal('klinik lebak bulus');
        expect(r.data['disease_group_id']).to.equal(currDiseaseGroupID);
        expect(r.data['disease_group_name']).to.equal('ginjal');
        expect(r.data['patient_disease_group_id']).to.equal(currPatientDiseaseGroupID);

        done();
      });
    });

    it('should return 404 for invalid patientDiseaseGroupID', (done) => {
      const invalidPatientID = currPatientIDs[0] + 999;

      chai.request(app)
      .get(`/api/v1/patient_disease_group/patient/${invalidPatientID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No patient data found');

        done();
      });
    });
  });

  describe('PUT /api/v1/patient_disease_group/:id', () => {
    it('should update patient disease group data', (done) => {
      const updatePatient = {
        patient_id: currPatientIDs[1],
        disease_group_id: currDiseaseGroupID,
      };

      chai.request(app)
      .put(`/api/v1/patient_disease_group/${currPatientDiseaseGroupID}`)
      .send(updatePatient)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data['patient_id']).to.equal(currPatientIDs[1]);
        expect(r.data['disease_group_id']).to.equal(currDiseaseGroupID);

        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { patient_id: currPatientIDs[0] },
        { disease_group_id: currDiseaseGroupID },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .put(`/api/v1/patient_disease_group/${currPatientDiseaseGroupID}`)
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "patient_id" or "disease_group_id"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('DELETE /api/v1/patient_disease_group/:id', () => {
    it('should remove patient disease group data', (done) => {
      const patientDiseaseGroupID = currPatientDiseaseGroupID;

      chai.request(app)
      .delete(`/api/v1/patient_disease_group/${patientDiseaseGroupID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Patient disease group has been removed');

        done();
      });
    });

    it('should return 404 for invalid patientID', (done) => {
      const invalidPatientDiseaseGroupID = currPatientDiseaseGroupID + 999;

      chai.request(app)
      .delete(`/api/v1/patient_disease_group/${invalidPatientDiseaseGroupID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Patient disease group not exist or already removed');

        done();
      });
    });
  });
});
