/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Message Sent API Test', () => {
  let currClinicID;
  let currDiseaseGroupID;
  let currSentID;

  const sqlInsertClinic = `
    INSERT INTO clinic(name, address, phone_number)
    VALUES('klinik alamanda', 'bandung', '111')
    RETURNING id`;

  const sqlInsertDiseaseGroup = `
    INSERT INTO disease_group(name)
    VALUES('hipertensi')
    RETURNING id`;

  const sqlInsertSentMessage = (data) => {
    return `
      INSERT INTO sent_message(clinic_id, disease_group_id, title, content, processed, processed_at)
      VALUES(${data.clinicID}, ${data.diseaseGroupID}, '${data.title}', '${data.content}', '${data.processed}', ${data.processedAt})
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
      return db.one(sqlInsertSentMessage({
        clinicID: currClinicID,
        diseaseGroupID: currDiseaseGroupID,
        title: 'Some title',
        content: 'Some content',
        processed: 'delivered',
        processedAt: 'now()',
      }));
    })
    .then((data) => {
      currSentID = data.id;
      return db.one(sqlInsertSentMessage({
        clinicID: currClinicID,
        diseaseGroupID: currDiseaseGroupID,
        title: 'Another title',
        content: 'Another content',
        processed: 'pending',
        processedAt: 'NULL',
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => db.none('DELETE FROM disease_group'))
    .then(_ => db.none('DELETE FROM sent_message'))
    .then(_ => done());
  });

  describe('GET /api/v1/message/sent', () => {
    it('should retrieve all sent messages', (done) => {
      chai.request(app)
      .get('/api/v1/message/sent')
      .then((res) => {
        const r = res.body;
        const validSentMsg = [
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'hipertensi',
            patientID: null,
            title: 'Some title',
            content: 'Some content',
            processed: 'delivered',
          },
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'hipertensi',
            patientID: null,
            title: 'Another title',
            content: 'Another content',
            processed: 'pending',
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all sent message');

        r.data.forEach((data, i) => {
          expect(data['clinic_id']).to.equal(validSentMsg[i].clinicID);
          expect(data['disease_group_id']).to.equal(validSentMsg[i].diseaseGroupID);
          expect(data['patient_id']).to.equal(null);
          expect(data['title']).to.equal(validSentMsg[i].title);
          expect(data['content']).to.equal(validSentMsg[i].content);
          expect(data['processed']).to.equal(validSentMsg[i].processed);

          if (i === 0) {
            expect(data['processed_at']).to.not.equal(null);
          } else {
            expect(data['processed_at']).to.equal(null);
          }

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/message/sent/clinic/:id', () => {
    it('should retrieve sent messages by clinic id', (done) => {
      chai.request(app)
      .get(`/api/v1/message/sent/clinic/${currClinicID}`)
      .then((res) => {
        const r = res.body;
        const validSentMsg = [
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'hipertensi',
            patientID: null,
            title: 'Some title',
            content: 'Some content',
            processed: 'delivered',
          },
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'hipertensi',
            patientID: null,
            title: 'Another title',
            content: 'Another content',
            processed: 'pending',
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all sent message by clinicID');

        r.data.forEach((data, i) => {
          expect(data['clinic_id']).to.equal(validSentMsg[i].clinicID);
          expect(data['disease_group_id']).to.equal(validSentMsg[i].diseaseGroupID);
          expect(data['patient_id']).to.equal(null);
          expect(data['title']).to.equal(validSentMsg[i].title);
          expect(data['content']).to.equal(validSentMsg[i].content);
          expect(data['processed']).to.equal(validSentMsg[i].processed);

          if (i === 0) {
            expect(data['processed_at']).to.not.equal(null);
          } else {
            expect(data['processed_at']).to.equal(null);
          }

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 for invalid clinicID', (done) => {
      const invalidClinicID = currClinicID + 999;

      chai.request(app)
      .get(`/api/v1/message/sent/${invalidClinicID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No sent message found');

        done();
      });
    });
  });

  describe('GET /api/v1/message/sent/:id', () => {
    it('should retrieve single sent message', (done) => {
      chai.request(app)
      .get(`/api/v1/message/sent/${currSentID}`)
      .then((res) => {
        const r = res.body;
        const validSentMsg = {
          clinicID: currClinicID,
          diseaseGroupID: currDiseaseGroupID,
          diseaseGroupName: 'hipertensi',
          patientID: null,
          title: 'Some title',
          content: 'Some content',
          processed: 'delivered',
        };

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved single sent message');

        const data = r.data;
        expect(data['clinic_id']).to.equal(validSentMsg.clinicID);
        expect(data['disease_group_id']).to.equal(validSentMsg.diseaseGroupID);
        expect(data['patient_id']).to.equal(null);
        expect(data['title']).to.equal(validSentMsg.title);
        expect(data['content']).to.equal(validSentMsg.content);
        expect(data['processed']).to.equal(validSentMsg.processed);
        expect(data['processed_at']).to.not.equal(null);

        done();
      });
    });

    it('should return 404 for invalid sentID', (done) => {
      const invalidSentID = currSentID + 999;

      chai.request(app)
      .get(`/api/v1/message/sent/${invalidSentID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No sent message found');

        done();
      });
    });
  });
});
