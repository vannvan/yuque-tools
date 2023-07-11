#!/usr/bin/env node

import DynamicCMD from './dynamic-cmd.js'

import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

new DynamicCMD(pkg)
