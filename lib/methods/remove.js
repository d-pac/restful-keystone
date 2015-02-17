"use strict";
var debug = require( "debug" )( "keystone-restful:remove" );
var P = require( "bluebird" );
var errors = require( "errors" );

module.exports = function( list,
                           config,
                           entry ){
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

          return P.promisify( result.remove, result )();
        } )
        .then( function( result ){
          res.send( 204 );
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "delete",
    url    : entry + "/:id"
  };
};
