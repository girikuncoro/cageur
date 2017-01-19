/* eslint-disable no-unused-expressions, arrow-body-style */
const chai = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');

const expect = chai.expect;
chai.use(require('chai-http'));

const IncomingMessage = require('../../../app/model/message');
const response = require('../../../app/model/message-response');
const db = require('../../../app/config/db');

describe('Incoming Message Test', () => {
  describe('Process message response', () => {
    let handlerModule;
    let sendTextSpy;

    const lineRequest = (from, type, text) => {
      return {
        events: [
          {
            type,
            replyToken: '123',
            source: { userId: from, type: 'user' },
            timestamp: 1484559637374,
            message: { type: 'text', id: '213', text },
          },
        ],
      };
    };

    before((done) => {
      // mocking line API
      sendTextSpy = sinon.spy();
      const lineStub = { sendText: sendTextSpy };
      mockery.enable({ useCleanCache: true });
      mockery.warnOnUnregistered(false);
      mockery.registerMock('../../util/line', lineStub);

      handlerModule = require('../../../app/api/message/incoming-controller');

      const insertClinic = db.one(`
        INSERT INTO clinic(name)
        VALUES('klinik 1')
        RETURNING id
      `);

      const insertPatient = (clinicID) => {
        return db.one(`
          INSERT INTO patient(phone_number, first_name, clinic_id)
          VALUES('111122223333', 'ucok', ${clinicID})
          RETURNING id
        `);
      };

      const insertPatientExist = (clinicID) => {
        return db.one(`
          INSERT INTO patient(phone_number, first_name, clinic_id, line_user_id)
          VALUES('999988887777', 'baba', ${clinicID}, 'baba123')
          RETURNING id
        `);
      };

      insertClinic.then((data) => {
        return insertPatient(data.id)
          .then(insertPatientExist(data.id));
      })
      .then(_ => done());
    });

    afterEach(() => sendTextSpy.reset());

    after(() => {
      mockery.deregisterAll();
      mockery.disable();
    });

    it('should send phoneTypo error as response', (done) => {
      const req = lineRequest('lala321', 'message', 'random');
      const message = new IncomingMessage(req);

      handlerModule(message)
      .then((_) => {
        expect(sendTextSpy.calledOnce).to.be.true;
        expect(sendTextSpy.calledWith('lala321', response.phoneTypo)).to.be.true;
        done();
      });
    });

    it('should send exist error as response', (done) => {
      const req = lineRequest('baba123', 'message', 'random');
      const message = new IncomingMessage(req);

      handlerModule(message)
      .then((_) => {
        expect(sendTextSpy.calledOnce).to.be.true;
        expect(sendTextSpy.calledWith('baba123', response.exist)).to.be.true;
        done();
      });
    });

    it('should send failure error as response', (done) => {
      const req = lineRequest('lala321', 'message', '12345678901');
      const message = new IncomingMessage(req);

      handlerModule(message)
      .then((_) => {
        expect(sendTextSpy.calledOnce).to.be.true;
        expect(sendTextSpy.calledWith('lala321', response.phoneFailed)).to.be.true;
        done();
      });
    });

    it('should send successful response', (done) => {
      const req = lineRequest('lala321', 'message', '111122223333');
      const message = new IncomingMessage(req);

      handlerModule(message)
      .then((_) => {
        expect(sendTextSpy.calledOnce).to.be.true;
        expect(sendTextSpy.calledWith('lala321', response.phoneSucceed)).to.be.true;
        done();
      });
    });

    it('should send greeting response', (done) => {
      const addRequest = {
        events: [
          {
            type: 'follow',
            replyToken: '123',
            source: { userId: 'lala321', type: 'user' },
            timestamp: 1484559637374,
          },
        ],
      };

      const message = new IncomingMessage(addRequest);

      handlerModule(message)
      .then((_) => {
        expect(sendTextSpy.calledOnce).to.be.true;
        expect(sendTextSpy.calledWith('lala321', response.addFriend)).to.be.true;
        done();
      });
    });
  });
});
