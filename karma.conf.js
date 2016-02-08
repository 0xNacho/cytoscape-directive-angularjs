module.exports = function(config) {
  config.set({
  	reporters: ['spec'],
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
    	'./tests/*.js'
    ]
  });
};