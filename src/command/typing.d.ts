type TCLIInfo = {
  version: string
  name: string
  description: string
}

type TCLIContext = {
  cliInfo: TCLIInfo
}

interface ICommand {
  name: string
  description: string
  // 预留
  ctx: TCLIContext
  action(args: string[]): void
}
