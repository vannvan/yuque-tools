## 简介

项目主要采用`pnpm` `monorepo`进行管理，但省略了复杂的企业化规范，了解基本原理即可进行开发，欢迎参与bug修复以及更好的idea实现。

## 开发步骤

### 安装依赖

在项目根目录安装即可

> pnpm i

### yuque-tools-cli

定位：主要用于在命令行进行批量操作，后续还会扩展其它适用于命令行操作的功能

进入yuque-tools-cli目录

> npm run watch 启动  
> npm link 链接到全局  

此时便可以进行调试开发了。

### yuque-tools-chrome-extention

定位：浏览器插件工具，想象空间很大，目前还未成形(11.22)

进入yuque-tools-chrome-extention目录

> npm run dev 启动  

打开浏览器扩展页 `chrome://extensions/`，开启**开发者模式**，将`build`目录直接拖入浏览器（或者点击**加载已解压的扩展程序**后选择该目录）

## 规范

配各种lint和格式化工具太过繁琐，但仍建议您在编辑器层面遵循基本的约束

- 推荐使用prettier进行代码格式化
- 推荐使用es-lint完成基本的语法校验

## PR

开发时请从`dev`分支拉取代码，合并也往`dev`分支合即可。

## 参考文档

- [pnpm中文文档](https://www.pnpm.cn/installation)

## 此文档信息

2023.11.22 by vannvan
