var lodash = require('lodash');

var utils = require('./utils');

// Main interface to this library
module.exports = {
  annotate: require('./annotate'),
  logic: require('./logic'),
  patternMatch: require('./pattern-match'),
  structures: require('./structures'),
  create: require('./create')
}
