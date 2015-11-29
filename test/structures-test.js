var expect = require('chai').expect;
var lodash = require('lodash');

var structures = require('../lib/index').structures;

describe('Structures', function() {
  describe('#typedArray', function() {
    var check = structures.typedArray(lodash.isNumber);

    context('when given a correct value', function() {
      it('returns true', function() {
        expect(check([1, 2, 3])).to.be.true;
      });
    });

    context('when given an incorrect value', function() {
      it('returns false', function() {
        expect(check([1, 2, 'a'])).to.be.false;
      });
    });

    context('when not given an array', function() {
      it('returns false', function() {
        expect(check(1)).to.be.false;
      });
    });
  });

  describe('#object', function() {
    var check = structures.object({
      foo: lodash.isNumber,
      bar: lodash.isBoolean
    });

    context('when given a correct value', function() {
      it('returns true', function() {
        expect(check({
          foo: 4,
          bar: true
        })).to.be.true;
      });
    });

    context('when given an incorrect value', function() {
      it('returns false', function() {
        expect(check({
          foo: 4,
          bar: 'true'
        })).to.be.false;
      });
    });

    context('when not given an object', function() {
      it('returns false', function() {
        expect(check(1)).to.be.false;
      });
    });
  });
});
