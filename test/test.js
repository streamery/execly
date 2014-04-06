
/**
 * Module dependencies
 */

var exec = require('../')
  , fs = require('fs')

var HOME = process.env.HOME;
var TERM = process.env.TERM;
var read = fs.readFileSync;

exec('ls', [HOME]).pipe(
  exec('localhost', __dirname+'/test.sh', [], {
    privateKey: read(HOME +'/.ssh/id_rsa')
}))
.pipe(process.stdout);
