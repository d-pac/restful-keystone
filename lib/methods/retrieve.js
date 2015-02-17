"use strict";

var debug = require( "debug" )( "keystone-restful:retrieve" );
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
      debug( req.param( "id" ), config );
      var q = list.model
        .findById( req.param( "id" ), config.show, config.options );
      if( config.populate ){
        q = q.populate( config.populate );
      }
      q.exec()
        .then( function( result ){
          if( !result ){
            throw new errors.Http404Error();
          }
          result = handleResult( result, config );
          result = res.send( 200, result );
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "get",
    url    : entry + "/:id"
  }
};
