# Share Snippet

分享你的代码片段通过npm包的形式，让其它的开发者都能够体验到

[English](./README.md)｜中文简体
## 效果图
![图片](http://img.cdn.sugarat.top/mdImg/MTU5NDIwOTE1Mjg0NQ==ezgif.com-video-to-gif.gif)

## npm 包开发示例
>share-snippets-demo
* [NPM地址](https://www.npmjs.com/package/share-snippets-demo)
* [GitHub](https://github.com/ATQQ/share-snippets-demo)

可以clone或者fork项目，然后编写自己的代码片段，发布到[NPM](https://www.npmjs.com/)
## 特点
### 亮点1
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
### 亮点2
标签属性提示

`demo.share-snippets`
```json
{
    "my button": {
        "scope": "vue",
        "type": "tag",
        "description": "my button component",
        "name": "my-button",
        "props": [
            {
                "key": "type1",
                "value": "value1,value2,value3",
                "description": "自定义属性1",
                "required":"1"
            },
            {
                "key": "type2",
                "value": "value1,value2,value3",
                "description": "自定义属性2"
            }
        ]
    }
}
```


## 注意
1. 插件会在VS Code启动的时候进行文件的扫描
2. 插件只会扫描`share_snippets`目录下以`.code-snippets`(官方代码片段的规则)和`.share-snippets`(share-snippets插件定义的规则)结尾的文件
3. 无论目录层级多深只要是在`share_snippets`目录下都能被扫描到并在项目中启用

**比如**
 ```text
 node_modules
 └── package1Name
 │   └──share_snippets
 │       ├── comment
 │       │   └── test1.code-snippets
 │       └── test2.share-snippets
 └── package2Name
     └──share_snippets
         ├── comment
         │   └── test1.code-snippets
         └── test2.share-snippets
 share_snippets
     ├── comment
     │   └── test1.code-snippets
     └── vue
         └── test2.share-snippets
 ```

## 指令
首先需要按`F1`打开命令输入框

| 指令名称 |           作用           |
| :------: | :----------------------: |
| Refresh  | 重新扫描项目中的片段文件 |

## 更新日志
### 0.0.1
* 扫描工作区中`share_snippets`目录下以`.code-snippets`结尾的代码片段文件

### 0.0.2
* 在README.md中添加share-snippets npm包开发文档和演示

### 0.0.3
* 新增.share-snippets文件支持
  * 支持标签snippet的属性提示

---
## 未来
* [ ] 优化重新扫描项目代码片段的指令
* [ ] 加入可配置文件，优化片段代码中冗余的`scope`内容
* [ ] 片段内容`body`支持指定的文件(即将指定的文件内容作为片段的内容)
* [ ] 自动生成prefix文档
