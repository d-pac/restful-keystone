'use strict';
var debug = require( "debug" );
var _ = require( "lodash" );
var path = require( "path" );

function log( obj ){
  var fs = require( "fs" );
  var util = require( "util" );
  fs.writeFileSync( "keystone.txt", util.inspect( obj, {
    showHidden : true,
    depth      : 1,
    colors     : false
  } ) );
}

function parseMixedValue( value,
                          defaultValue ){
  if( _.isUndefined( value ) ){
    value = true;
  }

  if( _.isArray( value ) ){
    value = value.join( " " );
  } else if( _.isBoolean( value ) ){
    value = (value)
      ? defaultValue
      : "";
  }

  if( !_.isString( value ) ){
    //todo: throw error?
  }
  return value
}

function parseConfig( list,
                      config ){

  if(config){
    config = _.defaults( {}, config );
    var fields = _.keys( list.fields ).join( " " );
    config.methods = parseMixedValue( config.methods, "list retrieve remove create update" );
    config.show = parseMixedValue( config.show, fields );
    config.edit = parseMixedValue( config.edit, fields );
    config.populate = parseMixedValue( config.populate, "" );
    config.envelop = parseMixedValue( config.envelop, "<%=name%>" );

    config.key = config.key || list.key;
    config.path = config.path || list.path;

    return config;
  }

  return {
    hidden: true
  };
}

module.exports = function( keystone,
                           config ){
  _.defaults( config, {
    root      : "/api",
    resources : {}
  } );
  //todo: throw error if keystone not supplied or lists not available
  _.each( keystone.lists, function( list,
                                    key ){
    var restConfig = parseConfig( list, config.resources[ key ] );
    if( !restConfig.hidden ){
      var entry = path.join( config.root, restConfig.path );
      var methods = restConfig.methods.split( " " );
      _.each( methods, function( methodName ){
        var method = require( "./lib/methods/" + methodName );
        var route = method( list, restConfig, entry );
        keystone.app[ route.verb ]( route.url, route.handle );
      } );
    }
  } );
  return function(){

  }
};
