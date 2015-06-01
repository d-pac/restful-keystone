"use strict";
var parseConfig = require( "./parseListConfig" );
var _ = require( "lodash" );
var path = require( "path" );

module.exports = function exposeLists( keystone,
                                       config ){
  //todo: throw error if keystone not supplied or lists not available
  var output = {};
  _.each( keystone.lists, function( list,
                                    key ){
    var restConfig = parseConfig( list, config.resources[ key ] );
    if( !restConfig.hidden ){
      var entry = path.join( config.root, restConfig.path );
      //Windows hack: path.join will return windows path file separator "\ instead of url based separator "/"
      //This helps explain the issue: http://stackoverflow.com/questions/12722865/using-path-join-on-nodejs-on-windows-to-create-url
      entry = entry.replace( /\\/g, '/' );
      var methods = restConfig.methods;
      output[ key ] = {};
      _.each( methods, function( methodName ){
        var method = require( "../methods/" + methodName );
        output[ key ][ methodName ] = method( list, restConfig, entry );
      } );
    }
  } );
  return output;
};
