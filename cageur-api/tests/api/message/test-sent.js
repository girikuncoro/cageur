/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Message Sent API Test', () => {
  let currClinicID;
  let currDiseaseGroupID;

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
      VALUES(${data.clinicID}, ${data.diseaseGroupID}, '${data.title}', '${data.content}', '${data.processed}', now())
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertClinic)
    .then((data) => {
      currClinicID = data.id;
      return db.one(sqlInsertDiseaseGroup);
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => db.none('DELETE FROM disease_group'))
    .then(_ => done());
  });

  describe('GET /api/v1/message/sent', () => {
    it('should retrieve all sent messages', (done) => {
      chai.request(app)
      .get('/api/v1/message/sent')
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

        r.data.forEach((d, i) => {
          const data = d['patient_disease_group'];

          expect(data['patient']['id']).to.equal(validPatients[i].patientID);
          expect(data['patient']['first_name']).to.equal(validPatients[i].firstName);
          expect(data['patient']['last_name']).to.equal(null);
          expect(data['patient']['phone_number']).to.equal(validPatients[i].phoneNumber);
          expect(data['patient']['line_user_id']).to.equal(validPatients[i].lineUserID);
          expect(data['patient']['clinic_id']).to.equal(validPatients[i].clinicID);
          expect(data['disease_group']).to.be.instanceof(Array);

          if (data['disease_group'].length > 0) {
            expect(data['disease_group'][0]['id']).to.equal(validPatients[i].diseaseGroupID);
            expect(data['disease_group'][0]['name']).to.equal(validPatients[i].diseaseGroupName);
          }

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/message/sent/clinic/:id', () => {
    it('should retrieve all patient from clinic with disease group info', (done) => {
      chai.request(app)
      .get(`/api/v1/patient_disease_group/clinic/${currClinicID}`)
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

        r.data.forEach((d, i) => {
          const data = d['patient_disease_group'];

          expect(data['patient']['id']).to.equal(validPatients[i].patientID);
          expect(data['patient']['first_name']).to.equal(validPatients[i].firstName);
          expect(data['patient']['last_name']).to.equal(null);
          expect(data['patient']['phone_number']).to.equal(validPatients[i].phoneNumber);
          expect(data['patient']['line_user_id']).to.equal(validPatients[i].lineUserID);
          expect(data['patient']['clinic_id']).to.equal(validPatients[i].clinicID);
          expect(data['disease_group']).to.be.instanceof(Array);

          if (data['disease_group'].length > 0) {
            expect(data['disease_group'][0]['id']).to.equal(validPatients[i].diseaseGroupID);
            expect(data['disease_group'][0]['name']).to.equal(validPatients[i].diseaseGroupName);
          }

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

});
