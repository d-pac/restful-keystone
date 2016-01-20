"use strict";

var debug = require( "debug" )( "restful-keystone" );
var _ = require( "lodash" );
var deepMerge = require( "deepmerge" );
var errors = require( "errors" );
var retrieve = require( "./retrieve" );
var utils = require( "../utils" );
var handleResult = utils.handleResult;
var getId = utils.getId;

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
      debug( "LIST", config.name );
      var id = getId( req );
      if( id ){
        return retrieve( list, config, entry ).handle( req, res, next );
      }
      var filter = req.query[ "filter" ] || req.body[ "filter" ];
      if( _.isString( filter ) ){
        try{
          filter = JSON.parse( filter );
        } catch( err ) {
          return next( new errors.Http400Error( {
            explanation : "Invalid JSON in query string parameter 'filter'"
          } ) );
        }
      }
      if( _.isFunction( config.filter ) ){
        config.filter = config.filter();
      }
      if ( _.isArray( config.populate )
        && 0 < config.populate.length
        && _.isObject( config.populate[0] )
      ) {
        config.populate = [ config.populate ];
      }
      filter = deepMerge( config.filter, filter || {} );

      // Ensure limit and skip are per request!
      var tempConfig = {};
      var tempLimit = parseInt( req.query.limit ) || config.limit || null;
      var tempSkip = parseInt( req.query.skip ) || config.skip || 0;

      // Only apply limit if specified
      if ( null !== tempLimit ) {
        tempConfig.limit = tempLimit;
        tempConfig.skip  = tempSkip;
      }

      list.model.find( filter, config.show, deepMerge( config, tempConfig ) )
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
