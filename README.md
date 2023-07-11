# 语雀知识库批量导出和再处理工具(非TOKEN方式,非官方)  

![](https://badgen.net/npm/dm/yuque-tools)
![](https://badgen.net/npm/v/yuque-tools)
![](https://badgen.net/npm/node/next)

[了解实现过程-与其它工具有什么不一样](https://github.com/vannvan/yuque-tools/blob/main/ABOUT.md)

## 样例

[![example.gif](https://www.z4a.net/images/2023/05/01/example.gif)](https://www.z4a.net/image/VmUHiO)

## 使用方式

### 整体步骤

pull -> 登录 -> 交互式选择知识库(命令行参数完整不会进入交互式环节) -> 等待下载完成

目前登录完成后会设置一天的有效时间，也就是说在24小时之内重复导出只有第一次需要登录。

### CLI方式

#### 安装
>
> npm i yuque-tools -g 安装到全局  
> npm i yuque-tools 安装到局部  
> 安装到全局以下方法使用`ytool xx`，安装到局部以下方法使用`npx ytool xx`

#### 导出 pull

创建目录`yuque-docs`并进入目录

> ytool pull

##### 参数说明

|参数|说明|是否必填|
|--|--|--|
|userName password | 语雀账号和密码|是|
|tocRange|例如: `test-book/测试目录 test-book2`，多个知识库之间空格隔开|否|
|all | 导出所有知识库|否|
|skip | 导出时跳过本地同名文件|否|
|lb | 导出时保留语雀换行标签，即`<br/>`标签|否|
|host | 用于`空间`类型的知识库域名，例如: `https://van.yuque.com`，后面不要有斜杠(`/`)|否|
|output|导出目录，例如: `./mydocs`，默认为`docs`|否|

> 为降低命令行使用时的复杂性，对于`host`及`output`仅支持配置形式使用且不会进入闻讯环节，具体配置方式见以下[TIPS](#tips)⬇️
>
##### 导出示例

以 [我的测试知识库](https://www.yuque.com/vannvan/dd67e4) 为例

以上参数生效的前提是`userName`和`password`同时存在，且在所有参数最前面，其它参数顺序均无具体要求

> ytool pull 18989XXX xxxx test-book skip  表示导出`test-book`这个知识库，跳过本地同名文件

> ytool pull 18989XXX xxxx test-book/测试目录 skip  表示导出`test-book`这个知识库下的`测试目录`下的文档，跳过本地同名文件

> ytool pull 18989XXX xxxx test-book other-book skip 表示导出`test-book`和`other-book`两个知识库，跳过本地同名文件

> ytool pull 18989XXX xxxx all skip 表示导出所有知识库，跳过本地同名文件

> ⚠️ ytool pull 什么都没有传的情况下，以上所有需要的信息都会进入交互式问询环节

#### 清除缓存 clean

工具可能存在因`yuque`接口的不稳定性产生的无法规避的错误(概率较低)，从而导致导出操作失败/异常，此时可以`clean`之后再重试导出操作。

> ytool clean  

#### TIPS

导出参数知识配置化形式，适合长期使用 `yuque-docs/yuque.config.json`(固定的配置文件名称)，具体含义与上述[参数说明]一致

```json
{
  "userName": "XXX",
  "password": "XXX",
  "tocRange":["个人日记","其它XXX"], 
  "skipDoc": false, 
  "linebreak": false,
  "host":"",
  "output":""
}
```

### 程序包

此方式适用于无`Node`环境的朋友们(试验方案，不能确保所有平台都能使用)👉
[程序包](https://github.com/vannvan/yuque-tools/releases/tag/v1.0.0-beta)

### 最佳实践

此工具开发的初心是将其作为一个将语雀知识库与其它平台数据共享的`介质`，因此也具备很多实践的可能性，
通过语雀作为文字的载体，你可以通过`yuque-tools`实现以下几种可能性：

1. 你有自己的个人博客，通过定制脚本将语雀知识库的内容同步至自己的服务器；
2. 你在多个社区有自己的内容创作，通过定制脚本将语雀知识库的内容同步至内容平台；
3. 你有更灵活的私域/公域的文字记录，通过`yuque-tools`灵活的导出能力，将内容分发至不同的平台；
4. ...

目前具体实践已应用至我个人的 [knowledge-garden](https://github.com/vannvan/knowledge-garden) 中，感兴趣的朋友可以了解其具体实现。

## issues

[反馈意见](https://github.com/vannvan/yuque-tools/issues) |
[更新记录](https://github.com/vannvan/yuque-tools/blob/main/CHANGELOG.md)

欢迎提供更好的意见，如果有帮助欢迎点个鼓励的⭐️
