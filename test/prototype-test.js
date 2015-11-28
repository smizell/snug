var expect = require('chai').expect;
var lodash = require('lodash');

var annotate = require('../lib/index').annotate;

describe('Prototype Test', function() {
  var MyFunction;

  before(function() {
    MyFunction = function(a) {
      this.a = a;
    };

    MyFunction.prototype.add = function() {
      return annotate({
       inputs: [lodash.isNumber],
       outputs: [lodash.isNumber],
       fn: function(b) {
         return this.a + b;
       }
     }).apply(this, arguments);
    }
  });

  it('returns the correct value', function() {
    var myFn = new MyFunction(1);
    expect(myFn.add(2)).to.equal(3);
  });
});
