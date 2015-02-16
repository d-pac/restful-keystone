module.exports.tasks = {
  mochacli : {
    options : {
      reporter : 'spec',
      bail     : true
    },
    all     : [ 'test/*.js' ]
  }
};
