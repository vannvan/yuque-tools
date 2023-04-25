#!/usr/bin/env node

const program = new Command()
import { config as CONFIG } from '../config.js'
import { Command } from 'commander'
import { Log } from '../lib/tool.js'

import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

program.name('ytool').description('ytool is a Yuque plugin').version(pkg.version)

program
  .command('clean')
  .description('clean local cache')
  .action((_str: string, _options) => {
    const fullPathName = CONFIG.outputDir
    fs.rm(fullPathName, { recursive: true }, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          Log.warn('暂无缓存')
        } else {
          Log.error('缓存清除失败')
        }
        process.exit(0)
      } else {
        Log.success('缓存已清除～')
      }
    })
  })

program
  .command('pull')
  .description('pull yuque docs')
  .action((_str: string, _options) => {
    import('../app.js')
  })

program.parse(process.argv)
