import path from 'path'

export const config = {
  host: 'https://www.yuque.com',
  publicKey: `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfwyOyncSrUTmkaUPsXT6UUdXx
  TQ6a0wgPShvebfwq8XeNj575bUlXxVa/ExIn4nOUwx6iR7vJ2fvz5Ls750D051S7
  q70sevcmc8SsBNoaMQtyF/gETPBSsyWv3ccBJFrzZ5hxFdlVUfg6tXARtEI8rbIH
  su6TBkVjk+n1Pw/ihQIDAQAB
  -----END PUBLIC KEY-----`,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20G81 YuqueMobileApp/1.0.2 (AppBuild/650 Device/Phone Locale/zh-cn Theme/light YuqueType/public)',
  /**
   * local expiration time
   */
  localExpire: 86400000,

  /**
   * request yuque API duration
   */
  duration: 500,

  /**
   *  user config file name
   */
  localConfig: './yuque.config.json',

  /**
   * output dir
   */
  outputDir: './docs',

  /**
   * set custom doc path
   */
  set setOutputDir(path: string) {
    this.outputDir = path
  },

  /**
   * cookie info full path
   */
  get cookieFile() {
    return path.join(config.outputDir, '.meta/cookies.json')
  },
  /**
   * user info full path
   */
  get userInfoFile() {
    return path.join(config.outputDir, '.meta/userinfo.json')
  },

  /**
   * book info full path
   */
  get bookInfoFile() {
    return path.join(config.outputDir, '.meta/booksinfo.json')
  },

  /**
   * the app cache file path
   */
  get metaDir() {
    return path.join(config.outputDir, '.meta')
  },
}
