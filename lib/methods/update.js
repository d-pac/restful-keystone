"use strict";
var fs = require( "fs" );
var path = require( "path" );
var fileType = require( "file-type" );
var debug = require( "debug" )( "restful-keystone" );
var P = require( "bluebird" );
var errors = require( "errors" );
var utils = require( "../utils" );
var handleResult = utils.handleResult;
var getId = utils.getId;
var _ = require( "lodash" );

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
      debug( "UPDATE", config.name, id );
      list.model
        .findById( id, config.show, config )
        .exec()
        .then( function( doc ){
          if( !doc ){
            throw new errors.Http404Error( {
              explanation : "Resource not found with id " + id
            } );
          }
          var data = req.body;
          _.each( data, function( value,
                                  field ){
            doc[ field ] = value;
          } );
          
          // store local files and update DB entry
          var readFile = P.promisify( fs.readFile );
          var writeFile = P.promisify( fs.writeFile );
          var tasks = [];
          _.keys( req.files ).forEach( function ( key ) {
            var field = list.fields[key];
            if ( field.typeDescription !== "localfile" ) { return; }
            var dest = field.options.dest;
            var file = req.files[key];
            var task = readFile( file.path ).then( function( data ) {
              var newPath = path.join( dest, file.name );
              var filetype = fileType( data );
              return writeFile( newPath, data ).then( function () {
                doc.file.filetype = filetype.mime;
                doc.file.size = file.size;
                doc.file.originalname = file.originalname;
                doc.file.filename = file.name;
              } );
            } );
            tasks.push( task );
          } );
          
          return P.all( tasks ).then( function () {
            return P.promisify( doc.save, doc )();
          } );
        } )
        .then( function( params ){
          var result = params[ 0 ]; //params[1]=number of affected
          result = handleResult( result, config );
          res.locals.body = result;
          res.locals.status = 200;
          next();
        } )
        .then( null, function( err ){
          next( err );
        } );
    },
    verb   : "patch",
    url    : entry + "/:id"
  };
};
