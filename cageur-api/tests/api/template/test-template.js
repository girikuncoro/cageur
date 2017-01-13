/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Template API Test', () => {
  let _diseaseGroupID;
  let _templateID;

  const sqlInsertDiseaseGroup = `
    INSERT INTO disease_group(name)
    VALUES('darah tinggi')
    RETURNING id`;

  const sqlInsertTemplate = (diseaseGroupID) => {
    return `
      INSERT INTO template(disease_group_id, title, content)
      VALUES(${diseaseGroupID}, 'Foo for bar', 'This is foo content')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertDiseaseGroup)
    .then((data) => {
      _diseaseGroupID = data.id;
      return db.any(sqlInsertTemplate(_diseaseGroupID));
    })
    .then(_ => db.any(sqlInsertTemplate(null)))
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM disease_group')
    .then(_ => db.none('DELETE FROM template'))
    .then(_ => done());
  });

  describe('POST /api/v1/template', () => {
    // test case should be independent on others
    let _cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM template WHERE id=${_cleanedID}`)
      .then(_ => done());
    });

    it('should insert for requested disease group', (done) => {
      const validRequest = {
        diseaseGroup: _diseaseGroupID,
        title: 'Foo bar',
        content: 'Some content',
      };

      chai.request(app)
      .post('/api/v1/template')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data.disease_group).to.equal(_diseaseGroupID);  // TODO: should return camel case
        expect(r.data.title).to.equal('Foo bar');
        expect(r.data.content).to.equal('Some content');

        _cleanedID = r.data.id;

        countRow('template').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should insert for all disease group', (done) => {
      const validRequest = {
        diseaseGroup: _diseaseGroupID,
        title: 'Foo bar',
        content: 'Some content for all patient',
      };

      chai.request(app)
      .post('/api/v1/template')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data.disease_group).to.equal(_diseaseGroupID);  // TODO: should return camel case
        expect(r.data.title).to.equal('Foo bar');
        expect(r.data.content).to.equal('Some content for all patient');

        _cleanedID = r.data.id;

        countRow('template').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { diseaseGroup: _diseaseGroupID },
        { title: 'Foo bar' },
        { content: 'Some content' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/template')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "diseaseGroup" or "title" or "content"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });

    it('should return 400 for invalid disease group', (done) => {
      const invalidDiseaseGroupID = _diseaseGroupID + 999;
      const invalidRequest = {
        diseaseGroup: invalidDiseaseGroupID,
        title: 'Foo bar',
        content: 'Some content',
      };

      chai.request(app)
      .post('/api/v1/template')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(400);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Invalid disease group');

        done();
      });
    });
  });

  describe('GET /api/v1/template', () => {
    it('should retrieve all templates', (done) => {
      chai.request(app)
      .get('/api/v1/template')
      .then((res) => {
        const r = res.body;
        const validDiseaseGroup = ['darah tinggi', 'all'];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all template data');

        r.data.forEach((data, i) => {
          expect(data.disease_group).to.equal(validDiseaseGroup[i]);
          expect(data.title).to.equal('Foo for bar');
          expect(data.content).to.equal('This is foo content');

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 when table is empty', (done) => {
      // empty table first
      db.none('DELETE FROM template')
      .then((_) => {
        return chai.request(app)
        .get('/api/v1/template')
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(404);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('No template data yet');
        })
      })
      .then(_ => db.any(sqlInsertTemplate(_diseaseGroupID)))
      .then(_ => db.any(sqlInsertTemplate(null)))
      .then(_ => done());
    });
  });
});
