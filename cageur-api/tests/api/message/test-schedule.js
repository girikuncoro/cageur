/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Message Schedule API Test', () => {
  let currClinicID;
  let currDiseaseGroupID;
  let currScheduleID;

  const sqlInsertClinic = `
    INSERT INTO clinic(name, address, phone_number)
    VALUES('klinik alamanda', 'bandung', '111')
    RETURNING id`;

  const sqlInsertDiseaseGroup = `
    INSERT INTO disease_group(name)
    VALUES('kulit')
    RETURNING id`;

  const sqlInsertScheduledMessage = (data) => {
    return `
      INSERT INTO scheduled_message(clinic_id, disease_group_id, title, content, frequency, scheduled_at)
      VALUES(${data.clinicID}, ${data.diseaseGroupID}, '${data.title}', '${data.content}', '${data.frequency}', '${data.scheduledAt}')
      RETURNING id`;
  };

  const countRow = (table) => {
    return db.one(`SELECT COUNT(*) FROM ${table}`);
  };

  before((done) => {
    db.one(sqlInsertClinic)
    .then((data) => {
      currClinicID = data.id;
      return db.one(sqlInsertDiseaseGroup);
    })
    .then((data) => {
      currDiseaseGroupID = data.id;
      return db.one(sqlInsertScheduledMessage({
        clinicID: currClinicID,
        diseaseGroupID: currDiseaseGroupID,
        title: 'Some title',
        content: 'Some content',
        frequency: 'daily',
        scheduledAt: 'now()',
      }));
    })
    .then((data) => {
      currScheduleID = data.id;
      return db.one(sqlInsertScheduledMessage({
        clinicID: currClinicID,
        diseaseGroupID: currDiseaseGroupID,
        title: 'Another title',
        content: 'Another content',
        frequency: 'monthly',
        scheduledAt: 'now()',
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM clinic')
    .then(_ => db.none('DELETE FROM disease_group'))
    .then(_ => db.none('DELETE FROM scheduled_message'))
    .then(_ => done());
  });

  describe('GET /api/v1/message/schedule', () => {
    it('should retrieve all scheduled messages', (done) => {
      chai.request(app)
      .get('/api/v1/message/schedule')
      .then((res) => {
        const r = res.body;
        const validScheduledMsgs = [
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'kulit',
            patientID: null,
            title: 'Another title',
            content: 'Another content',
            frequency: 'monthly',
          },
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'kulit',
            patientID: null,
            title: 'Some title',
            content: 'Some content',
            frequency: 'daily',
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all scheduled message');

        r.data.forEach((data, i) => {
          expect(data['clinic_id']).to.equal(validScheduledMsgs[i].clinicID);
          expect(data['disease_group']['id']).to.equal(validScheduledMsgs[i].diseaseGroupID);
          expect(data['disease_group']['name']).to.equal(validScheduledMsgs[i].diseaseGroupName);
          expect(data['patient_id']).to.equal(null);
          expect(data['title']).to.equal(validScheduledMsgs[i].title);
          expect(data['content']).to.equal(validScheduledMsgs[i].content);
          expect(data['frequency']).to.equal(validScheduledMsgs[i].frequency);
          expect(data['scheduled_at']).to.not.equal(null);

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/message/schedule/clinic/:id', () => {
    it('should retrieve scheduled messages by clinic id', (done) => {
      chai.request(app)
      .get(`/api/v1/message/schedule/clinic/${currClinicID}`)
      .then((res) => {
        const r = res.body;
        const validScheduledMsgs = [
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'kulit',
            patientID: null,
            title: 'Another title',
            content: 'Another content',
            frequency: 'monthly',
          },
          {
            clinicID: currClinicID,
            diseaseGroupID: currDiseaseGroupID,
            diseaseGroupName: 'kulit',
            patientID: null,
            title: 'Some title',
            content: 'Some content',
            frequency: 'daily',
          },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all scheduled message by clinic id');

        r.data.forEach((data, i) => {
          expect(data['clinic_id']).to.equal(validScheduledMsgs[i].clinicID);
          expect(data['disease_group']['id']).to.equal(validScheduledMsgs[i].diseaseGroupID);
          expect(data['disease_group']['name']).to.equal(validScheduledMsgs[i].diseaseGroupName);
          expect(data['patient_id']).to.equal(null);
          expect(data['title']).to.equal(validScheduledMsgs[i].title);
          expect(data['content']).to.equal(validScheduledMsgs[i].content);
          expect(data['frequency']).to.equal(validScheduledMsgs[i].frequency);
          expect(data['scheduled_at']).to.not.equal(null);

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 for invalid clinicID', (done) => {
      const invalidClinicID = currClinicID + 999;

      chai.request(app)
      .get(`/api/v1/message/schedule/clinic/${invalidClinicID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No scheduled message found');

        done();
      });
    });
  });

  describe('GET /api/v1/message/schedule/:id', () => {
    it('should retrieve single scheduled message', (done) => {
      chai.request(app)
      .get(`/api/v1/message/schedule/${currScheduleID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one scheduled message');

        const data = r.data;
        expect(data['clinic_id']).to.equal(currClinicID);
        expect(data['disease_group']['id']).to.equal(currDiseaseGroupID);
        expect(data['disease_group']['name']).to.equal('kulit');
        expect(data['patient_id']).to.equal(null);
        expect(data['title']).to.equal('Some title');
        expect(data['content']).to.equal('Some content');
        expect(data['frequency']).to.equal('daily');
        expect(data['scheduled_at']).to.not.equal(null);

        done();
      });
    });

    it('should return 404 for invalid scheduledID', (done) => {
      const invalidScheduleID = currScheduleID + 999;

      chai.request(app)
      .get(`/api/v1/message/schedule/${invalidScheduleID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No scheduled message found');

        done();
      });
    });
  });

  describe('DELETE /api/v1/message/schedule/:id', () => {
    it('should remove scheduled message', (done) => {
      const scheduleID = currScheduleID;

      chai.request(app)
      .delete(`/api/v1/message/schedule/${scheduleID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Scheduled message has been removed');

        done();
      });
    });

    it('should return 404 for invalid scheduleID', (done) => {
      const invalidScheduleID = currScheduleID + 999;

      chai.request(app)
      .delete(`/api/v1/message/schedule/${invalidScheduleID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Scheduled message not exist or already removed');

        done();
      });
    });
  });

  describe('POST /api/v1/message/schedule', () => {
    it('should insert new scheduled message', (done) => {
      const validRequest = {
        disease_group: currDiseaseGroupID,
        body: 'A new scheduled message with foo bar',
        frequency: 'none',
        scheduled_at: '2018-01-30 15:39',
      };

      chai.request(app)
      .post(`/api/v1/message/schedule/clinic/${currClinicID}`)
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data['clinic_id']).to.equal(currClinicID);
        expect(r.data['disease_group_id']).to.equal(currDiseaseGroupID);
        expect(r.data['title']).to.equal('A new scheduled message with');
        expect(r.data['content']).to.equal('A new scheduled message with foo bar');
        expect(r.data['frequency']).to.equal('none');
        expect(r.data['scheduled_at']).to.equal('2018-01-30T15:39:00.000Z');

        countRow('scheduled_message').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(2);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { disease_group_id: 5 },
        { body: 'blah' },
        { frequency: 'none' },
        { scheduled_at: '2010-01-30 12:21' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post(`/api/v1/message/schedule/clinic/${currClinicID}`)
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "disease_group" or "body" or "frequency" or "scheduled_at"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });

    it('should return 400 for bad time format', (done) => {
      const invalidRequest = {
        disease_group: currDiseaseGroupID,
        body: 'A new scheduled message with foo bar',
        frequency: 'none',
        scheduled_at: 'foo',
      };

      chai.request(app)
      .post(`/api/v1/message/schedule/clinic/${currClinicID}`)
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(400);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Bad scheduled_at format, valid example: "2015-01-30 23:30" in UTC');

        done();
      });
    });
  });
});
