const log = console.log
import chalk from 'chalk'

/**
 * 打印日志
 */
export const Log = {
  error: (text: string) => log(chalk.red(text)),
  info: (text: string, indent?: number) => {
    indent ? log(chalk.white(' '.repeat(indent) + text)) : log(chalk.white(text))
  },
  success: (text: string) => log(chalk.green(text)),
  warn: (text: string) => log(chalk.yellow(text)),
}
