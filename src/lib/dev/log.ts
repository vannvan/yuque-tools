const log = console.log
import chalk from 'chalk'
import terminalLink from 'terminal-link'

const issuesLink = 'https://github.com/vannvan/yuque-tools/issues/new'

/**
 * 打印日志
 */
export const Log = {
  error: (text: string) => {
    const link = terminalLink('👉提个bug', issuesLink)
    log(chalk.red(text + ' '.repeat(4) + link))
  },
  info: (text: string, indent?: number) => {
    indent ? log(chalk.white(' '.repeat(indent) + text)) : log(chalk.white(text))
  },
  success: (text: string) => log(chalk.green(text)),
  warn: (text: string) => log(chalk.yellow(text)),
}
