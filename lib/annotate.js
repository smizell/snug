var lodash = require('lodash');

module.exports = function(config) {
  config = config || {};

  // A way to kind of curry the annotation function
  if (!config.fn) {
    var annotation = function(fn) {
      config.fn = fn;
      return wrapper(config);
    }

    // Provide access to provide config object
    annotation.$config = config;

    annotation.extend = function(newConfig) {
      lodash.extend(config, newConfig);
    }

    return annotation;
  }

  return wrapper(config);
};

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

  annotatedFn.extend = function(newConfig) {
    lodash.extend(config, newConfig);
  }

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
