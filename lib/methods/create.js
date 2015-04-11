"use strict";
var debug = require( "debug" )( "restful-keystone" );
var errors = require( "errors" );
var _ = require( "lodash" );

var handleResult = require( "../utils/handleResult" );

module.exports = function( list,
                           config,
                           entry ){
  config = _.defaults( {
    name : list.singular.toLowerCase()
  }, config );
  return {
    handle : function( req,
                       res,
                       next ){
      var data = req.body || req.params;
      debug( "CREATE", config.name, data );
      list.model
        .create( data )
        .then( function( result ){
          if( !result ){
            throw new errors.Http500Error( {
              explanation : "Could not create document due to unforeseen error."
            } );
          }
          result = handleResult( result, config );
          res.locals.body = result;
          res.locals.status = 200;
          next();
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "post",
    url    : entry
  };
};
