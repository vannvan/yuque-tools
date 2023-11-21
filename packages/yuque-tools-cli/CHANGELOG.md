# 更新记录

## 最新版本 v2.2.1

## 目前已支持的知识库结构

测试知识库链接
<https://www.yuque.com/vannvan/dd67e4>
![](https://p.ipic.vip/iqak6t.png)
<!-- 以上知识库会生成如下目录：   -->
<!-- ![](https://p.ipic.vip/gt8pjs.png)   -->
<!-- 以上知识库会生成如下报告：  
![](https://p.ipic.vip/8kmbwg.png) -->

## TODO

- [x] 支持跳过或者覆盖本地已存在文件
- [x] 其他可能出现错误的环节处理
- [x] 语雀换行可选，因为对于`<br/>`标签有些平台认有些平台不认
- [x] 支持空间级别的知识库导出
- [ ] push

## v2.2.1

因为以下原因(12月19号)  

![](https://p.ipic.vip/xywr4h.png)

花了点时间......

总之，可以用了！

## v2.2.0

- [x] 支持导出小记

## v2.1.0

- [x] 支持协作知识库导出
- [x] 交互式选项列表区分知识库类型

## v2.0.0

- [x] 支持空间级别的知识库导出
- [x] 试验性`sdk`能力
- [x] `init`命令，用于初始化配置模版
- [x] `upgrade`命令，用于工具操作

具体使用方法见:[使用方式](https://github.com/vannvan/yuque-tools#使用方式)

## v1.0.0

2023-06-23

- 支持保持语雀换行标签选项，`lb`命令行参数和`linebreak`配置

例如:
> ytool pull 18989XXX xxxx 个人日记 其它XXX skip  lb

具体使用方法见:[导出示例](https://github.com/vannvan/yuque-tools#应用示例)

## v0.0.9

2023-06-17

- 支持跳过或者覆盖本地已存在文件(跳过的文档会体现在导出报告中)
- 支持一行命令完成导出，不用进入交互环节

例如：
> ytool pull 18989XXX xxxx 个人日记 其它XXX skip   表示导出个人日记 其它XXX这两个知识库并不覆盖本地文件
> ytool pull 18989XXX xxxx all skip 表示导出所有并不覆盖本地文件

具体使用方法见:[导出示例](https://github.com/vannvan/yuque-tools#应用示例)

## v0.0.8

2023-06-04

新增可执行程序包[v1.0.0-beta](https://github.com/vannvan/yuque-tools/releases/tag/v1.0.0-beta)

## v0.0.7

2023-05-20

解决的issues

- [x] 支持子文档
- [x] 下载时报错不再中断整体进程

## v0.0.1

2023-04-25

- [x] 基础导出功能
