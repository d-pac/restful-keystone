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
      retrieve : f1
    },
    test2 : {
      update : f2
    }
  }
};

module.exports.expected = {
  test1 : {
    retrieve : [ f1 ],
    remove   : [ _.noop ]
  },
  test2 : {
    retrieve : [ _.noop ],
    remove   : [ _.noop ],
    update   : [ f2 ]
  }
};
