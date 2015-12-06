var lodash = require('lodash');

module.exports = annotate = function(config) {
  config = config || {};

  // A way to kind of curry the annotation function
  if (!config.fn) {
    var annotation = function(fn) {
      config.fn = fn;
      return wrapper(config);
    }

    return withPublicMethods(annotation, config);
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

  return withPublicMethods(annotatedFn, config);
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

function withPublicMethods(annotatedFn, config) {
  // Attach config so that we can access it
  annotatedFn.$config = config;

  // For creating a new annotation from the current one
  annotatedFn.extend = extendWrapper(config);

  return annotatedFn;
}

function extendWrapper(config) {
  return function(newConfig) {
    // Instead of mutating the original config, we create a new annotation
    return annotate(
      lodash.extend(lodash.cloneDeep(config), newConfig)
    );
  }
}
