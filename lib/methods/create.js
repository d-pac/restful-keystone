"use strict";
var debug = require( "debug" )( "keystone-restful:create" );
var errors = require( "errors" );
var _ = require( "lodash" );

var handleResult = require( "../handleResult" );

module.exports = function( list,
                           config,
                           entry ){
  config = _.defaults( { name : list.singular.toLowerCase() }, config );
  return {
    handle : function( req,
                       res,
                       next ){
      debug( config );
      list.model
        .create( req.body || req.params )
        .then( function( result ){
          if( !result ){
            throw new errors.Http500Error();
          }
          result = handleResult( result, config );
          res.send( 200, result );
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "post",
    url    : entry
  }
};
