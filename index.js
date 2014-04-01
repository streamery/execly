
/**
 * Module dependencies
 */

var ssh = require('ssh2')
  , cp = require('child_process')
  , through = require('through')
  , url = require('url')

var isArray = Array.isArray;

/**
 * Executes a command on
 * a given host
 *
 * @api public
 * @param {String} host
 * @param {String} cmd
 * @param {Array} args - optional
 * @param {Object} opts - optional
 * @return {Stream}
 */

module.exports = exec;
function exec (host, cmd, args, opts) {
  var stream = null;
  var io = null;
  var con = null;
  var parsed = null;
  var auth = null;
  var user = null;
  var pass = null;
  var stdin = null;

  opts = opts || {};

  if (isArray(cmd)) {
    args = cmd;
    cmd = host;
    host = 'localhost';
  }

  if (!isArray(args) && 'object' == typeof args) {
    opts = args;
    args = [];
  }

  stream = through(write, end);

  // local
  if (isLocal(host)) {
    (io = cp.spawn(cmd, args, {stdio: 'pipe'}))
    .on('close', function (code, signal) {
      stream.emit('close', code, signal);
    })
    .on('exit', function (code, signal) {
      stream.emit('exit', code, signal);
    });

    io.stdout.on('data', function (chunk) {
      stream.emit('data', chunk);
    });

    io.stdout.on('end', function () {
      stream.emit('end');
    });
  }
  // remote
  else {
    parsed = url.parse(host);

    // add `ssh://' protocol and try again
    if (!parsed.prototcol) {
      host = 'ssh://'+ host;
      parsed = url.parse(host);
    }

    auth = parsed.auth.split(':');
    user = auth.shift();
    pass = auth.shift();

    (con = ssh())
    .on('ready', function () {
      var c = [cmd].concat(args).join(' ');
      console.log(opts.env)
      con.exec(c, {env: opts.env}, function (err, duplex) {
        if (err) { return console.error(err); }

        (stdin = duplex)
        .on('data', function (chunk) {
          stream.emit('data', chunk);
        })
        .on('end', function () {
          stream.emit('end', err);
        });

      });
    })
    .on('error', function (err) {
      stream.emit('error', err);
    })
    .on('end', function () {
      stream.emit('end');
    })
    .on('close', function () {
      stream.emit('close', null, null);
    });

    con.connect({
      host: parsed.hostname,
      port: parsed.port || 22,
      username: user,
      password: pass,
      privateKey: opts.privateKey
    });
  }

  return stream;

  function write (chunk) {
    if (stdin) { stdin.write(chunk); }
  }

  function end () { }
}

/**
 * Determine if host is a localhost
 *
 * @api private
 * @param {String} host
 * @return {Boolean}
 */

function isLocal (host) {
  var parts = null;
  var part = null;
  if (!host) { return false; }
  switch (host) {
    case '::1':
    case 'localhost': return true;

    // 127.0.0.1 - 127.255.255.254
    default:
      parts = host.split('.');
      if (4 != parts.length) { return false; }
      parts = parts.map(Number);
      if (127 != parts.shift()) { return false; }
      if ((part = parts.shift()) > 255 || part < 0) { return false; }
      if ((part = parts.shift()) > 255 || part < 0) { return false; }
      if ((part = parts.shift()) > 254 || part < 1) { return false; }
      return true;
  }
  return false;
}
