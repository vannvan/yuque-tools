#!/usr/bin/env node

import { config as CONFIG } from '../config.js'
import { Command } from 'commander'
import { Log } from '../lib/tool.js'

import fs from 'fs'
const program = new Command()
const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

program.name('ytool').description('ytool 是一个语雀文档导出插件').version(pkg.version)

program
  .command('clean')
  .description('清除本地缓存')
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
  .description('获取语雀知识库资源')
  .action(async (_str: string, _options) => {
    const Command = await import('../app.js')
    const cmd = new Command.default()
    const { args } = _options
    if (args.length >= 2) {
      const [userName, password, ...rest] = args
      cmd.init({
        userName,
        password,
        tocRange: rest,
        skipDoc: rest.includes('skip'),
      })
    } else {
      cmd.init({})
    }
  })

program.parse(process.argv)
