"use strict";

/* global describe, it, beforeEach */
/* jshint unused:false */

var _ = require( "lodash" );
var sinon = require( "sinon" );
var stub = require( "proxyquire" ).noCallThru();
var expect = require( "must" );
var fx = require( "./../fixtures/index" );
var constants = require( "../../lib/constants" );

var EMPTY = {};

describe( "lib.utils.exposeLists", function(){
  var subject
    , libStub;
  beforeEach( function(){
    libStub = {};
    subject = require( "../../lib/utils/exposeLists" );
  } );

  describe( "spec file", function(){
    it( "should be found", function(){
      expect( true ).to.be.true();
    } );
  } );
  describe( "module", function(){
    it( "should be a function", function(){
      expect( subject ).to.be.function();
    } );
    it( "should return an empty object when no lists are registered", function(){
      var result = subject( {
        lists : []
      } );
      expect( result ).to.eql( EMPTY );
    } );
    it( "should return an object with an entry for each method, when so requested", function(){
      var result = subject( {
        lists : {
          test : {
            path     : "test",
            singular : "test"
          }
        }
      }, {
        root      : "/",
        resources : {
          test : true
        }
      } );
      expect( _.keys( result.test ) ).to.eql( constants.METHODS_ALL );
    } );
  } );
} );
