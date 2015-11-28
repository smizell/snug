var expect = require('chai').expect;
var lodash = require('lodash');

var logic = require('../lib/index').logic;

describe('Logic', function() {
  describe('#and', function() {
    context('when given all true functions', function() {
      it('returns true', function() {
        var check = logic.and([
          lodash.isString,
          lodash.isString
        ]);

        expect(check('foobar')).to.be.true;
      });
    });

    context('when given at least one false function', function() {
      it('returns false', function() {
        var check = logic.and([
          lodash.isString,
          lodash.isNumber
        ]);

        expect(check('foobar')).to.be.false;
      });
    });
  });

  describe('#or', function() {
    context('when given all true functions', function() {
      it('returns true', function() {
        var check = logic.or([
          lodash.isString,
          lodash.isString
        ]);

        expect(check('foobar')).to.be.true;
      });
    });

    context('when given at least one true function', function() {
      it('returns false', function() {
        var check = logic.or([
          lodash.isString,
          lodash.isNumber
        ]);

        expect(check('foobar')).to.be.true;
      });
    });

    context('when given all false function', function() {
      it('returns false', function() {
        var check = logic.or([
          lodash.isBoolean,
          lodash.isNumber
        ]);

        expect(check('foobar')).to.be.false;
      });
    });
  });

  describe('#nor', function() {
    context('when given all false functions', function() {
      it('returns true', function() {
        var check = logic.nor([
          lodash.isBoolean,
          lodash.isNumber
        ]);

        expect(check('foobar')).to.be.true;
      });
    });

    context('when given at least one true function', function() {
      it('returns false', function() {
        var check = logic.nor([
          lodash.isString,
          lodash.isNumber
        ]);

        expect(check('foobar')).to.be.false;
      });
    });
  });

  describe('#wildcard', function() {
    context('when given any value', function() {
      it('returns true', function() {
        var check = logic.wildcard();

        expect(check('foobar')).to.be.true;
      });
    });
  });
});
