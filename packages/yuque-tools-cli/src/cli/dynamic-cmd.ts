#!/usr/bin/env node

import path from 'path'
import glob from 'glob'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname } from 'node:path'
import { Command } from 'commander'
import { argv } from '../lib/dev/argv.js'
import { Log } from '../lib/dev/log.js'
const __dirname = dirname(fileURLToPath(import.meta.url))

class DynamicCMD {
  public ctx: any
  cliInfo: Ytool.Cli.TCLIInfo
  constructor(cliInfo: Ytool.Cli.TCLIInfo) {
    this.cliInfo = cliInfo
    this.genaratContext(this.cliInfo)
    this.init()
  }

  init() {
    this.genarateCommand()
  }

  genaratContext(cliInfo: Ytool.Cli.TCLIInfo) {
    this.ctx = {
      cliInfo,
      __isCLI__: true,
    }
  }

  /**
   * 动态挂载cmd
   */
  async genarateCommand(): Promise<void> {
    const commandList = glob.sync(`${path.join(__dirname, '../command')}/*.?(js|ts)`)

    const program = new Command()
    const { binName, description, version } = this.cliInfo
    program.name(binName).description(`${binName}@${version} ${description}`).version(version)

    const { commandInput } = argv()

    try {
      const matchCmd = commandList.find(
        (item) => item.match(/(?<=d\/).+(?=.js)/)[0] === commandInput
      )
      const valid = ['-h', '--help', '-V', '--version']
      if (!matchCmd && !valid.includes(commandInput) && commandInput) {
        Log.error(`${commandInput} 命令不存在，请使用 -h 查看有效命令`)
        return
      }
      const Command = await import(pathToFileURL(matchCmd).toString())
      const cmd = new Command.default(this.ctx)
      program
        .command(cmd.name)
        .description(cmd.description)
        .action((_str: string, _options) => {
          cmd.action(_options.args)
        })
    } catch (error) {
      for (let i = 0; i < commandList.length; i++) {
        const item = commandList[i]
        const Command = await import(pathToFileURL(item).toString())
        const cmd = new Command.default()
        program.command(cmd.name).description(cmd.description)
      }
    } finally {
      program.parse()
    }
  }
}

export default DynamicCMD
