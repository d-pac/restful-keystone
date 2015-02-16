"use strict";

var debug = require( "debug" )( "keystone-restful:retrieve" );
var errors = require( "errors" );

module.exports = function( list,
                           config,
                           entry ){
  return {
    handle : function( req,
                       res,
                       next ){
      debug( req.param( "id" ), config );
      var q = list.model
        .findById( req.param( "id" ), config.select, config );
      if( config.populate ){
        q.populate( config.populate );
      }
      q.exec()
        .then( function( result ){
          if( !result ){
            throw new errors.Http404Error();
          }

          return result;
        } )
        .then( function( item ){
          var result = (item.toJSON)
            ? item.toJSON()
            : item;
          if( config.envelop ){
            var temp = {};
            temp[ config.envelop ] = result;
            result = temp;
          }
          res.send( 200, result );
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "get",
    url    : entry + "/:id"
  }
};
