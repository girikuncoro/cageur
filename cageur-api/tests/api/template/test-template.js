/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Template API Test', () => {
  let currDiseaseGroupID;
  let currSingleTemplateID;
  let currAllTemplateID;

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
      currDiseaseGroupID = data.id;
      return db.any(sqlInsertTemplate(currDiseaseGroupID));
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
    let cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM template WHERE id=${cleanedID}`)
      .then(_ => done());
    });

    it('should insert for requested disease group', (done) => {
      const validRequest = {
        diseaseGroup: currDiseaseGroupID,
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

        // TODO: should have returned camel case
        expect(r.data.disease_group).to.equal(currDiseaseGroupID);
        expect(r.data.title).to.equal('Foo bar');
        expect(r.data.content).to.equal('Some content');

        cleanedID = r.data.id;

        countRow('template').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should insert for all disease group', (done) => {
      const validRequest = {
        diseaseGroup: currDiseaseGroupID,
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

        expect(r.data['disease_group']).to.equal(currDiseaseGroupID);
        expect(r.data.title).to.equal('Foo bar');
        expect(r.data.content).to.equal('Some content for all patient');

        cleanedID = r.data.id;

        countRow('template').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { diseaseGroup: currDiseaseGroupID },
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
      const invalidDiseaseGroupID = currDiseaseGroupID + 999;
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
        .then((__) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(404);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('No template data yet');
        });
      })
      .then(_ => db.one(sqlInsertTemplate(currDiseaseGroupID)))
      .then((data) => {
        currSingleTemplateID = data.id;
        return db.one(sqlInsertTemplate(null));
      })
      .then((data) => {
        currAllTemplateID = data.id;
        done();
      });
    });
  });

  describe('GET /api/v1/template/:id', () => {
    it('should retrieve single template for specific disease group', (done) => {
      chai.request(app)
      .get(`/api/v1/template/${currSingleTemplateID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one template');

        expect(r.data.disease_group).to.equal('darah tinggi');
        expect(r.data.title).to.equal('Foo for bar');
        expect(r.data.content).to.equal('This is foo content');

        done();
      });
    });

    it('should retrieve single template for all patient group', (done) => {
      chai.request(app)
      .get(`/api/v1/template/${currAllTemplateID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one template');

        expect(r.data.disease_group).to.equal('all');
        expect(r.data.title).to.equal('Foo for bar');
        expect(r.data.content).to.equal('This is foo content');

        done();
      });
    });

    it('should return 404 for invalid templateID', (done) => {
      const invalidTemplateID = currSingleTemplateID + 999;

      chai.request(app)
      .get(`/api/v1/template/${invalidTemplateID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No template data found');

        done();
      });
    });
  });

  describe('GET /api/v1/template/disease_group/:id', () => {
    it('should retrieve template list for specific disease group', (done) => {
      chai.request(app)
      .get(`/api/v1/template/disease_group/${currDiseaseGroupID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved template data for disease group');

        expect(r.data).to.be.instanceof(Array);
        expect(r.data[0].disease_group).to.equal('darah tinggi');
        expect(r.data[0].title).to.equal('Foo for bar');
        expect(r.data[0].content).to.equal('This is foo content');

        done();
      });
    });

    it('should retrieve template list for all patient group', (done) => {
      chai.request(app)
      .get('/api/v1/template/disease_group/all')
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved template data for disease group');

        expect(r.data).to.be.instanceof(Array);
        expect(r.data[0].disease_group).to.equal('all');
        expect(r.data[0].title).to.equal('Foo for bar');
        expect(r.data[0].content).to.equal('This is foo content');

        done();
      });
    });

    it('should return 404 for invalid diseaseGroupID', (done) => {
      const invalidDiseaseGroupID = currDiseaseGroupID + 999;

      chai.request(app)
      .get(`/api/v1/template/disease_group/${invalidDiseaseGroupID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No template data found');

        done();
      });
    });
  });

  describe('PUT /api/v1/template/:id', () => {
    it('should update template data for specific disease group', (done) => {
      const updateTemplate = (diseaseID) => {
        return {
          diseaseGroup: diseaseID,
          title: 'New title',
          content: 'New content',
        };
      };

      // insert new disease
      let newDiseaseID;
      db.any('INSERT INTO disease_group(name) VALUES(\'sakit hati\') RETURNING id')
      .then((data) => {
        newDiseaseID = data[0].id;
        return chai.request(app)
          .put(`/api/v1/template/${currSingleTemplateID}`)
          .send(updateTemplate(newDiseaseID));
      })
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Template has been updated');

        expect(r.data.disease_group).to.equal(newDiseaseID);
        expect(r.data.title).to.equal('New title');
        expect(r.data.content).to.equal('New content');

        done();
      });
    });

    it('should update template data to all patient group', (done) => {
      const updateTemplate = {
        diseaseGroup: 'all',
        title: 'New title for all',
        content: 'New content for all',
      };

      chai.request(app)
      .put(`/api/v1/template/${currSingleTemplateID}`)
      .send(updateTemplate)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Template has been updated');

        expect(r.data.disease_group).to.equal('all');
        expect(r.data.title).to.equal('New title for all');
        expect(r.data.content).to.equal('New content for all');

        done();
      });
    });

    it('should update template data for all patient group', (done) => {
      const updateTemplate = {
        diseaseGroup: currDiseaseGroupID,
        title: 'New title',
        content: 'New content',
      };

      chai.request(app)
      .put(`/api/v1/template/${currAllTemplateID}`)
      .send(updateTemplate)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Template has been updated');

        expect(r.data.disease_group).to.equal(currDiseaseGroupID);
        expect(r.data.title).to.equal('New title');
        expect(r.data.content).to.equal('New content');

        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { diseaseGroup: currDiseaseGroupID },
        { title: 'Foo bar' },
        { content: 'Some content' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .put(`/api/v1/template/${currAllTemplateID}`)
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
  });

  describe('DELETE /api/v1/template/:id', () => {
    it('should remove template data', (done) => {
      const templateID = currSingleTemplateID;

      chai.request(app)
      .delete(`/api/v1/template/${templateID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Template has been removed');

        done();
      });
    });

    it('should return 404 for invalid templateID', (done) => {
      const invalidTemplateID = currSingleTemplateID + 999;

      chai.request(app)
      .delete(`/api/v1/template/${invalidTemplateID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Template not exist or already removed');

        done();
      });
    });
  });
});
