"use strict";
var debug = require( "debug" )( "keystone-restful:update" );
var P = require( "bluebird" );
var errors = require( "errors" );
var deepExtend = require( "deep-extend" );
var handleResult = require( "../handleResult" );
var _ = require( "lodash" );

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
        .findById( req.param( "id" ), config.show, config )
        .exec()
        .then( function( result ){
          if( !result ){
            throw new errors.Http404Error();
          }
          deepExtend( result, req.body || req.params );
          return P.promisify( result.save, result )();
        } )
        .then( function( params ){
          var result = params[ 0 ]; //params[1]=number of affected
          result = handleResult( result, config );
          res.send( 200, result );
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "patch",
    url    : entry + "/:id"
  };
};
