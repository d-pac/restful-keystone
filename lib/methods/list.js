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
      var options = _.cloneDeep( config );
      var populateMulti = false;
      if (_.isArray( options.populate ) ) {
        populateMulti = options.populate;
        delete options.populate;
      }
      filter = deepMerge( options.filter, filter || {} );
      if ( req.query.limit || options.limit ) {
        options.limit =  parseInt( req.query.limit ) || options.limit;
        options.skip = parseInt( req.query.skip ) || options.skip || 0;
      }
      var result = list.model.find( filter, config.show, options );
      if ( populateMulti ) {
        _.forEach( populateMulti, function( v ) {
          result.populate( v );
        });
      }
      result.exec()
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
