"use strict";
var debug = require( "debug" )( "restful-keystone:remove" );
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
      var id = req.param( "id" );
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
