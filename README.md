<center>

# Share Snippet
分享你的代码片段通过npm包的形式，让其它的开发者都能够体验到

<font color="green" style="font-weight:bold;">我</font>来搞定插件，<font color="red" style="font-weight:bold;">你</font> 来编写snippet提示规则

[English](./README-en.md)｜中文简体
</center>

## 效果图
![](https://img.cdn.sugarat.top/images/snippet/snippet1.gif)

## npm 包开发示例
>share-snippets-demo
* [NPM地址](https://www.npmjs.com/package/share-snippets-demo)
* [GitHub](https://github.com/ATQQ/share-snippets-demo)

可以clone或者fork项目，然后编写自己的代码片段，发布到[NPM](https://www.npmjs.com/)

**文末会专门配置文件规则**

## 功能
### 1. 代码片段提示
借助`Share Snippet`无需你开发Snippet插件，就能轻松的让其它人使用你的代码片段

代码片段的规则完全参照[VS Code官方文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)的自定义代码片段规则

即自动扫描工作区中的`code-snippets`文件，并在工作区生效（VS Code默认只生效.vscode目录下的snippet文件）

下面是一个console.log的例子

```json
// demo.code-snippets
{
  "Print Text": {
    "scope":"javascript,typescript,vue,react", 
    "prefix": "lg", 
    "body": "console.log($1)", 
    "description": "console.log"
  }
}
```
**效果**

![](https://img.cdn.sugarat.top/images/snippet/snippet-lg.gif)

`tips：四个属性都为必填值才能生效`

**code-snippets文件属性简介**

拿上面的例子来阐述
* Print Text：片段名称（一个文件中可以出现多个，只要不重复）
  * scope：生效的范围，vs code支持的语言
  * prefix：触发代码片段的字符
  * body：代码片段的内容，类型为 string 或者 string[]
  * description：此代码片段的描述

### 2. 组件的属性提示

下面是一个简单的vue组件
```json
// input.snippets.json
{
    "my input": {
        "type": "component",
        "language": "vue",
        "description": "组件描述",
        "name": "my-button",
        "self_closing":true,
        "props": [
            {
                "key":"placeholder",
                "value":"请输入名称",
                "description":"提示内容",
                "required":true
            },
            {
                "key":"size",
                "description":"大小",
                "value":"small,large"
            },
            {
                "key":"readonly",
                "description":"只读状态",
                "bind":true,
                "value":"true,false"
            },
            {
                "key":"clearable",
                "description":"可清空",
                "hide_value": true,
                "bind":true,
                "value":"true"
            },
            {
                "key":"type",
                "value":"text,number,email",
                "description":"输入框类型"
            }
        ]
    }
}
```
**效果**

![](https://img.cdn.sugarat.top/images/snippet/snippet-input.gif)

`tips:可以通过sp-xxx展示所有的属性`
### 3. 指定模板文件作为snippet
```json
// vue3.snippets.json
{
    "Composition Api": {
        "type": "template",
        "scope": "vue",
        "description": "Composition Api",
        "name": "compositionAPI",
        "path":"./files/compositionAPI.js"
    }
}
```
```js
// compositionAPI.js
import { defineComponent, reactive, ref, onMounted, computed } from '@vue/composition-api'
```
**效果**

![](https://img.cdn.sugarat.top/images/snippet/snippet-composition.gif)
## 注意
1. 插件会在VS Code启动的时候进行文件的扫描
2. 插件只会扫描以`.code-snippets`(官方代码片段的规则)和`.snippets.json`,`.share-snippets`结尾的文件
   * 推荐使用`.snippets.json`,对编写更友好
3. 只要是在工作区，`node_modules`目录下的符合条件的也会被扫描并启用

**比如**
 ```text
├── share_snippets
│   ├── snippets
│   │   ├── comment
│   │   │   └── comment.code-snippets
│   │   ├── components
│   │   │   ├── form.snippets.json
│   │   │   └── input.snippets.json
│   │   └── js
│   │       └── js.code-snippets
│   └── template
│       ├── files
│       │   ├── compositionAPI.js
│       │   └── vue3-temp.vue
│       └── vue3.snippets.json
 ```

## 配置规则
**.snippets.json**

全属性示例展示
```json
{
    "snippet name":{
        "type":"",
        "scope":"",
        "description":"",
        "name":"",
        "language":"",
        "self_closing":"",
        "path":"",
        "props":[
            {
                "key":"",
                "value":"",
                "description":"",
                "required":"",
                "bind":"",
                "hide_value":"",
            }
        ]
    },
    "snippet name2":{
        "同上":"一个配置文件可以配置多个snippet"
    }
}
```

**属性详细介绍**

|     名称     |   类型   |          描述          |    值范围\|解释     |            举例             | 是否必填 |
| :----------: | :------: | :--------------------: | :-----------------: | :-------------------------: | :------: |
| snippet name |  string  |        片段名称        |          -          |        "snippet":""         |    √     |
|     type     |  string  |        片段类型        | template\|component |      "type":"template"      |    √     |
|      -       |    -     |        template        |      模板代码       |      "type":"template"      |    -     |
|      -       |    -     |       component        |        组件         |     "type":"component"      |    -     |
|   language   |  string  |        组件类别        | vue \| react \| tag |      "language":"vue"       |    -     |
|    scope     |  string  |        生效范围        | vs code 支持的语言  |  "scope":"vue,javascript"   |    -     |
| description  |  string  |        片段描述        |          -          | "description":"console.log" |    √     |
|     name     |  string  |  触发snippet的prefix   |          -          |        "name":"log"         |    √     |
| self_closing | boolean  |    是否是自闭和组件    |    true \| false    |     "self_closing":true     |    -     |
|     path     |  string  | 引用的模板文件相对路径 |          -          |    "path":"./files/1.js"    |    -     |
|    props     | object[] |        组件属性        |       见下表        |              -              |    -     |

**props的属性介绍**


|    名称     |  类型   |          描述          | 值范围\|解释 |            举例            | 是否必填 |
| :---------: | :-----: | :--------------------: | :----------: | :------------------------: | :------: |
|     key     | string  |        属性名称        |      -       |       "key":"input"        |    √     |
|    value    | string  |         属性值         |      -       | "value":"text,number,date" |    √     |
| description | string  |        属性描述        |      -       | "description":"输入框组件" |    √     |
|  required   | boolean | 是否在初始化的时候展示 | [true,false] |      “required”:true       |    -     |
|    bind     | boolean |    是否是绑定的变量    | [true,false] |        "bind":true         |    -     |
| hide_value  | boolean |    是否隐藏属性的值    | [true,false] |     "hide_value":false     |    -     |

## 指令
首先需要按`F1`打开命令输入框

|  指令名称  |           作用           |
| :--------: | :----------------------: |
| SP Refresh | 重新扫描项目中的片段文件 |

![图片](https://img.cdn.sugarat.top/mdImg/MTYxOTU4MjczMzA0OA==619582733048)

## 内置snippet
| 触发前缀 | 生效范围 |             作用             |
| :------: | :------: | :--------------------------: |
| ss-file  |   json   |   生成模板代码snippet模板    |
|  ss-tag  |   json   |  生成h5标签代码snippet模板   |
|  ss-vue  |   json   |  生成vue组件代码snippet模板  |
| ss-react |   json   | 生成react组件代码snippet模板 |

## 未来
* [x] 优化重新扫描项目代码片段的指令
* [x] 加入可配置文件，优化片段代码中冗余的`scope`内容
* [ ] 文档加入预览图，便于了解每个属性的效果
* [ ] 自动生成prefix文档
* [ ] 能在自定义位置插入 UI 图预览提示节点信息，方便对照DOM结构