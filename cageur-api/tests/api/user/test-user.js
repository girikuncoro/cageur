/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('User API Test', () => {
  const sqlInsertUser = (data) => {
    return `
      INSERT INTO cageur_user(name, email, password, role)
      VALUES('${data.name}', '${data.email}', '${data.password}', '${data.role}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertUser({
      name: 'Ali',
      email: 'ali@foo.com',
      password: 'Cageur@123!',
      role: 'clinic',
    }))
    .then((_) => {
      return db.any(sqlInsertUser({
        name: 'Baba',
        email: 'baba@foo.com',
        password: 'Cageur@123!',
        role: 'superadmin',
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM cageur_user')
    .then(_ => done());
  });

  describe('GET /api/v1/user', () => {
    it('should retrieve all user without password info', (done) => {
      chai.request(app)
      .get('/api/v1/user')
      .then((res) => {
        const r = res.body;
        const validUser = [
          { name: 'Ali', email: 'ali@foo.com', role: 'clinic' },
          { name: 'Baba', email: 'baba@foo.com', role: 'superadmin' },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all user data');

        r.data.forEach((user, i) => {
          expect(user.name).to.equal(validUser[i].name);
          expect(user.email).to.equal(validUser[i].email);
          expect(user.role).to.equal(validUser[i].role);

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('POST /api/v1/user', () => {
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    it('should insert new user with encrypted password', (done) => {
      const validRequest = {
        name: 'Caca',
        email: 'caca@foo.com',
        password: 'Cageur@123!',
        role: 'superadmin',
      };

      chai.request(app)
      .post('/api/v1/user')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data.name).to.equal('Caca');
        expect(r.data.email).to.equal('caca@foo.com');
        expect(r.data.role).to.equal('superadmin');

        countRow('cageur_user').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
        });

        // password should be hashed
        return db.one(`SELECT password FROM cageur_user WHERE id = ${r.data.id}`);
      })
      .then((user) => {
        expect(user.password).to.not.equal('Cageur@123!');
        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { email: 'bla@foo.com' },
        { password: 'Cageur@123!' },
        { role: 'clinic' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/user')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "name" or "email" or "password" or "role"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });

    it('should return 400 for invalid email format', (done) => {
      const invalidRequest = {
        name: 'Dodo',
        email: 'invalid email',
        password: 'Cageur@123!',
        role: 'superadmin',
      };

      chai.request(app)
      .post('/api/v1/user')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(400);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Invalid email format');

        done();
      });
    });

    it('should return 400 for invalid password format', (done) => {
      const invalidRequest = {
        name: 'Dodo',
        email: 'dodo@foo.com',
        password: 'invalid password',
        role: 'superadmin',
      };

      chai.request(app)
      .post('/api/v1/user')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(400);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Invalid password requirement, must contain at least 1 special character, uppercase, alphabet, number and minimum 8 characters');

        done();
      });
    });

    it('should return 400 for duplicated email', (done) => {
      const invalidRequest = {
        name: 'Ali',
        email: 'ali@foo.com',
        password: 'Cageur@123!',
        role: 'superadmin',
      };

      chai.request(app)
      .post('/api/v1/user')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(400);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Email address exist');

        done();
      });
    });
  });
});
