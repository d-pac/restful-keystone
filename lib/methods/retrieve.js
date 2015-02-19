"use strict";

var debug = require( "debug" )( "restful-keystone:retrieve" );
var errors = require( "errors" );
var _ = require( "lodash" );

var handleResult = require( "../utils" ).handleResult;

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
          res.locals.body = result;
          res.locals.status = 200;
          next();
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "get",
    url    : entry + "/:id"
  };
};
