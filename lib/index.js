// ----------------------------------------
// Annote a function

exports.annotate = function(config) {
  // A way to kind of curry the annotation function
  if (!config.fn) {
    return function(fn) {
      config.fn = fn;
      return wrapper(config);
    }
  }

  return wrapper(config);
};

// ----------------------------------------
// Basic logic checks

exports.logic = {};

exports.logic.and = function(checks) {
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

exports.logic.or = function(checks) {
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

exports.logic.nor = function(checks) {
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

exports.logic.wildcard = function() {
  return function() { return true; }
}

exports.logic.each = function(check) {
  return function(value) {
    // It must be an array to use each
    if (value.constructor !== Array) {
      return false;
    }

    for (var i = 0; i < value.length; i++) {
      if (!check(value[i])) {
        return false;
      }
    }

    return true;
  }
}

// ----------------------------------------
// Private helpers

function wrapper(config) {
  return function() {
    var result;

    if (config.catch) {
      try {
        result = caller(config).apply(this, arguments);
      } catch (error) {
        result = config.catch(error);
      }
    } else {
      result = caller(config).apply(this, arguments);
    }

    return result;
  };
}

function caller(config) {
  return function() {
    if (config.inputs) {
      if (arguments.length !== config.inputs.length) {
        throw new TypeError('Incorrect number of arguments');
      }

      for (var i = 0; i < arguments.length; i++) {
        var check = config.inputs[i];
        var argument = arguments[i];

        if (!check(argument)) {
          throw new TypeError('Incorrect type for argument ' + i);
        }
      }
    }

    // Finally let's call the provided function
    var result = config.fn.apply(this, arguments);

    if (config.outputs) {
      // Though we use an array, we only support one output
      var outputCheck = config.outputs[0];

      if (!outputCheck(result)) {
        throw new TypeError('Output of incorrect type');
      }
    }

    return result;
  }
}
