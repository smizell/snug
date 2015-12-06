var annotate = require('./annotate');

module.exports = function(obj) {
  var BaseFn = function() {
    return annotate(obj.constructor).apply(this, arguments);
  }

  Object.keys(obj).forEach(function(key) {
    if (key !== 'constructor') {
      BaseFn.prototype[key] = function() {
        return annotate(obj[key]).apply(this, arguments);
      }
    }
  });

  return BaseFn;
}
