/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Message Send API Test', () => {
  describe('POST /api/v1/message/send', () => {
    let diseaseGroupID;

    before((done) => {
      const insertClinic = db.one(`
        INSERT INTO clinic(name)
        VALUES('klinik 1')
        RETURNING id
      `);

      const insertPatient = (clinicID) => {
        return db.one(`
          INSERT INTO patient(phone_number, first_name, clinic_id, line_user_id)
          VALUES('123', 'ucok', ${clinicID}, 'ucok123')
          RETURNING id
        `);
      };

      const insertDiseaseGroup = db.one(`
        INSERT INTO disease_group(name)
        VALUES('asam urat')
        RETURNING id
      `);

      const insertPatientDiseaseGroup = (patientID, _diseaseGroupID) => {
        return db.none(`
          INSERT INTO patient_disease_group(patient_id, disease_group_id)
          VALUES(${patientID}, ${_diseaseGroupID})
        `);
      };

      insertClinic.then(data => insertPatient(data.id))
      .then((patientData) => {
        return insertDiseaseGroup.then((diseaseGroupData) => {
          diseaseGroupID = diseaseGroupData.id;
          return insertPatientDiseaseGroup(patientData.id, diseaseGroupData.id);
        });
      })
      .then(_ => done());
    });

    // make sure to clean test DB after all test cases done
    after((done) => {
      // clinic delete cascade to patient and patient_disease_group table
      db.none('DELETE FROM clinic')
      .then(_ => db.none('DELETE FROM disease_group'))
      .then(_ => done());
    });

    it('should return success response', (done) => {
      const validRequest = {
        diseaseGroup: diseaseGroupID,
        body: 'hello ucok',
      };

      chai.request(app)
      .post('/api/v1/message/send')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data.message.diseaseGroup).to.equal(diseaseGroupID);
        expect(r.data.message.body).to.equal('hello ucok');
        expect(r.data.queuedLineUserIds).to.equal(1);

        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { body: 'hello ucok' },
        { diseaseGroup: diseaseGroupID },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/message/send')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "diseaseGroup" or "body"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });

    it('should return 404 for invalid disease group', (done) => {
      const invalidDiseaseGroupID = diseaseGroupID + 999;
      const invalidRequest = {
        diseaseGroup: invalidDiseaseGroupID,
        body: 'hello ucok',
      };

      chai.request(app)
      .post('/api/v1/message/send')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No Line User Ids found');

        done();
      });
    });
  });
});
