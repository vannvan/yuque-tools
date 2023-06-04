# 语雀知识库批量导出和再处理工具(非TOKEN方式,非官方)  

![](https://badgen.net/npm/dm/yuque-tools)
![](https://badgen.net/npm/v/yuque-tools)
![](https://badgen.net/npm/node/next)

[了解实现过程-与其它工具有什么不一样](https://github.com/vannvan/yuque-tools/blob/main/ABOUT.md)

## 样例

[![example.gif](https://www.z4a.net/images/2023/05/01/example.gif)](https://www.z4a.net/image/VmUHiO)

## 使用方式

整体步骤

pull -> 登录 -> 交互式选择知识库 -> 等待下载完成

目前登录完成后会设置一天的有效时间，也就是说在24小时之内重复导出只有第一次需要登录。

### CLI方式

#### 安装
>
> npm i yuque-tools -g 安装到全局
> npm i yuque-tools 安装到局部  
> 安装到全局以下方法使用`ytool xx`,安装到局部以下方法使用`npx ytool xx`

#### pull 导出

创建目录`yuque-docs`并进入目录

> ytool pull  

执行命令后会进入账号登录环节，完成登录后会进入交互式选择知识库环节，选择需要导出的知识库即可

同时，账号信息支持配置化,适合长期使用  
`yuque-docs/yuque.config.json`

```json
{
  "userName": "XXX",
  "password": "XXX",
}
```

#### clean 清除缓存

> ytool clean  

### 程序包

此方式适用于无`Node`环境的朋友们👉
[程序包](https://github.com/vannvan/yuque-tools/releases/tag/v1.0.0-beta)

## issues

[反馈意见](https://github.com/vannvan/yuque-tools/issues)
[更新记录⭐️](https://github.com/vannvan/yuque-tools/issues/9)

欢迎提意见或参与功能优化工作，如果有帮助欢迎点个鼓励的⭐️
