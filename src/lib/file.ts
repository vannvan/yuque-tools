/*
 * Description: 文件操作
 * Created: 2023-02-23 09:34:34
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-04-08 22:59:54
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import fs from 'fs'
const log = console.log
import chalk from 'chalk'
import path from 'path'

class File {
  /**
   * 创建文件夹
   * @param {*} absolutePath
   */
  async mkdir(absolutePath: any): Promise<boolean> {
    if (fs.existsSync(absolutePath)) {
      return true
    } else {
      //如果父级目录已经创建，然后才能创建子级目录
      if (this.mkdir(path.dirname(absolutePath))) {
        fs.mkdirSync(absolutePath)
        return true
      }
      return true
    }
  }

  /**
   * 目录可能不存在，创建文件
   * @param {*} absolutePath  绝对路径
   * @param {*} fileName 文件名称
   * @param {*} content 文件内容
   */
  async touch(absolutePath: any, fileName: any, content: string | NodeJS.ArrayBufferView) {
    this.mkdir(absolutePath)
    const _fileName = `${absolutePath}/${fileName}`
    fs.writeFile(_fileName, content, (error) => {
      if (error) return console.log(`${_fileName}写入文件失败,原因是` + error.message)
      // log(chalk.green(`${_fileName}创建成功`))
    })
  }

  /**
   * 已知目录存在创建文件
   * @param fileNameAbsolutePath
   * @param content
   */
  async touch2(fileNameAbsolutePath: fs.PathLike, content: string) {
    if (!content) log(chalk.red('内容为空'))
    fs.writeFile(fileNameAbsolutePath, content, (error) => {
      if (error) return console.log(`${fileNameAbsolutePath}写入文件失败,原因是` + error.message)
    })
  }

  /**
   * 删除文件
   * @param {*} fullPathName 目标文件全路径
   */
  rm(fullPathName: fs.PathLike) {
    fs.unlink(fullPathName, (error) => {
      if (error) {
        log(chalk.red(`删除${fullPathName}失败`))
        process.exit(0)
      }
    })
  }

  /**
   * 删除文件夹
   * @param fullPathName
   */
  rmdir(fullPathName: fs.PathLike) {
    fs.rmdir(fullPathName, { recursive: true }, (error) => {
      if (error) {
        log(chalk.red(`删除${fullPathName}失败`))
        process.exit(0)
      }
    })
  }

  /**
   * 文件是否已存在
   * @param {*} fullPath 完整路径
   * @returns
   */
  async isExit(fullPath: fs.PathLike) {
    return fs.existsSync(fullPath)
  }

  /**
   * 获取文件内容
   * @param {*} fileAbsolutePath 完整路径
   * @returns
   */
  read(fileAbsolutePath: fs.PathLike) {
    const content = fs.readFileSync(fileAbsolutePath, 'utf-8')
    return content ? content.toString() : ''
  }

  /**
   * 异步递归遍历目标目录下的文件
   * @param {*} pathName 目标路径
   * @param {*} filterCallback // 过滤函数
   * @returns
   */
  async readDirectory(pathName: any, filterCallback: (arg0: string) => any) {
    if (!this.isExit(pathName)) {
      log(chalk.red('路径无效'))
      return
    }

    return new Promise((resolve) => {
      const list: any[] = []
      const each = (pathName: string) => {
        fs.readdirSync(pathName).forEach((item, _index) => {
          let stat = fs.lstatSync(path.join(pathName, item))
          if (stat.isDirectory()) {
            each(path.join(pathName, item))
          } else if (stat.isFile()) {
            const fullPathName = pathName + '/' + item
            if (
              filterCallback &&
              typeof filterCallback == 'function' &&
              filterCallback(fullPathName)
            ) {
              list.push(fullPathName)
            }
          }
        })
      }

      each(pathName)
      resolve(list)
    })
  }
}

const F = new File()
export default F
