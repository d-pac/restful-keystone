'use strict';
var debug = require( "debug" );
var _ = require( "lodash" );
var deepMerge = require( "deepmerge" );
var constants = require( "./constants" );

var utils = require( "./utils" );

var beforeHandlers = {};
var afterHandlers = {};
var exposed = {};

module.exports = function( keystone,
                           config ){
  config = _.defaults( {}, config, {
    root : "/api"
  } );

  var instance = {};

  instance.before = function( methods,
                              beforeConfig ){
    beforeHandlers = deepMerge( beforeHandlers, utils.parseMiddlewareConfig( methods, beforeConfig ) );
    return instance;
  };

  instance.expose = function( exposureConfig ){
    exposed = deepMerge( exposed, utils.exposeLists( keystone, {
      root      : config.root,
      resources : exposureConfig || {}
    } ) );
    return instance;
  };

  instance.after = function( methods,
                             afterConfig ){
    afterHandlers = deepMerge( afterHandlers, utils.parseMiddlewareConfig( methods, afterConfig ) );
    return instance;
  };

  instance.start = function(){
    _.each( exposed, function( listConfig,
                               listName ){
      _.each( listConfig, function( methodConfig,
                                    methodName ){
        var handlers;
        if( beforeHandlers[ listName ] && beforeHandlers[ listName ][ methodName ] ){
          handlers = beforeHandlers[ listName ][ methodName ];
        } else {
          handlers = [];
        }
        handlers = handlers.concat( methodConfig.handle );
        if( afterHandlers[ listName ] && afterHandlers[ listName ][ methodName ] ){
          handlers = handlers.concat( afterHandlers[ listName ][ methodName ] );
        } else {
          handlers = handlers.concat( function( req,
                                                res,
                                                next ){
            return res.status( res.locals.status ).send( res.locals.body );
          } );
        }

        keystone.app[ methodConfig.verb ]( methodConfig.url, handlers );
      } );
    } );
  };

  return instance;
};
