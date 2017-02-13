/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');
const User = require('../../../app/model/user');

describe('Auth API Test', () => {
  const user = new User({
    email: 'foo@bar.com',
    password: 'Cageur@123!',
    role: 'superadmin',
  });

  before((done) => {
    user.encryptPassword()
    .then(_ => db.one(
      `INSERT INTO cageur_user(email, password, role)
      VALUES('${user.email}', '${user.password}', '${user.role}')
      RETURNING id`)
    )
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM cageur_user')
    .then(_ => done());
  });

  describe('POST /api/v1/auth', () => {
    it('should authenticate user', (done) => {
      const validRequest = {
        email: 'foo@bar.com',
        password: 'Cageur@123!',
      };

      chai.request(app)
      .post('/api/v1/auth')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Authentication succeeded');
        expect(r.token.split(' ')[0]).to.equal('JWT');

        done();
      })
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { email: 'bla@foo.com' },
        { password: 'Cageur@123!' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/auth')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "email" or "password"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });

    it('should return 401 unauthorized for invalid password', (done) => {
      const invalidRequest = {
        email: 'foo@bar.com',
        password: 'invalid password',
      };

      chai.request(app)
      .post('/api/v1/auth')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(401);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Authentication failed. Email and password not matched.');

        done();
      })
    });

    it('should return 401 unauthorized for invalid email', (done) => {
      const invalidRequest = {
        email: 'invalid@email.com',
        password: 'Cageur@123!',
      };

      chai.request(app)
      .post('/api/v1/auth')
      .send(invalidRequest)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(401);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Authentication failed. User not found.');

        done();
      })
    });
  });
});
