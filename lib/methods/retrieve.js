"use strict";

var debug = require( "debug" )( "restful-keystone" );
var errors = require( "errors" );
var _ = require( "lodash" );
var utils = require( "../utils" );
var getId = utils.getId;
var handleResult = utils.handleResult;

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
      var id = getId( req );
      debug( "RETRIEVE", config.name, id );
      var q = list.model
        .findById( id, config.show, config.options );
      if( config.populate ){
        q = q.populate( config.populate );
      }
      q.exec()
        .then( function( result ){
          if( !result ){
            throw new errors.Http404Error( {
              explanation : "Resource not found with id " + id
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
    verb   : "get",
    url    : entry + "/:id"
  };
};
