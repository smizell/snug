var expect = require('chai').expect;
var lodash = require('lodash');

var patternMatch = require('../lib/index').patternMatch;

describe('Pattern Match', function() {
  context('when a catch function is not provided', function() {
    var fn;

    before(function() {
      fn = patternMatch([
        {
          inputs: [lodash.isNumber],
          fn: function(num) { return num + 1; }
        },
        {
          inputs: [lodash.isString],
          fn: function(name) { return 'Hello, ' + name; }
        }
      ])
    });

    context('when a match is found', function() {
      it('returns the functions value', function() {
        expect(fn(5)).to.equal(6);
        expect(fn('John')).to.equal('Hello, John');
      });
    });

    context('when a match is not found', function() {
      it('throws an error', function() {
        expect(function() {
          fn(true);
        }).to.throw('No pattern match found')
      });
    });
  });

  context('when a catch function is provided', function() {
    var fn;

    before(function() {
      fn = patternMatch([
        {
          inputs: [lodash.isNumber],
          fn: function(num) { return num + 1; }
        },
        {
          inputs: [lodash.isString],
          fn: function(name) { return 'Hello, ' + name; }
        }
      ]).extend({
        catch: function(error) {
          return 'Catch function called';
        }
      });
    });

    context('when a match is not found', function() {
      it('returns the correct value', function() {
        expect(fn(true)).to.equal('Catch function called');
      });
    });
  });
});
