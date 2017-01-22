/* eslint-disable no-unused-expressions, arrow-body-style */
const chai = require('chai');
const mockery = require('mockery');

const expect = chai.expect;

describe('Message Send Worker Test', () => {
  describe('Process task module', () => {
    let workerModule;
    let sendTextSpy;

    before(() => {
      // mocking line API
      sendTextSpy = (lineUserId, body) => {
        return new Promise((resolve) => {
          expect(lineUserId).to.be.equal('ucok123');
          expect(body).to.be.equal('hello ucok');
          resolve(true);
        });
      };

      const lineStub = { sendText: sendTextSpy };
      mockery.enable();
      mockery.warnOnUnregistered(false);
      mockery.registerMock('../../util/line', lineStub);

      workerModule = require('../../../app/api/message/send-worker');
    });

    after(() => {
      mockery.deregisterAll();
      mockery.disable();
    });

    it('should successfully process single user id', () => {
      const singleData = [{ lineUserId: 'ucok123', body: 'hello ucok', sentMessageID: 1 }];

      workerModule(singleData);
    });

    it('should successfully process multiple user ids', () => {
      const multipleData = [
        { lineUserId: 'ucok123', body: 'hello ucok', sentMessageID: 1 },
        { lineUserId: 'ucok123', body: 'hello ucok', sentMessageID: 1 },
        { lineUserId: 'ucok123', body: 'hello ucok', sentMessageID: 1 },
      ];

      workerModule(multipleData);
    });
  });
});
