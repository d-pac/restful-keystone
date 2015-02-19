"use strict";
var _ = require( "lodash" );

module.exports = {
  methods : {
    retrieve : _.noop,
    remove   : _.noop
  },
  config  : {
    test1 : true,
    test2 : true
  }
};

module.exports.expected = {
  test1 : {
    retrieve : [ _.noop ],
    remove   : [ _.noop ]
  },
  test2 : {
    retrieve : [ _.noop ],
    remove   : [ _.noop ]
  }
};
