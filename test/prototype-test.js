var expect = require('chai').expect;
var lodash = require('lodash');

var annotate = require('../lib/index').annotate;
var create = require('../lib/index').create;

describe('Prototype Test', function() {
  var MyFunction;

  before(function() {
    MyFunction = create({
      constructor: {
        fn: function(a) {
          this.a = a;
        }
      },

      add: {
        inputs: [lodash.isNumber],
        outputs: [lodash.isNumber],
        fn: function(b) {
          return this.a + b;
        }
      }
    });
  });

  it('returns the correct value', function() {
    var myFn = new MyFunction(1);
    expect(myFn.add(2)).to.equal(3);
  });
});
