/* jshint node:true */
// var RSVP = require('rsvp');
var execSync = require('child_process').execSync;

// For details on each option run `ember help release`
module.exports = {
  afterPush: function() {
    var output = execSync('git push origin master:release', { encoding: 'utf8' });
    console.log(output);
  }
};
