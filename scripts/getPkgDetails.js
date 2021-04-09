#!/usr/bin/env node
const pkg = require(require('path').join(require('app-root-path').toString(), 'package.json'))

const d = p => {
  if (!p) {
    return console.error('missing argument')
  }
  return process.stdout.write(String(pkg[p]))
}

d(process.argv[process.argv.indexOf(__filename) + 1])
