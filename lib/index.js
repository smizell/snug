// ----------------------------------------
// Annote a function

exports.annotate = function(config) {
  config = config || {};

  // A way to kind of curry the annotation function
  if (!config.fn) {
    var annotation = function(fn) {
      config.fn = fn;
      return wrapper(config);
    }

    // Provide access to provide config object
    annotation.$config = config;

    return annotation;
  }

  return wrapper(config);
};

// ----------------------------------------
// Pattern Match

exports.patternMatch = function(patterns, catchFn) {
  var config = {
    fn: function() {
      for (var i = 0; i < patterns.length; i++) {
        var pattern = patterns[i];
        var passed = argumentCheck(pattern.inputs, arguments);

        if (passed) {
          return exports.annotate(pattern).apply(null, arguments);
        }
      }

      throw new Error('No pattern match found');
    }
  };

  if (catchFn) {
    config.catch = catchFn;
  }

  return exports.annotate(config);
};

// ----------------------------------------
// Structures

exports.structures = {};

exports.structures.typedArray = function(check) {
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
};

exports.structures.object = function(checkObj) {
  return function(value) {
    if (value === null || typeof value !== 'object') {
      return false;
    }

    var keys = Object.keys(checkObj);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var check = checkObj[key];
      if (!check(value[key])) {
        return false;
      }
    }

    return true;
  }
}

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

exports.logic.optional = function(check) {
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

// ----------------------------------------
// Create an object

exports.create = function(obj) {
  var BaseFn = function() {
    return exports.annotate(obj.constructor).apply(this, arguments);
  }

  Object.keys(obj).forEach(function(key) {
    if (key !== 'constructor') {
      BaseFn.prototype[key] = function() {
        return exports.annotate(obj[key]).apply(this, arguments);
      }
    }
  });

  return BaseFn;
}

// ----------------------------------------
// Private helpers

function wrapper(config) {
  var annotatedFn = function() {
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

  // Attach config so that we can access it
  annotatedFn.$config = config;

  return annotatedFn;
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

function argumentCheck(checks, arguments) {
  // Check to see if arguments match
  for (var i = 0; i < arguments.length; i++) {
    var check = checks[i];
    var argument = arguments[i];

    if (!check(argument)) {
      return false;
    }
  }

  return true;
}
