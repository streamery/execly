
/**
 * Module dependencies
 */

var exec = require('../')

var HOME = process.env.HOME;
var TERM = process.env.TERM;

exec('ls', [HOME])
.pipe(exec('localhost', __dirname+'/test.sh'))
.pipe(process.stdout);
