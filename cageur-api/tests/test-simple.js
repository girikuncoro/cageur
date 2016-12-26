const chai = require('chai');
const assert = chai.assert;

describe('Cageur dummy test', () => {

  describe('GET /', () => {
    it('should give hello', () => {
      assert.equal('hello', 'hello');
    });
  });
});
