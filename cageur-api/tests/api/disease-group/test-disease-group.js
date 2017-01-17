/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Disease Group API Test', () => {
  let currDiseaseGroupID;

  const sqlInsertDiseaseGroup = (diseaseName) => {
    return `
      INSERT INTO disease_group(name)
      VALUES('${diseaseName}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertDiseaseGroup('sakit mata'))
    .then((data) => {
      currDiseaseGroupID = data.id;
      return db.any(sqlInsertDiseaseGroup('sakit jiwa'));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM disease_group')
    .then(_ => done());
  });

  describe('POST /api/v1/disease_group', () => {
    // test case should be independent on others
    let cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM disease_group WHERE id=${cleanedID}`)
      .then(_ => done());
    });

    it('should insert new disease group', (done) => {
      const validRequest = {
        name: 'mudah lelah',
      };

      chai.request(app)
      .post('/api/v1/disease_group')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data.name).to.equal('mudah lelah');

        cleanedID = r.data.id;

        countRow('disease_group').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequest = {};

      chai.request(app)
      .post('/api/v1/disease_group')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(400);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Missing required parameters "name"');
        done();
      });
    });
  });

  describe('GET /api/v1/disease_group', () => {
    it('should retrieve all disease groups', (done) => {
      chai.request(app)
      .get('/api/v1/disease_group')
      .then((res) => {
        const r = res.body;
        const validDiseaseGroup = ['sakit mata', 'sakit jiwa'];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all disease group data');

        r.data.forEach((disease, i) => {
          expect(disease.name).to.equal(validDiseaseGroup[i]);

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 when table is empty', (done) => {
      // empty table first
      db.none('DELETE FROM disease_group')
      .then((_) => {
        return chai.request(app)
        .get('/api/v1/disease_group')
        .then((__) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(404);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('No disease group data yet');
        });
      })
      .then(_ => db.one(sqlInsertDiseaseGroup('sakit mata')))
      .then((data) => {
        currDiseaseGroupID = data.id;
        return db.any(sqlInsertDiseaseGroup('sakit jiwa'));
      })
      .then(_ => done());
    });
  });

  describe('GET /api/v1/disease_group/:id', () => {
    it('should retrieve single disease group', (done) => {
      chai.request(app)
      .get(`/api/v1/disease_group/${currDiseaseGroupID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one disease group');

        expect(r.data.name).to.equal('sakit mata');
        done();
      });
    });

    it('should return 404 for invalid diseaseGroupID', (done) => {
      const invalidDiseaseGroupID = currDiseaseGroupID + 999;

      chai.request(app)
      .get(`/api/v1/disease_group/${invalidDiseaseGroupID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No disease group data found');

        done();
      });
    });
  });

  describe('PUT /api/v1/disease_group/:id', () => {
    it('should update disease group data', (done) => {
      const updateDiseaseGroup = {
        name: 'new disease',
      };

      chai.request(app)
      .put(`/api/v1/disease_group/${currDiseaseGroupID}`)
      .send(updateDiseaseGroup)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data.name).to.equal('new disease');
        expect(r.message).to.equal('Disease group has been updated');

        done();
      });
    });
  });

  describe('DELETE /api/v1/disease_group/:id', () => {
    it('should remove disease group data', (done) => {
      const diseaseGroupID = currDiseaseGroupID;

      chai.request(app)
      .delete(`/api/v1/disease_group/${diseaseGroupID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Disease group has been removed');

        done();
      });
    });

    it('should return 404 for invalid diseaseGroupID', (done) => {
      const invalidDiseaseGroupID = currDiseaseGroupID + 999;

      chai.request(app)
      .delete(`/api/v1/disease_group/${invalidDiseaseGroupID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Disease group not exist or already removed');

        done();
      });
    });
  });
});
