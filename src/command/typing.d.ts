interface ICommand {
  name: string
  description: string
  // 预留
  ctx: any
  action(args: string[]): void
}
