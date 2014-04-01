
/**
 * Module dependencies
 */

var exec = require('../')
  , fs = require('fs')

var HOME = process.env.HOME;
var TERM = process.env.TERM;
var read = fs.readFileSync;

exec('ls', [HOME]);

exec('fakehost', 'env', {
  privateKey: read(HOME +'/.ssh/id_rsa'),
  env: { FOO: 'bar' }
})
.pipe(process.stdout);
