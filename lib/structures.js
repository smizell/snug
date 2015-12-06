var lodash = require('lodash');

var annotate = require('./annotate');
var logic = require('./logic');
var utils = require('./utils');

exports.typedArray = function(check) {
  return annotate({
    inputs: [lodash.isArray],
    fn: function(value) {
      for (var i = 0; i < value.length; i++) {
        if (!check(value[i])) {
          return false;
        }
      }

      return true;
    },
    catch: function(error) {
      return false;
    }
  });
};

exports.compareArray = function(checks) {
  return annotate({
    inputs: [
      logic.and([
        lodash.isArray,
        logic.equalLengthWith(checks)
      ])
    ],
    fn: utils.compareArray(checks),
    catch: function(error) {
      return false;
    }
  });
};

exports.object = function(checkObj) {
  return annotate({
    inputs: [
      logic.and([
        lodash.isObject,
        logic.not(lodash.isArray)
      ])
    ],
    fn: function(value) {
      var keys = Object.keys(checkObj);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var check = checkObj[key];
        if (!check(value[key])) {
          return false;
        }
      }

      return true;
    },
    catch: function(error) {
      return false;
    }
  });
}
