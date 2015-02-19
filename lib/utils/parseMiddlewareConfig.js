"use strict";
var _ = require( "lodash" );
var constants = require( "../constants" );

module.exports = function handleArgs( methods,
                                      middlewareConfig ){
  if( !middlewareConfig ){
    middlewareConfig = methods;
    methods = constants.METHODS_ALL;
  } else if( constants.SYMBOL_ALL === methods ){
    methods = constants.METHODS_ALL;
  }
  if( _.isString( methods ) ){
    methods = methods.split( " " );
  }
  if( _.isArray( methods ) ){
    var temp = {};
    _.each( methods, function( methodName ){
      temp[ methodName ] = methodName;
    } );
    methods = temp;
  }
  if( !_.isObject( methods ) ){
    throw new Error( "TODO: should be object" );
  }

  _.each( middlewareConfig, function( config,
                                      listName ){
    var middleware, realConfig = {};
    if( _.isFunction( config ) ){
      middleware = [ config ];
    } else if( _.isArray( config ) ){
      middleware = config;
    } else if( _.isObject( config ) ){
      _.each( config, function( middleware,
                                methodName ){
        if( _.isFunction( middleware ) ){
          middleware = [ middleware ];
        }
        realConfig[ methodName ] = middleware;
      } );
    }

    _.each( methods, function( mixed,
                               methodName ){
      if( !realConfig[ methodName ] ){
        if( _.isString( mixed ) ){
          mixed = middleware;
        } else if( _.isFunction( mixed ) ){
          mixed = [ mixed ];
        }
        realConfig[ methodName ] = mixed;
      }
    } );
    middlewareConfig[ listName ] = realConfig;
  } );
  return middlewareConfig;
};
