"use strict";
var debug = require( "debug" )( "restful-keystone" );
var P = require( "bluebird" );
var errors = require( "errors" );
var getId = require( "../utils" ).getId;

module.exports = function( list,
                           config,
                           entry ){
  return {
    handle : function( req,
                       res,
                       next ){
      var id = getId( req );
      debug( "REMOVE", config.name, id );
      list.model
        .findById( id, config.show, config )
        .exec()
        .then( function( result ){
          if( !result ){
            throw new errors.Http404Error( {
              explanation : "Resource not found with id " + id
            } );
          }

          return P.promisify( result.remove, result )();
        } )
        .then( function( result ){
          res.locals.status = 204;
          next();
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "delete",
    url    : entry + "/:id"
  };
};
