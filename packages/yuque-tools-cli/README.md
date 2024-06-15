# 语雀知识库批量导出和再处理工具(非TOKEN方式,非官方)  

![](https://badgen.net/npm/dm/yuque-tools)
![](https://badgen.net/npm/v/yuque-tools)
![](https://badgen.net/npm/node/next)

[🎉可执行程序版(无需Node环境，下载即用)](https://github.com/vannvan/rust-explore/releases)

## 样例

[![example.gif](https://www.z4a.net/images/2023/05/01/example.gif)](https://www.z4a.net/image/VmUHiO)

## 支持

- 个人知识库
- 空间(团队)知识库
- 协作知识库
- 小记

> 自 2.1.0 版本开始，交互式列表中 👤 前缀表示个人知识库，其它则为 👥

[了解实现过程-与其它工具有什么不一样](https://github.com/vannvan/yuque-tools/blob/main/packages/yuque-tools-cli/ABOUT.md)

## 使用方式

### 整体步骤

pull -> 登录 -> 交互式选择知识库(命令行参数完整不会进入交互式环节) -> 等待下载完成

目前登录完成后会设置一天的帐号信息缓存，即24小时之内重复导出只有第一次需要登录。

### 安装
>
> npm i yuque-tools -g 安装到全局  
> npm i yuque-tools 安装到局部  
> 安装到全局以下方法使用`ytool xx`，安装到局部以下方法使用`npx ytool xx`

### 导出

创建目录`yuque-docs`并进入目录(目录名称随意)

> ytool pull

#### 初级用法(只用一次，用完即走推荐⬇️)

如果仅需导出**个人知识库**，可以任何参数都不传，`pull`之后所有所需信息均会进入交互式环节，按照步骤完成操作即可。

#### 中级用法

##### 参数说明

|参数|说明|必填|
|--|--|--|
|userName password | 语雀账号和密码|是/交互|
|tocRange|例如: `test-book/测试目录 test-book2`，多个知识库之间空格隔开|是/交互|
|all | 导出所有知识库，与`tocRange`互斥|是/交互|
|skip/skipDoc | 导出时是否跳过本地同名文件|否/交互|
|lb/linebreak | 导出时是否保留语雀换行标签，即`<br/>`标签|否/交互|
|note/onlyNote| 导出小记|否|
|host | `空间`域名，例如: `https://xxx.yuque.com`，后面不要有斜杠(`/`)|否|
|output| 导出目录，例如: `./mydocs`，默认为`docs`|否|
|lc/latexcode|导出Latex语法|否/交互|
|isUpdate|导出时是否依据文档更新选择跳过|否|
|time|文档是否在此时间之后更新，如：任意类型时间，最终会被new Date(time).getTime()加工|否|

注意:

- **命令行认为前**两个**参数为帐号和密码**；
- 对于`skip`、`lb`、 `lc`和`note`，为了命令行使用便捷，采用`skip`表示，而为了含义明确，在配置中采用`skipDoc`表示，其它两个参数同理；
- 为降低命令行使用时的复杂度，`host`、`onlyNote`和`output`仅支持配置形式使用且不会进入问询环节，具体配置方式见以下[高级用法](#高级用法)⬇️;
- 由于小记与知识库归属不同，当使用`note`(或配置中`onlyNote`为`true`)时，将只会进入导出小记的环节，知识库的配置将会忽略；
- `isUpdate`与`time`仅建议采用配置方式使用[见👉](https://github.com/vannvan/yuque-tools/pull/42)，且两字段需同时存在，**用于导出时依据文档是否更新选择覆盖本地文档**，感谢[hanlin-yuan](https://github.com/hanlin-yuan)提供此应用场景支持。  

##### 应用示例

以 [我的测试知识库](https://www.yuque.com/vannvan/dd67e4) 为例，采用一行命令可以直接导出的命令形式有如下用法：  

参数生效的前提是`userName`和`password`同时存在，且在所有参数最前面，其它参数顺序均无具体要求

> ytool pull 18989XXX xxxx all 表示导出**所有**知识库，**不跳过**本地同名文件，**不保持语雀换行标签**

> ytool pull 18989XXX xxxx test-book 表示导出`test-book`知识库，**不跳过**本地同名文件，**不保持语雀换行标签**

> ytool pull 18989XXX xxxx test-book skip  表示导出`test-book`知识库，**跳过**本地同名文件

> ytool pull 18989XXX xxxx test-book/测试目录 skip  表示导出`test-book`知识库下`测试目录`下的文档，**跳过**本地同名文件

> ytool pull 18989XXX xxxx test-book other-book skip 表示导出`test-book`和`other-book`两个知识库，**跳过**本地同名文件

> ytool pull 18989XXX xxxx all skip lb 表示导出**所有**知识库，**跳过**本地同名文件，**保持语雀换行标签**

> ytool pull 18989XXX xxxx note 表示**只导出小记**

#### 高级用法

导出参数支持配置化形式，适合长期使用，采用`yuque-docs/yuque.config.json`进行配置，具体含义见上述[参数说明]

> 以下配置模版可通过`ytool init`直接生成(仅支持2.0版本及以上)

```json
{
  "userName": "XXX",
  "password": "XXX",
  "tocRange": ["xxx知识库", "yyy知识库/zzz目录"], 
  "skipDoc": false, 
  "linebreak": false,
  "host": "",
  "output": "./docs",
  "onlyNote": false,
  "latexcode": false,
  "isUpdate": false,
  "time": ""
}
```

### 清除缓存

工具可能存在因`yuque`接口的不稳定性产生的无法规避的错误(概率较低)，从而导致导出操作失败/异常，此时可以`clear`之后再重试导出操作。

> ytool clear  

### 更新工具

考虑后期此工具(外挂)还会支持更多工具，从2.0版本开始支持便捷的升级操作，采用如下命令即可完成工具升级。

> ytool upgrade

## 最佳实践

此工具开发的初心是将其作为一个将语雀知识库与其它平台数据共享的**介质**，因此也具备很多实践的可能性，
通过语雀作为文字的载体，你可以通过`yuque-tools`实现以下几种可能性：

1. 你有自己的个人博客，通过定制脚本将语雀知识库的内容同步至自己的服务器；
2. 你在多个社区有自己的内容创作，通过定制脚本将语雀知识库的内容同步至内容平台；
3. 你有更灵活的私域/公域的文字记录，通过`yuque-tools`灵活的导出能力，将内容分发至不同的平台；
4. ...

目前具体实践已应用至我个人的 [knowledge-garden](https://github.com/vannvan/knowledge-garden) 中，感兴趣的朋友可以了解其具体实现。

## 推荐

在跨平台文档同步/博客方案方面[elog](https://github.com/LetTTGACO/elog)有着更强大的能力，有需要的朋友可以了解一下此项目

<img width="1674" alt="image" src="https://github.com/vannvan/yuque-tools/assets/43501134/8876287c-c80d-420d-82af-ade2586970d6">

## Issues

[反馈意见](https://github.com/vannvan/yuque-tools/issues) |
[更新记录及计划](https://github.com/vannvan/yuque-tools/blob/main/packages/yuque-tools-cli/CHANGELOG.md)
