/*global describe, it */
'use strict';
var assert = require('assert');
var keystoneRestful = require('../');

describe('keystone-restful node module', function () {
  it('must have at least one test', function () {
    keystoneRestful();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
