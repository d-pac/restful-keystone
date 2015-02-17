"use strict";

var debug = require( "debug" )( "keystone-restful:list" );
var _ = require( "lodash" );
var errors = require( "errors" );
var retrieve = require( "./retrieve" );
var handleResult = require( "../handleResult" );

module.exports = function( list,
                           config,
                           entry ){
  config = _.defaults( { name : list.path }, config );
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
          res.send( 200, result );
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "get",
    url    : entry
  }
};
