var files = [ 'Gruntfile.js', '*.js', 'test/**/*.js', 'lib/**/*.js' ];

module.exports.tasks = {
  jshint : {
    options : {
      jshintrc : '.jshintrc',
      reporter : require( "jshint-stylish" )
    },
    all     : {
      src : files
    }
  },
  jscs   : {
    src     : files,
    options : {
      config : ".jscsrc"
    }
  }
};
