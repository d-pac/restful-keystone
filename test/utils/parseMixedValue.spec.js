"use strict";

/* global describe, it, beforeEach */
/* jshint unused:false */

var _ = require( "lodash" );
var sinon = require( "sinon" );
var stub = require( "proxyquire" );
var expect = require( "must" );
var fx = require( "./../fixtures/index" );
var subject = require( "../../lib/utils/parseMixedValue" );
var EMPTY = {};

describe( "lib.utils.parseMixedValue", function(){
  describe( "spec file", function(){
    it( "should be found", function(){
      expect( true ).to.be.true();
    } );
  } );

  describe( "module", function(){
    it( "should expose a function", function(){
      expect( subject ).to.be.a.function();
    } );
    it( "should return the `defaultValue` if `value` is `undefined`", function(){
      var defaultValue = [];
      var result = subject( undefined, defaultValue );
      expect( result ).to.equal( defaultValue );
    } );
    it( "should return the `defaultValue` if `value` is `true`", function(){
      var defaultValue = [];
      var result = subject( true, defaultValue );
      expect( result ).to.equal( defaultValue );
    } );
    it( "should return `emptyValue` if `value` is `false`", function(){
      var defaultValue = [];
      var result = subject( false, defaultValue, EMPTY );
      expect( result ).to.equal( EMPTY );
    } );
    it( "should split a space-delimited string `value` into an array", function(){
      var value = "a b c";
      var result = subject( value );
      expect( result ).to.eql( [ "a", "b", "c" ] );
    } );
    it( "should not touch an array `value`", function(){
      var value = [ "a", "b" ];
      var result = subject( value );
      expect( result ).to.equal( value );
    } );
  } );
} );
