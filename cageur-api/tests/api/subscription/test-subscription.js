/* eslint-disable arrow-body-style */
const app = require('../../../index');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-http'));

const db = require('../../../app/config/db');

describe('Subscription API Test', () => {
  let currBankID;
  let currClinicID;
  let currSubscriptionID;

  const sqlInsertBank = `
    INSERT INTO bank(name, account_holder, account_number)
    VALUES('BCA', 'dedi', 101)
    RETURNING id`;

  const sqlInsertClinic = `
    INSERT INTO clinic(name, address, phone_number)
    VALUES('klinik acong', 'surabaya', '221')
    RETURNING id`;

  const sqlInsertSubscription = (data) => {
    return `
      INSERT INTO subscription(clinic_id, bank_id, payment_date, amount, type, transfer_from, transfer_from_account_holder, transfer_from_account_number, subscription_start, subscription_end)
      VALUES(${data.clinicID}, ${data.bankID}, '${data.paymentDate}', ${data.amount}, '${data.type}', '${data.transferFrom}', '${data.transferFromAccountHolder}', '${data.transferFromAccountNumber}', '${data.subscriptionStart}', '${data.subscriptionEnd}')
      RETURNING id`;
  };

  before((done) => {
    db.one(sqlInsertBank)
    .then((data) => {
      currBankID = data.id;
      return db.one(sqlInsertClinic);
    })
    .then((data) => {
      currClinicID = data.id;
      return db.one(sqlInsertSubscription({
        clinicID: currClinicID,
        bankID: currBankID,
        paymentDate: '2017-01-01',
        amount: 100000,
        type: 'new',
        transferFrom: 'ucok',
        transferFromAccountHolder: 'ucok',
        transferFromAccountNumber: 123,
        subscriptionStart: '2017-01-01',
        subscriptionEnd: '2017-02-01',
      }));
    })
    .then((data) => {
      currSubscriptionID = data.id;
      return db.any(sqlInsertSubscription({
        clinicID: currClinicID,
        bankID: currBankID,
        paymentDate: '2017-01-05',
        amount: 200000,
        type: 'new',
        transferFrom: 'baba',
        transferFromAccountHolder: 'baba',
        transferFromAccountNumber: 321,
        subscriptionStart: '2017-01-05',
        subscriptionEnd: '2017-02-05',
      }));
    })
    .then(_ => done());
  });

  // make sure to clean test DB after all test cases done
  after((done) => {
    db.none('DELETE FROM bank')
    .then(_ => db.none('DELETE FROM clinic'))
    .then(_ => db.none('DELETE FROM subscription'))
    .then(_ => done());
  });

  describe('GET /api/v1/subscription', () => {
    it('should retrieve all subscription', (done) => {
      chai.request(app)
      .get('/api/v1/subscription')
      .then((res) => {
        const r = res.body;
        const validSubscription = [
          { paymentDate: '2017-01-01', amount: 100000, transferFrom: 'ucok', transferFromAccountHolder: 'ucok', transferFromAccountNumber: 123, subscriptionStart: '2017-01-01', subscriptionEnd: '2017-02-01' },
          { paymentDate: '2017-01-05', amount: 200000, transferFrom: 'baba', transferFromAccountHolder: 'baba', transferFromAccountNumber: 321, subscriptionStart: '2017-01-05', subscriptionEnd: '2017-02-05' },
        ];

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved all subscription data');

        r.data.forEach((subscription, i) => {
          expect(subscription['amount']).to.equal(validSubscription[i].amount);
          expect(subscription['transfer_from']).to.equal(validSubscription[i].transferFrom);
          expect(subscription['transfer_from_account_holder']).to.equal(validSubscription[i].transferFromAccountHolder);
          expect(subscription['transfer_from_account_number']).to.equal(validSubscription[i].transferFromAccountNumber);

          if (i === r.data.length - 1) done();
        });
      });
    });
  });

  describe('GET /api/v1/subscription/:id', () => {
    it('should retrieve single subscription', (done) => {
      chai.request(app)
      .get(`/api/v1/subscription/${currSubscriptionID}`)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');
        expect(r.message).to.equal('Retrieved one subscription');

        expect(r.data['amount']).to.equal(100000);
        expect(r.data['transfer_from']).to.equal('ucok');
        expect(r.data['transfer_from_account_holder']).to.equal('ucok');
        expect(r.data['transfer_from_account_number']).to.equal(123);
        done();
      });
    });

    it('should return 404 for invalid subscriptionID', (done) => {
      const invalidSubscriptionID = currSubscriptionID + 999;

      chai.request(app)
      .get(`/api/v1/subscription/${invalidSubscriptionID}`)
      .then((_) => {}, (err) => {
        const data = err.response.body;

        expect(err.status).to.equal(404);
        expect(data.status).to.equal('error');
        expect(data.message).to.equal('No subscription data found');

        done();
      });
    });
  });

  describe('POST /api/v1/subscription', () => {
    const countRow = (table) => {
      return db.one(`SELECT COUNT(*) FROM ${table}`);
    };

    it('should insert new subscription', (done) => {
      const validRequest = {
        clinic_id: currClinicID,
        bank_id: currBankID,
        payment_date: '2017-01-01',
        amount: 100000,
        type: 'new',
        transfer_from: 'ucok',
        transfer_from_account_holder: 'ucok',
        transfer_from_account_number: 123,
        subscription_start: '2017-01-01',
        subscription_end: '2017-02-01',
      };

      chai.request(app)
      .post('/api/v1/subscription')
      .send(validRequest)
      .then((res) => {
        const r = res.body;

        expect(res.status).to.equal(200);
        expect(r.status).to.equal('success');

        expect(r.data['amount']).to.equal(100000);
        expect(r.data['transfer_from']).to.equal('ucok');
        expect(r.data['transfer_from_account_holder']).to.equal('ucok');
        expect(r.data['transfer_from_account_number']).to.equal(123);

        countRow('subscription').then((row) => {
          expect(parseInt(row.count, 10)).to.equal(3);
          done();
        });
      });
    });

    it('should return 400 for missing parameters', (done) => {
      const invalidRequests = [
        {},
        { transfer_from: 'foo bar' },
        { amount: 333 },
      ];

      invalidRequests.forEach((req, i) => {
        chai.request(app)
        .post('/api/v1/subscription')
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
