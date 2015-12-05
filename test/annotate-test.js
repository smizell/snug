var expect = require('chai').expect;
var lodash = require('lodash');

var annotate = require('../lib/index').annotate;

describe('Annotate', function() {
  context('when setting up a valid function', function() {
    var sum = annotate({
      inputs: [lodash.isNumber, lodash.isNumber],
      outputs: [lodash.isNumber],
      fn: function(a, b) {
        return a + b;
      }
    });

    it('makes the `$config` available', function() {
      expect(sum.$config.inputs).to.be.defined;
    });

    context('when given the correct values', function() {
      it('returns the results', function() {
        expect(sum(3, 4)).to.equal(7);
      });
    });

    context('when given incorrect values', function() {
      it('throws a TypeError', function() {
        expect(function() {
          sum('a', 'b');
        }).to.throw(TypeError);
      })
    });

    context('when given the incorrect number of arguments', function() {
      it('throws a TypeError', function() {
        expect(function() {
          sum(3);
        }).to.throw(TypeError);
      });
    });
  });

  context('when a function is not provided', function() {
    var sumAnnotation = annotate({
      inputs: [lodash.isNumber, lodash.isNumber],
      outputs: [lodash.isNumber]
    });

    it('makes the `$config` available', function() {
      expect(sumAnnotation.$config.inputs).to.be.defined;
    });

    it('accepts a function to annotate', function() {
      var sum = sumAnnotation(function(a, b) {
        return a + b;
      });

      expect(sum(3, 4)).to.equal(7);
    });
  });

  context('when setting up an invalid function', function() {
    var sum = annotate({
      inputs: [lodash.isNumber, lodash.isNumber],
      outputs: [lodash.isNumber],
      fn: function(a, b) {
        return 'foobar';
      }
    });

    it('throws a TypeError', function() {
      expect(function() {
        sum(3, 4);
      }).to.throw(TypeError);
    });
  });

  context('when setting up a function without input types', function() {
    var sum = annotate({
      fn: function(a, b) {
        return a + b;
      }
    });

    it('returns the results', function() {
      expect(sum('a', 'b')).to.equal('ab');
    });
  });

  context('when catching errors', function() {
    var sum = annotate({
      inputs: [lodash.isNumber, lodash.isNumber],
      outputs: [lodash.isNumber],
      fn: function(a, b) {
        return a + b;
      },
      catch: function(error) {
        return 0;
      }
    });

    it('should call the catch function', function() {
      expect(sum('a', 'b')).to.equal(0);
    });
  });
});
