'use strict';

/* global describe, it, beforeEach */
/* jshint unused:false */

var _ = require( "lodash" );
var sinon = require( "sinon" );
//var stub = require( "proxyquire" );
var expect = require( "must" );
var fx = require( "./../fixtures/index" ).parseMiddlewareConfig;
var subject = require( "../../lib/utils/parseMiddlewareConfig" );
var constants = require( "../../lib/constants" );

describe( 'lib.utils.parseMiddlewareConfig', function(){
  describe( "spec file", function(){
    it( "should be found", function(){
      expect( true ).to.be.true();
    } );
  } );
  describe( "module", function(){
    it( "should expose a function", function(){
      expect( subject ).to.be.a.function();
    } );
    it( "should add all methods to `config[key]` if none were provided/passed", function(){
      var fixture = fx.noneAndFunctionMap;
      var result = subject( fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
    it( "should add all methods to `config[key]` if '*' was passed", function(){
      var fixture = fx.asteriskAndFunctionMap;
      var result = subject( fixture.methods, fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
    it( "should add all passed `methods` as a string to `config[key]`", function(){
      var fixture = fx.stringAndFunctionMap;
      var result = subject( fixture.methods, fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
    it( "should add all passed `methods` as an array to `config[key]`", function(){
      var fixture = fx.arrayAndFunctionMap;
      var result = subject( fixture.methods, fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
    it( "should add all passed `methods` as an object to `config[key]`", function(){
      var fixture = fx.functionMapAndBooleans;
      var result = subject( fixture.methods, fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
    it( "should add all passed `methods` as an object to `config[key]` " +
    "without overwriting the provided function", function(){
      var fixture = fx.functionMapAndFunctionMapWithOverlap;
      var result = subject( fixture.methods, fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
    it( "should add all passed `methods` as an object to `config[key]` " +
    "without overwriting the provided function array", function(){
      var fixture = fx.functionMapAndFunctionArrayMap;
      var result = subject( fixture.methods, fixture.config );
      expect( result ).to.eql( fixture.expected );
    } );
  } );
} );
