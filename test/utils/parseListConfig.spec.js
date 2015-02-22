"use strict";

/* global describe, it, beforeEach */
/* jshint unused:false */

var _ = require( "lodash" );
var sinon = require( "sinon" );
var stub = require( "proxyquire" );
var expect = require( "must" );
var fx = require( "./../fixtures/index" );
var constants = require( "../../lib/constants" );
var subject = require( "../../lib/utils/parseListConfig" );

var EMPTY = {};

describe( "lib.utils.parseListConfig", function(){
  describe( "spec file", function(){
    it( "should be found", function(){
      expect( true ).to.be.true();
    } );
  } );
  describe( "module", function(){
    it( "should expose a function", function(){
      expect( subject ).to.be.a.function();
    } );
    [ undefined, null, false, '' ].forEach( function( value ){
      it( [
        "should return `result.hidden` to `true` when value is ", value, " (", typeof value, ")"
      ].join( "" ), function(){
        var result = subject( EMPTY, value );
        expect( result ).to.eql( {
          hidden : true
        } );
      } );
    } );
    it( "should set `result.methods` by default to all methods", function(){
      var result = subject( EMPTY, EMPTY );
      expect( result.methods ).to.eql( constants.METHODS_ALL );
    } );
    it( "should set `result.select` by default to keys of `list.fields`", function(){
      var result = subject( {
        fields : {
          a : true,
          b : true,
          c : true,
          d : true
        }
      }, {} );
      expect( result.show ).to.equal( "a b c d" );
    } );
    it( "should set `result.edit` by default to keys of `list.fields`", function(){
      var result = subject( {
        fields : {
          a : true,
          b : true,
          c : true,
          d : true
        }
      }, EMPTY );
      expect( result.edit ).to.eql( "a b c d" );
    } );
    it( "should set `result.populate` by default to an empty array", function(){
      var result = subject( {
        relationships : {
          a : true,
          b : true,
          c : true,
          d : true
        }
      }, EMPTY );
      expect( result.populate ).to.equal( "" );
    } );
    it( "should set `result.envelop` by default to '<%=name%>'", function(){
      var result = subject( EMPTY, EMPTY );
      expect( result.envelop ).to.equal( "<%=name%>" );
    } );
    it( "should set `result.key` by default to `list.key`", function(){
      var key = EMPTY;
      var result = subject( {
        key : key
      }, EMPTY );
      expect( result.key ).to.equal( key );
    } );
    it( "should set `result.path` by default to `list.path`", function(){
      var path = EMPTY;
      var result = subject( {
        path : path
      }, EMPTY );
      expect( result.path ).to.equal( path );
    } );
    it( "should NOT return the original `config` object", function(){
      var config = {};
      var result = subject( {}, config );
      expect( result ).to.not.equal( config );
    } );
  } );
} );
