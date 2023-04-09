#!/usr/bin/env node

import { Command } from 'commander'
const program = new Command()
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

program.name('ytool').description('ytool is a Yuque plugin').version(pkg.version)

program
  .command('clean')
  .description('clean local cache')

  .action((str: string, options: { first: any; separator: any }) => {
    const limit = options.first ? 1 : undefined
    console.log(str.split(options.separator, limit))
  })

program.parse()
