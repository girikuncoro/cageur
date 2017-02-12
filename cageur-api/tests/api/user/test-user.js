/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('User API Test', () => {
  let currUserID;

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
    .then((data) => {
      currUserID = data.id;
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

  // describe('POST /api/v1/user', () => {
  //   const countRow = (table) => {
  //     return db.one(`SELECT COUNT(*) FROM ${table}`);
  //   };
  //
  //   afterEach((done) => {
  //     db.none(`DELETE FROM clinic WHERE id=${cleanedID}`)
  //     .then(_ => done());
  //   });
  //
  //   it('should insert new clinic', (done) => {
  //     const validRequest = {
  //       name: 'klinik persija',
  //       address: 'jalan jakmania',
  //       phone_number: '333',
  //     };
  //
  //     chai.request(app)
  //     .post('/api/v1/clinic')
  //     .send(validRequest)
  //     .then((res) => {
  //       const r = res.body;
  //
  //       expect(res.status).to.equal(200);
  //       expect(r.status).to.equal('success');
  //
  //       expect(r.data.name).to.equal('klinik persija');
  //       expect(r.data.address).to.equal('jalan jakmania');
  //       expect(r.data['phone_number']).to.equal('333');
  //
  //       cleanedID = r.data.id;
  //
  //       countRow('clinic').then((row) => {
  //         expect(parseInt(row.count, 10)).to.equal(3);
  //         done();
  //       });
  //     });
  //   });
  //
  //   it('should return 400 for missing parameters', (done) => {
  //     const invalidRequests = [
  //       {},
  //       { address: 'foo bar' },
  //       { phone_number: '999' },
  //     ];
  //
  //     invalidRequests.forEach((req, i) => {
  //       chai.request(app)
  //       .post('/api/v1/clinic')
  //       .send(req)
  //       .then((_) => {}, (err) => {
  //         const data = err.response.body;
  //
  //         expect(err.status).to.equal(400);
  //         expect(data.status).to.equal('error');
  //         expect(data.message).to.equal('Missing required parameters "name"');
  //
  //         if (i === invalidRequests.length - 1) done();
  //       });
  //     });
  //   });
  // });
});
