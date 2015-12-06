var lodash = require('lodash');

exports.and = function(checks) {
  return function(value) {
    for (var i = 0; i < checks.length; i++) {
      var check = checks[i];
      if (!check(value)) {
        return false;
      }
    }

    return true;
  }
};

exports.or = function(checks) {
  return function(value) {
    for (var i = 0; i < checks.length; i++) {
      var check = checks[i];
      if (check(value)) {
        return true;
      }
    }

    return false;
  }
};

exports.nor = function(checks) {
  return function(value) {
    for (var i = 0; i < checks.length; i++) {
      var check = checks[i];
      if (check(value)) {
        return false;
      }
    }

    return true;
  }
};

exports.wildcard = function() {
  return function() { return true; }
}

exports.optional = function(check) {
  return function(value) {
    if (value === undefined) {
      return true;
    }

    if (check(value)) {
      return true;
    }

    return false;
  }
}

exports.equalLengthWith = function(array1) {
  return function(array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    return true;
  }
}

exports.not = function(check) {
  return function(value) {
    return !check(value);
  }
}

exports.equals = function(value1) {
  return function(value2) {
    return lodash.isEqual(value1, value2);
  }
}
