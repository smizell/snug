exports.compareArray = function(checks) {
  return function(items) {
    for (var i = 0; i < checks.length; i++) {
      var check = checks[i];
      var item = items[i];

      if (!check(item)) {
        throw new TypeError('Incorrect type for argument ' + i);
      }
    }

    return true;
  }
}
