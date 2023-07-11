import { getLocalUserConfig } from '../lib/tool.js'
import fs from 'fs'
import { config as CONFIG } from '../core/config.js'
import { Log } from '../lib/dev/log.js'

export default class Init implements ICommand {
  public name = 'clear'
  public description = '清除本地缓存'
  ctx: any
  constructor() {}
  action() {
    const { output } = getLocalUserConfig()
    const fullPathName = output || CONFIG.outputDir
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
  }
}
