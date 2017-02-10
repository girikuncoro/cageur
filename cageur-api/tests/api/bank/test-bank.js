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
      name: 'Bank A',
      account_holder: 'budi',
      account_number: 123,
    }))
    .then((data) => {
      currBankID = data.id;
      return db.any(sqlInsertBank({
        name: 'Bank B',
        account_holder: 'ani',
        account_number: 456,
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM bank')
    .then(_ => done());
  });

  describe('GET /api/v1/bank', () => {
    it('should retrieve all bank', (done) => {
      chai.request(app)
      .get('/api/v1/bank')
      .then((res) => {
        const r = res.body;
        const validBank = [
          { name: 'Bank A', account_holder: 'budi', account_number: 123 },
          { name: 'Bank B', account_holder: 'ani', account_number: 456 },
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

        expect(r.data.name).to.equal('Bank A');
        expect(r.data.account_holder).to.equal('budi');
        expect(r.data.account_number).to.equal(123);
        done();
      });
    });

    it('should return 404 for invalid bankID', (done) => {
      const invalidBankID = currBankID + 999;

      chai.request(app)
      .get(`/api/v1/bank/${invalidBankID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No bank data found');

        done();
      });
    });
  });

  describe('POST /api/v1/bank', () => {
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    it('should insert new bank', (done) => {
      const validRequest = {
        name: 'Bank C',
        account_holder: 'cecep',
        account_number: 333,
      };

      chai.request(app)
      .post('/api/v1/bank')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data.name).to.equal('Bank C');
        expect(r.data.account_holder).to.equal('cecep');
        expect(r.data.account_number).to.equal(333);

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
        { account_number: 999 },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/bank')
        .send(req)
        .then((_) => {}, (err) => {
          const data = err.response.body;

          expect(err.status).to.equal(400);
          expect(data.status).to.equal('error');
          expect(data.message.slice(0, 27)).to.equal('Missing required parameters');

          if (i === invalidRequests.length - 1) done();
        });
      });
    });
  });
});
