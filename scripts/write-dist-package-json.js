#!/usr/bin/env node
// Post-build helper: writes a minimal package.json into each dist subfolder so
// Node can pick the correct module system (CJS for dist/cjs, ESM for dist/esm).
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

fs.writeFileSync(
  path.join(root, 'dist', 'cjs', 'package.json'),
  JSON.stringify({ type: 'commonjs' }) + '\n',
)
fs.writeFileSync(
  path.join(root, 'dist', 'esm', 'package.json'),
  JSON.stringify({ type: 'module' }) + '\n',
)
