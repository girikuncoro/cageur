const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mockery = require('mockery');

describe('Message Send Worker Test', () => {
  describe('Process task module', () => {
    let workerModule, sendTextStub, sendTextSpy;

    before(() => {
      // mocking line API
      sendTextSpy = sinon.spy();
      const lineStub = { sendText: sendTextSpy };
      mockery.enable();
      mockery.warnOnUnregistered(false);
      mockery.registerMock('../../util/line', lineStub);

      workerModule = require('../../../app/api/message/send-worker');
    });

    afterEach(() => sendTextSpy.reset());

    after(() => {
      mockery.deregisterAll();
      mockery.disable();
    });

    it('should successfully process single user id', () => {
      const singleData = [{ lineUserId: 'ucok123', body: 'hello ucok' }];

      workerModule(singleData);
      expect(sendTextSpy.calledOnce).to.be.true;

      const data = singleData[0];
      expect(sendTextSpy.calledWith(data.lineUserId, data.body)).to.be.true;
    });

    it('should successfully process multiple user ids', () => {
      const multipleData = [
        { lineUserId: 'ucok123', body: 'hello ucok' },
        { lineUserId: 'budi456', body: 'hello budi' },
        { lineUserId: 'bambang789', body: 'hello bambang' },
      ];

      workerModule(multipleData);
      expect(sendTextSpy.callCount).to.be.equal(3);

      let spyCall;
      multipleData.forEach((data, i) => {
        spyCall = sendTextSpy.getCall(i);
        expect(spyCall.calledWith(data.lineUserId, data.body)).to.be.true;
      });
    });
  });
});
