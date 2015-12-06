var annotate = require('./annotate');
var utils = require('./utils');

module.exports = function(patterns, catchFn) {
  var config = {
    fn: function() {
      for (var i = 0; i < patterns.length; i++) {
        var pattern = patterns[i];
        var passed = annotate({
          fn: utils.compareArray(pattern.inputs),
          catch: function() {
            return false;
          }
        });

        if (passed(arguments)) {
          return annotate(pattern).apply(null, arguments);
        }
      }

      throw new Error('No pattern match found');
    }
  };

  if (catchFn) {
    config.catch = catchFn;
  }

  return annotate(config);
};
