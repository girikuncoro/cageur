/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Message Analytics API Test', () => {
  let currClinicID;
  let currDiseaseGroupID;

  const sqlInsertClinic = `
    INSERT INTO clinic(name, address, phone_number)
    VALUES('klinik sukabumi', 'jakarta', '123')
    RETURNING id`;

  const sqlInsertDiseaseGroup = `
    INSERT INTO disease_group(name)
    VALUES('mata')
    RETURNING id`;

  const sqlInsertMessageAnalytics = (data) => {
    return `
      INSERT INTO message_analytics(clinic_id, disease_group_id, time, pending, failed, delivered)
      VALUES(${data.clinicID}, ${data.diseaseGroupID}, '${data.time}', ${data.pending}, ${data.failed}, ${data.delivered})
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
      return db.one(sqlInsertMessageAnalytics({
        clinicID: currClinicID,
        diseaseGroupID: currDiseaseGroupID,
        time: '2017-01-03',
        pending: 1,
        failed: 2,
        delivered: 3,
      }));
    })
    .then((_) => {
      return db.one(sqlInsertMessageAnalytics({
        clinicID: currClinicID,
        diseaseGroupID: currDiseaseGroupID,
        time: '2017-01-04',
        pending: 4,
        failed: 5,
        delivered: 6,
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => db.none('DELETE FROM disease_group'))
    .then(_ => db.none('DELETE FROM message_analytics'))
    .then(_ => done());
  });

  describe('GET /api/v1/analytics/message', () => {
    it('should retrieve all sent message summary', (done) => {
      chai.request(app)
      .get('/api/v1/analytics/message')
      .then((res) => {
        const r = res.body;
        const validAnalytics = [
          {
            pending: 1,
            failed: 2,
            delivered: 3,
          },
          {
            pending: 4,
            failed: 5,
            delivered: 6,
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all message analytics');

        r.data.forEach((data, i) => {
          expect(data['message']).to.be.instanceof(Array);

          const message = data['message'][0];
          expect(message['clinic_id']).to.equal(currClinicID);
          expect(message['disease_group']['id']).to.equal(currDiseaseGroupID);
          expect(message['disease_group']['name']).to.equal('mata');
          expect(message['pending']).to.equal(validAnalytics[i].pending);
          expect(message['failed']).to.equal(validAnalytics[i].failed);
          expect(message['delivered']).to.equal(validAnalytics[i].delivered);

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/analytics/message/clinic/:id', () => {
    it('should retrieve all message analytics from clinic id', (done) => {
      chai.request(app)
      .get(`/api/v1/analytics/message/clinic/${currClinicID}`)
      .then((res) => {
        const r = res.body;
        const validAnalytics = [
          {
            pending: 1,
            failed: 2,
            delivered: 3,
          },
          {
            pending: 4,
            failed: 5,
            delivered: 6,
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all message analytics by clinic id');

        r.data.forEach((data, i) => {
          expect(data['message']).to.be.instanceof(Array);

          const message = data['message'][0];
          expect(message['clinic_id']).to.equal(currClinicID);
          expect(message['disease_group']['id']).to.equal(currDiseaseGroupID);
          expect(message['disease_group']['name']).to.equal('mata');
          expect(message['pending']).to.equal(validAnalytics[i].pending);
          expect(message['failed']).to.equal(validAnalytics[i].failed);
          expect(message['delivered']).to.equal(validAnalytics[i].delivered);

          if (i === r.data.length - 1) done();
        });
      });
    });
  });
});
