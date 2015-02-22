module.exports.tasks = {
  mochacli : {
    options : {
      reporter : 'spec',
      bail     : true
    },
    all     : [ 'test/**/*.spec.js' ]
  }
};
