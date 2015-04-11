"use strict";

module.exports = function( req ){
  return req.params[ "id" ] || req.query[ "id" ] || req.body[ "id" ]
};
