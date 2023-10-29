## 缘何

1. 语雀目前非会员用户取消了`TOKEN`授权功能  
2. [yuque-exporter](https://github.com/yuque/yuque-exporter/tree/cli)采用读取原始文档方式，部分`HTML`节点无法处理

> 此方案借鉴了[yuque-exporter](https://github.com/yuque/yuque-exporter/tree/cli)的一些思路，感谢`atian25`  

具体情况如下
![](https://p.ipic.vip/xgq0vl.png)
![](https://p.ipic.vip/7gurgh.png)  
以上导出经转义后的文档仍有多余的`a`标签(`a`标签可以采用正则匹配去除掉，但如果文档本身就有类似标签就无法区分了)。 

3. 语雀后续对自己内容对外输出的通道应该会收紧(猜测)，此方案具有更大的能力和扩展性(基本可以为所欲为)

## 特别说明
>
> 安全问题：由于此方案采用账号登录方式，出于安全需求考虑，仅支持本地化操作，源码无窃取用户信息的脚本，因此无需担心信息泄漏，可放心使用。

> 文档说明：此工具仅具备导出标准`Markdown`格式的文档，其他的文档格式都是语雀私有协议的富文本格式，工具其实就是它页面`导出`功能的批量操作版，对于私有协议的富文本格式其它平台也是不能按照预期显示的，就算导出为`pdf`或其它格式，也不具备其它工具/平台的友好显示功能，同时工具本身是无法识别文档内容是什么格式的(可能多种格式混用的情况)，因此对于导出非`Markdown`类型的文档不在这个工具的设想范围内，此类文档一般会导出失败，工具有生成导出报告，可根据导出报告再去语雀手动导出为更适合的格式。

> 功能说明：此工具本意在于为`Markdown`文档记录者提供语雀文档多平台数据同步功能，并无“抛弃语雀”导向(作者本人是语雀的重度使用者)，希望做一个语雀当下未提供但实则刚需的功能。

## 实现过程

1. 登录语雀获取`Cookies`  
2. 获取到知识库列表
3. 交互式选择需要导出到知识库  
4. 根据上一步获取到的知识库`ID`，再获取某个知识库下的文档列表  
5. 生成与原知识库结构相同的`Markdown`文档到本地

## APIs

- 登录 <https://www.yuque.com/api/accounts/login>

- 获取知识库列表 <https://www.yuque.com/api/mine/book_stacks>

- ~获取知识库的文档(扁平列表) <https://www.yuque.com/api/docs?book_id=XXXX>~ 

- 获取知识库的文档(带目录) <https://www.yuque.com/repos>

- 导出 <https://www.yuque.com/docs/markdown?attachment=true&latexcode=false&anchor=false&linebreak=false>

