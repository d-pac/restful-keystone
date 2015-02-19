'use strict';
module.exports = function( grunt ){
  // Show elapsed time at the end
  require( 'time-grunt' )( grunt );
  // Load all grunt tasks
  require( 'jit-grunt' )( grunt, {
    mochacli : "grunt-mocha-cli"
  } );

  var configs = require( "load-grunt-configs" )( grunt );

  grunt.initConfig( configs );

  grunt.registerTask( 'lint', [ 'jshint', 'jscs' ] );
  grunt.registerTask( 'default', [ 'lint', 'mochacli' ] );
};
