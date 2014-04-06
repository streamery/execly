execly
======

Streaming process executor, local and remote

## install

```sh
$ npm install execly
```

## example

***deploy.sh*** on remote

```sh
#!/bin/bash

DEST="$1"
REMOTE="$2"
BRANCH="$3"

echo "  ... Cloning remote into destiation '$DEST'"
git clone $REMOTE $DEST
cd $DEST
echo "  ... Checking out branch '$BRANCH'"
git checkout $BRANCH
echo "  ... Fetching latest"
git pull --rebase origin $BRANCH

```

```js
var exec = require('execly');

function deploy (opts) {
  return exec(opts.host, opts.script, [
    opts.dir, // $DEST
    opts.remote, // $REMOTE
    opts.branch || 'master' // $BRANCH
  ], {
    privateKey: require('fs').readFileSync('/path/to/key/file')
  });
}

deploy({
  host: 'user@prod.server.com',
  dir: '/srv/www', remote: 'git@host.com:app.git'
})
.pipe(process.stdout);
```

## usage

```js
execly(host, command, args, opts); // => Stream
```

## license

MIT
