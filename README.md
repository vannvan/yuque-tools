# yuque-tools

语雀知识库内容批量导出和二次处理工具(非TOKEN方式)  
特别说明:由于此方案采用账号登录方式，出于安全需求考虑，仅支持本地化操作，源码无窃取用户信息的脚本，因此无需担心信息泄漏。

## 缘何

1. 语雀目前非会员用户取消了token授权功能  
2. [yuque-exporter](https://github.com/yuque/yuque-exporter/tree/cli)采用读取原始文档方式，部分html节点无法处理  
  具体情况如下
![](https://p.ipic.vip/xgq0vl.png)
![](https://p.ipic.vip/7gurgh.png)
以上导出经转义后的md文档仍有多余的a标签(a标签可以采用正则匹配去除掉，但如果文档本身就有类似标签就无法区分了)，可能后面语雀会优化此问题吧，但他眼下没有。
3. 支持对文档的再加工(可配置)，以适配其他平台的md格式  

- 例如hexo的title需要这样的

```bash
---
title: 阿哈哈哈啊
---
```

- hugo的title这样的

```bash
---
title: "阿哈哈哈啊"
date: 2023-03-26T16:37:36+08:00
draft: true
---
```

- 自定义md尾部版权归属  
- 其它内容自定义替换的

4. 语雀后续对自己内容对外输出的通道应该会收紧(猜测)，此方案具有更大的能力和扩展性(基本可以为所欲为)

## 实现过程

[] 登录语雀获取cookie  
[] 获取到知识库列表，存储slug username id
[] 交互式选择需要导出到知识库  
[] 根据上一步获取到的id，再获取某个知识库下的文档列表  
[] 可选择保留原目录结构或导出为扁平结构  
[] 生成md文档到本地

## APIs

- 登录 <https://www.yuque.com/api/accounts/login>

- 获取知识库列表 <https://www.yuque.com/api/mine/book_stacks>

- 获取知识库的文档(扁平列表) <https://www.yuque.com/api/docs?book_id=XXXX>

- 获取知识库的文档(带目录) <https://www.yuque.com/repos>

- 导出 <https://www.yuque.com/docs/markdown?attachment=true&latexcode=false&anchor=false&linebreak=false>

> repos 代表 用户名/知识库slug  
> docs 代表  用户名/知识库slug/文档slug

## 打开方式

### CLI
>
> npm i yuque-tools -g

创建目录yuque-docs

> ytool userName password  

账号信息支持配置化,适合长期使用  
yuque-docs/yuque.config.json

```json
{
  "userName": "XXX",
  "password": "XXX",
}
```

完成登录后会进入交互式选择知识库环节，选择需要导出的知识库即可

### 源码
>
> npm run yuque userName password

同样可采用项目根目录的.yuquerc.js长期使用

## TODO

[]
