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

  describe('#optional', function() {
    var check = logic.optional(lodash.isNumber);

    context('when given a valid value', function() {
      it('returns true', function() {
        expect(check(4)).to.be.true;
      });
    });

    context('when given an invalid value', function() {
      it('returns false', function() {
        expect(check('foobar')).to.be.false;
      });
    });

    context('when not given a value', function() {
      it('returns true', function() {
        expect(check(undefined)).to.be.true;
      });
    });
  });

  describe('#not', function() {
    var check = logic.not(lodash.isArray);

    context('when given a valid value', function() {
      it('returns true', function() {
        expect(check(4)).to.be.true;
      });
    });

    context('when given an invalid value', function() {
      it('returns false', function() {
        expect(check([1, 2])).to.be.false;
      });
    });
  });

  describe('#equals', function() {
    var check = logic.equals([1, 2, 3]);

    context('when given a valid value', function() {
      it('returns true', function() {
        expect(check([1, 2, 3])).to.be.true;
      });
    });

    context('when given an invalid value', function() {
      it('returns false', function() {
        expect(check([1, 2])).to.be.false;
      });
    });
  });
});
