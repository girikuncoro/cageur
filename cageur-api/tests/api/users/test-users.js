/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Bank API Test', () => {
  let currBankID;

  const sqlInsertBank = (data) => {
    return `
      INSERT INTO bank(name, account_holder, account_number)
      VALUES('${data.name}', '${data.account_holder}', '${data.account_number}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertBank({
      name: 'Bank Test',
      account_holder: 'account holder bank',
      account_number: '123',
    }))
    .then((data) => {
      currBankID = data.id;
      return db.any(sqlInsertBank({
        name: 'Bank Test Update',
        account_holder: 'account holder update',
        account_number: '456',
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM bank')
    .then(_ => done());
  });

  describe('POST /api/v1/bank', () => {
    // test case should be independent on others
    let cleanedID;
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    afterEach((done) => {
      db.none(`DELETE FROM bank WHERE id=${cleanedID}`)
      .then(_ => done());
    });

    it('should insert new bank', (done) => {
      const validRequest = {
        name: 'bank test',
        account_holder: 'account holder test',
        account_number: '333',
      };

      chai.request(app)
      .post('/api/v1/bank')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data.name).to.equal('bank test');
        expect(r.data.account_holder).to.equal('account holder test');
        expect(r.data.account_number).to.equal('333');

        cleanedID = r.data.id;

        countRow('bank').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { account_holder: 'foo bar' },
        { account_number: '999' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/bank')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "name"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/bank', () => {
    it('should retrieve all bank', (done) => {
      chai.request(app)
      .get('/api/v1/bank')
      .then((res) => {
        const r = res.body;
        const validBank = [
          { name: 'bank ABC', account_holder: 'Guta Saputra', account_number: '123456' },
          { name: 'bank ABC', account_holder: 'Toro Rudy', account_number: '123456' },
          { name: 'bank ABC', account_holder: 'Giri Kuncoro', account_number: '123456' },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all bank data');

        r.data.forEach((bank, i) => {
          expect(bank.name).to.equal(validBank[i].name);
          expect(bank.account_holder).to.equal(validBank[i].account_holder);
          expect(bank.account_number).to.equal(validBank[i].account_number);

          if (i === r.data.length - 1) done();
        });
      });
    });

    it('should return 404 when table is empty', (done) => {
      // empty table first
      db.none('DELETE FROM bank')
      .then((_) => {
        return chai.request(app)
        .get('/api/v1/bank')
        .then((__) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(404);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('No bank data yet');
        });
      })
      .then(_ => db.one(sqlInsertBank({
        name: 'Bank Test',
        account_holder: 'account holder',
        account_number: '456',
      })))
      .then((data) => {
        currBankID = data.id;
        return db.any(sqlInsertBank({
          name: 'Bank Test',
          account_holder: 'account holder',
          account_number: '456',
        }));
      })
      .then(_ => done());
    });
  });

  describe('GET /api/v1/bank/:id', () => {
    it('should retrieve single bank', (done) => {
      chai.request(app)
      .get(`/api/v1/bank/${currBankID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one bank');

        expect(r.data.name).to.equal('Bank Test');
        expect(r.data.account_holder).to.equal('account holder');
        expect(r.data.account_number).to.equal('456');
        done();
      });
    });

    it('should return 404 for invalid bankID', (done) => {
      const invalidBankID = currBankID + 999;

      chai.request(app)
      .get(`/api/v1/clinic/${invalidBankID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No bank data found');

        done();
      });
    });
  });

  describe('PUT /api/v1/bank/:id', () => {
    it('should update bank data', (done) => {
      const updateBank = {
        name: 'Bank Test Update',
        account_holder: 'account holder Update',
        account_number: '321',
      };

      chai.request(app)
      .put(`/api/v1/bank/${currBankID}`)
      .send(updateBank)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.data.name).to.equal('Bank Test Update');
        expect(r.data.account_holder).to.equal('account holder Update');
        expect(r.data.account_number).to.equal('321');
        expect(r.message).to.equal('Bank data has been updated');

        done();
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { account_holder: 'foo bar' },
        { account_number: '999' },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .put(`/api/v1/bank/${currBankID}`)
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message).to.equal('Missing required parameters "name"');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });

  describe('DELETE /api/v1/bank/:id', () => {
    it('should remove bank data', (done) => {
      const BankID = currBankID;

      chai.request(app)
      .delete(`/api/v1/bank/${BankID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Bank has been removed');

        done();
      });
    });

    it('should return 404 for invalid BankID', (done) => {
      const invalidBankID = currBankID + 999;

      chai.request(app)
      .delete(`/api/v1/bank/${invalidBankID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('Bank not exist or already removed');

        done();
      });
    });
  });
});
