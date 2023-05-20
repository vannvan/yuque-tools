# 语雀知识库批量导出和再处理工具(非TOKEN方式,非官方)  

![](https://badgen.net/npm/dm/yuque-tools)
![](https://badgen.net/npm/v/yuque-tools)
![](https://badgen.net/npm/node/next)

## 样例

[![example.gif](https://www.z4a.net/images/2023/05/01/example.gif)](https://www.z4a.net/image/VmUHiO)

## 缘何

1. 语雀目前非会员用户取消了token授权功能  
2. [yuque-exporter](https://github.com/yuque/yuque-exporter/tree/cli)采用读取原始文档方式，部分html节点无法处理

> 此方案借鉴了[yuque-exporter](https://github.com/yuque/yuque-exporter/tree/cli)的一些思路，感谢`atian25`  

具体情况如下
![](https://p.ipic.vip/xgq0vl.png)
![](https://p.ipic.vip/7gurgh.png)  
以上导出经转义后的md文档仍有多余的a标签(a标签可以采用正则匹配去除掉，但如果文档本身就有类似标签就无法区分了)，可能后面语雀会优化此问题，但他眼下没有。  
3. 支持对文档的再加工(可配置)，以适配其他平台的md格式  

- 例如hexo的title需要这样的

```bash
---
title: Hello World!
---
```

- hugo的title需要这样的

```bash
---
title: "Hello World!"
date: 2023-03-26T16:37:36+08:00
draft: true
---
```

- 自定义md尾部版权归属  
- 其它内容需要自定义替换的

4. 语雀后续对自己内容对外输出的通道应该会收紧(猜测)，此方案具有更大的能力和扩展性(基本可以为所欲为)

## 特别说明
>
> 安全问题：由于此方案采用账号登录方式，出于安全需求考虑，仅支持本地化操作，源码无窃取用户信息的脚本，因此无需担心信息泄漏，可放心使用。

> 文档说明：此工具仅具备导出标准`Markdown`格式的文档，其他的文档格式都是语雀私有协议的富文本格式，工具其实就是它页面`导出`功能的批量操作版，对于私有协议的富文本格式其它平台也是不能按照预期显示的，就算导出为`pdf`或其它格式，也不具备其它工具/平台的友好显示功能，同时工具本身是无法识别文档内容是什么格式的(可能多种格式混用的情况)，因此对于导出非`Markdown`类型的文档不在这个工具的设想范围内，此类文档一般会导出失败，工具有生成导出报告，可根据导出报告再去语雀手动导出为更适合的格式。

> 功能说明：此工具本意在于为`Markdown`文档记录者提供语雀文档多平台数据同步功能，并无“抛弃语雀”导向(作者本人是语雀的重度使用者)，希望做一个语雀当下未提供但实则刚需的功能。

## 实现过程

1. 登录语雀获取cookie  

2. 获取到知识库列表，存储slug username id
3. 交互式选择需要导出到知识库  
4. 根据上一步获取到的id，再获取某个知识库下的文档列表  
5. 可选择保留原目录结构或导出为扁平结构 (暂未实现)
6. 生成md文档到本地

## APIs

- 登录 <https://www.yuque.com/api/accounts/login>

- 获取知识库列表 <https://www.yuque.com/api/mine/book_stacks>

- 获取知识库的文档(扁平列表) <https://www.yuque.com/api/docs?book_id=XXXX>

- 获取知识库的文档(带目录) <https://www.yuque.com/repos>

- 导出 <https://www.yuque.com/docs/markdown?attachment=true&latexcode=false&anchor=false&linebreak=false>

> repos 代表 用户名/知识库slug  
> docs 代表  用户名/知识库slug/文档slug

## 使用方式

### CLI方式

整体步骤

pull -> 登录 -> 交互式选择知识库 -> 等待下载完成

目前登录完成后会设置一天的有效时间，也就是说在24小时之内重复导出只有第一次需要登录。

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

### 源码方式
>
> npm run yuque

导出完成后的知识库在`yuque-docs/docs`文件夹中，目前默认会以语雀原始目录结构存放，同时缓存信息在`yuque-docs/.meta`文件夹中。

## TODO

基础功能已完善，目前缺少各流程的容错环节，后续会完善

- [x] CLI完善
- [ ] 代码优化
- [ ] 导出参数配置化
- [ ] 文件名称可能存在的特殊字符处理

## issues

[反馈意见](https://github.com/vannvan/yuque-tools/issues)
[更新记录⭐️](https://github.com/vannvan/yuque-tools/issues/9)

本项目可以共创，欢迎提意见或参与功能优化工作，如果有帮助欢迎点个鼓励的⭐️
