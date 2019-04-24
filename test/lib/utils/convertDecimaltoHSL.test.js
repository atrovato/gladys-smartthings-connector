const chai = require('chai');
const assert = chai.assert;

const convertDecimal = require('../../../lib/utils/convertDecimaltoHSL.js');

describe('SmartThings utilities : convert Decimal to HSL', function () {

  it('Convert RED', (done) => {
    const decimal = 16711680;
    const expected = [0, 100, 50];

    const result = convertDecimal(decimal);
    assert.deepEqual(result, expected, 'Converted value is invalid');
    done();
  });

  it('Convert GREEN', (done) => {
    const decimal = 1961234;
    const expected = [32.5, 86, 50];

    const result = convertDecimal(decimal);
    assert.deepEqual(result, expected, 'Converted value is invalid');
    done();
  });
});