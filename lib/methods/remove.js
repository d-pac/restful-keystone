"use strict";

module.exports = function( list,
                           config ){
  return function( req,
                   res,
                   next ){
    res.send( 200, list.key );
  }
};
