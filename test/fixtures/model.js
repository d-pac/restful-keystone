"use strict";
var P = require( "bluebird" );
var sinon = require( "sinon" );
var resolverStub = sinon.stub();
var execStub = sinon.stub();
var findStub = sinon.stub();

module.exports = {
  find         : findStub,
  findStub     : findStub,
  execStub     : execStub,
  resolverStub : resolverStub,
  reset        : function(){
    resolverStub.reset();
    execStub.reset();
    execStub.returns( new P( resolverStub ) );
    findStub.reset();
    findStub.returns( {
      exec : execStub
    } );
  }
};

module.exports.reset();
