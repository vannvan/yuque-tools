import { execSync } from 'child_process'
import inquirer from 'inquirer'
import latestVersion from 'latest-version'
import { Log } from '../lib/dev/log.js'
import ora from 'ora'

export default class Upgrade implements Ytool.Cli.ICommand {
  public name = 'upgrade'
  public description = '工具升级'
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }
  async action() {
    const { cliInfo } = this.ctx

    const currentVersion = cliInfo.version

    const latestV = await latestVersion(cliInfo.name)

    if (currentVersion != latestV) {
      inquirer
        .prompt([
          {
            type: 'confirm',
            message: '有新版本，是否要更新？',
            name: 'confirm',
          },
          {
            type: 'list',
            message: '请选择包管理工具',
            name: 'pkg',
            choices: [
              {
                name: 'pnpm',
                value: 'pnpm',
              },
              {
                name: 'npm',
                value: 'npm',
              },
              {
                name: 'yarn',
                value: 'yarn',
              },
            ],
          },
        ])
        .then(async (answer) => {
          const { confirm, pkg } = answer
          if (confirm) {
            const spinner = ora('开始安装新版本\n').start()
            if (pkg === 'yarn') {
              const output = execSync(`yarn global add ${cliInfo.name}@${latestV}`)
              Log.info(output.toString())
              spinner.stop()
            } else {
              const output = execSync(`${pkg} install ${cliInfo.name}@${latestV} -g`)
              Log.info(output.toString())
              spinner.stop()
            }
          } else {
            process.exit(0)
          }
        })
    }
  }
}
