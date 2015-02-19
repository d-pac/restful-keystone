"use strict";

var debug = require( "debug" )( "restful-keystone:list" );
var _ = require( "lodash" );
var errors = require( "errors" );
var retrieve = require( "./retrieve" );
var handleResult = require( "../utils" ).handleResult;

module.exports = function( list,
                           config,
                           entry ){
  config = _.defaults( {
    name : list.path
  }, config );
  return {
    handle : function( req,
                       res,
                       next ){
      debug( config );
      var id = req.param( "id" );
      if( id ){
        return retrieve( list, config, entry ).handle( req, res, next );
      }
      var filter = req.param( "filter" );
      if( _.isString( filter ) ){
        filter = JSON.parse( filter );
      }
      filter = _.defaults( config.filter, filter );
      list.model.find( filter, config.show, config )
        .exec()
        .then( function( result ){
          result = handleResult( result || [], config );
          res.locals.body = result;
          res.locals.status = 200;
          next();
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "get",
    url    : entry
  };
};
