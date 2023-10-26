import axios from 'axios'
import F from './dev/file.js'
import { getLocalCookies, getLocalUserConfig, setJSONString } from './tool.js'
import { config as CONFIG } from '../core/config.js'
import { Log } from './dev/log.js'

const getHost = async () => {
  const { host } = await getLocalUserConfig()
  return host || CONFIG.host
}

export const get = <T>(url: string): Promise<{ data: T }> => {
  const cookie = getLocalCookies()?.data

  if (!cookie) {
    Log.error('本地cookie加载失败，程序中断')
    process.exit(0)
  }
  return new Promise(async (resolve, reject) => {
    // console.log('请求地址', getHost() + url)
    const config = {
      url: (await getHost()) + url,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        cookie: cookie,
      },
    }
    axios(config)
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        Log.error(error.code, { title: 'GET请求报错', body: `${error},${config.url}` })
        reject(error.code)
      })
  })
}

export const post = <T>(url: string, params: any, header?: object): Promise<{ data: T }> => {
  return new Promise(async (resolve, reject) => {
    //  登录接口统一使用yuque域名
    const config = {
      url: (/login/.test(url) ? CONFIG.host : await getHost()) + url,
      method: 'post',
      data: params,
      headers: Object.assign(header || {}, {
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        cookie: getLocalCookies(),
      }),
    }
    axios(config)
      .then((res) => {
        if (res.headers['set-cookie']) {
          const cookieContent = setJSONString({
            expired: Date.now(),
            data: res.headers['set-cookie'],
          })
          F.touch2(CONFIG.cookieFile, cookieContent)
        }
        resolve(res.data)
      })
      .catch((error) => {
        Log.error(error.code, { title: 'POST请求报错', body: `${error},${config.url}` })
        reject(error.code)
      })
  })
}
