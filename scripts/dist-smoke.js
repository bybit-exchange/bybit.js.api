#!/usr/bin/env node
// Smoke test the compiled dist/ tree: both CJS and ESM entrypoints must load and
// expose BybitClient. Runs after build, again before publish, and in CI.
const path = require('path')
const cjs = require(path.resolve(__dirname, '..', 'dist', 'cjs', 'index.js'))
if (!cjs.BybitClient) {
  console.error('smoke: CJS entrypoint is missing BybitClient')
  process.exit(1)
}
new cjs.BybitClient()

import(path.resolve(__dirname, '..', 'dist', 'esm', 'index.js'))
  .then((m) => {
    if (!m.BybitClient) {
      console.error('smoke: ESM entrypoint is missing BybitClient')
      process.exit(1)
    }
    new m.BybitClient()
    console.log('smoke: CJS + ESM entrypoints load and construct BybitClient OK')
  })
  .catch((err) => {
    console.error('smoke: ESM import failed —', err && err.message ? err.message : err)
    process.exit(1)
  })
