"use strict";
var _ = require( "lodash" );

module.exports = {
  methods : [ "retrieve", "list" ],
  config  : {
    test1 : _.noop,
    test2 : _.noop
  }
};

module.exports.expected = {
  test1 : {
    retrieve : [ _.noop ],
    list     : [ _.noop ]
  },
  test2 : {
    retrieve : [ _.noop ],
    list     : [ _.noop ]
  }
};
