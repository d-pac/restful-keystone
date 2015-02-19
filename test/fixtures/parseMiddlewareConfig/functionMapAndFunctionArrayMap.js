"use strict";
var _ = require( "lodash" );

var f1 = function(){
};
var f2 = function(){
};

module.exports = {
  methods : {
    retrieve : _.noop,
    remove   : _.noop
  },
  config  : {
    test1 : {
      retrieve : [ _.noop ]
    },
    test2 : {
      update : [ _.noop ]
    }
  }
};

module.exports.expected = {
  test1 : {
    retrieve : [ _.noop ],
    remove   : [ _.noop ]
  },
  test2 : {
    retrieve : [ _.noop ],
    remove   : [ _.noop ],
    update   : [ _.noop ]
  }
};
