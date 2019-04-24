const chai = require('chai');
const assert = chai.assert;

const convertHSL = require('../../../lib/utils/convertHSLtoDecimal.js');

describe('SmartThings utilities : convert HSL to Decimal', function () {

  it('Convert RED', (done) => {
    const hsl = [0, 100, 50];
    const expected = 16711680;

    const result = convertHSL(hsl[0], hsl[1], hsl[2]);
    assert.equal(result, expected, 'Converted value is invalid');
    done();
  });

  it('Convert GREEN', (done) => {
    const hsl = [32.5, 86, 50];
    const expected = 1961234;

    const result = convertHSL(hsl[0], hsl[1], hsl[2]);
    assert.equal(result, expected, 'Converted value is invalid');
    done();
  });
});