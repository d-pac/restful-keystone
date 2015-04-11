"use strict";

/* global describe, it, beforeEach, afterEach */
/* jshint unused:false */

var _ = require( "lodash" );
var sinon = require( "sinon" );
var stub = require( "proxyquire" ).noCallThru();
var expect = require( "must" );
var fx = require( "../fixtures" );
var stubs, subject;

describe( "lib/methods/list", function(){
  beforeEach( function(){
    stubs = {
      "./retrieve" : sinon.stub()
    };
    subject = stub( "../../lib/methods/list", stubs );
  } );

  describe( "spec file", function(){
    it( "should be found", function(){
      expect( true ).to.be.true();
    } );
  } );

  describe( "module", function(){
    it( "should be a function", function(){
      expect( subject ).to.be.a.function();
    } );
    it( "should return a configuration object", function(){
      var result = subject( {
        path : "test"
      } );
      expect( result ).to.have.keys( [ "handle", "verb", "url" ] );
    } );

    describe( "#verb", function(){
      it( "should be 'get'", function(){
        var result = subject( {
          path : "test"
        } );
        expect( result.verb ).to.equal( "get" );
      } );
    } );

    describe( "#url", function(){
      it( "should be the value of `entry`", function(){
        var entry = Math.random();
        var result = subject( {
          path : "test"
        }, {}, entry );
        expect( result.url ).to.equal( entry );
      } );
    } );

    describe( "#handle", function(){
      var config, req;
      beforeEach( function(){
        config = subject( {
          path  : "test",
          model : fx.model
        } );
        req = {
          params : {},
          query  : {},
          body   : {}
        };
      } );
      afterEach( function(){
        fx.model.reset();
      } );
      it( "should be a function", function(){
        expect( config.handle ).to.be.a.function();
      } );
      it( "should delegate to `retrieve` when a `id` param is present", function(){
        var retrieveResult = {
          handle : sinon.spy()
        };
        stubs[ "./retrieve" ].returns( retrieveResult );
        req.params.id = "a valid id";
        config.handle( req );
        expect( stubs[ "./retrieve" ].callCount ).to.equal( 1 );
        expect( retrieveResult.handle.callCount ).to.equal( 1 );
      } );
      it( "should use a `filter` param", function(){
        var filter = {};
        req.params.filter = filter;
        config.handle( req );
        expect( fx.model.findStub.calledWith( filter ) ).to.be.true();
      } );
      it( "should translate a `filter` param string to an object", function(){
        var filter = "{}";
        req.params.filter = filter;
        config.handle( req );
        expect( fx.model.findStub.args[ 0 ] ).to.eql( [
          {}, undefined, {
            name : "test"
          }
        ] );
      } );
      it( "should use `config.filter`", function(){
        var filter = {};
        config = subject( {
          path  : "test",
          model : fx.model
        }, {
          filter : filter
        } );
        config.handle( req );
        expect( fx.model.findStub.calledWith( filter ) ).to.be.true();
      } );
      it( "should execute `config.filter` when its a function", function(){
        var filter = sinon.spy();
        config = subject( {
          path  : "test",
          model : fx.model
        }, {
          filter : filter
        } );
        config.handle( req );
        expect( filter.callCount ).to.equal( 1 );
      } );
      it( "should merge `config.filter` and a `filter` param", function(){
        var cFilter = {
          a : "cFilter"
        };
        var rFilter = {
          b : "rFilter"
        };
        config = subject( {
          path  : "test",
          model : fx.model
        }, {
          filter : cFilter
        } );
        req.query.filter = rFilter;
        config.handle( req );
        expect( fx.model.findStub.getCall( 0 ).args[ 0 ] ).to.eql( {
          a : "cFilter",
          b : "rFilter"
        } );
      } );
      it( "should call model.find", function(){
        var opts = {
          filter : {
            filtered : true
          },
          show   : "fields"
        };
        config = subject( {
          path  : "test",
          model : fx.model
        }, opts );
        config.handle( req );
        expect( fx.model.findStub.getCall( 0 ).args ).to.eql( [
          opts.filter, opts.show, _.defaults( opts, {
            name : "test"
          } )
        ] );
      } );
    } );
  } );
} );
