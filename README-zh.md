# Share Snippet

分享你的代码片段通过npm，让其它的开发者都能够体验到

[English](./README.md)｜中文简体
## 特点
借助`Share Snippet`无需你开发Snippet插件，就能轻松的让其它人使用你的代码片段

代码片段的规则完全参照[VS Code官方文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)的自定义代码片段规则


`demo.code-snippets`
```json
{
  "Print Text": {
    "scope":"javascript,typescript,vue,react",
    "prefix": "lg",
    "body": "console.log($1)",
    "description": "console.log"
  }
}
```
`tips：四个属性都为必填值才能生效`

## 注意
1. 插件会在VS Code启动的时候进行文件的扫描
2. 插件只会扫描`share_snippets`目录下以`.code-snippets`结尾的文件
3. 无论目录层级多深只要是在`share_snippets`目录下以`.code-snippets`结尾的文件都能被扫描到并在项目中启用


**比如**
 ```text
 node_modules
 └── package1Name
 │   └──share_snippets
 │       ├── comment
 │       │   └── test1.code-snippets
 │       └── test2.code-snippets
 └── package2Name
     └──share_snippets
         ├── comment
         │   └── test1.code-snippets
         └── test2.code-snippets
 share_snippets
     ├── comment
     │   └── test1.code-snippets
     └── vue
         └── test2.code-snippets
 ```

## 指令
首先需要按`F1`打开命令输入框

| 指令名称 |           作用           |
| :------: | :----------------------: |
| Refresh  | 重新扫描项目中的片段文件 |

## 更新日志
### 0.0.1
* 扫描工作区中`share_snippets`目录下以`.code-snippets`结尾的代码片段文件

---
## 未来
* [ ] 优化重新扫描项目代码片段的指令
* [ ] 加入可配置文件，优化片段代码中冗余的`scope`内容
* [ ] 片段内容`body`支持指定的文件(即将指定的文件内容作为片段的内容)
