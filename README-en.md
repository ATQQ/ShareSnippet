<center>

# Share Snippet
Share your code snippets in the form of npm packages, so that other developers can experience

<font color="green" style="font-weight:bold;">I </font>will write the plugin，<font color="red" style="font-weight:bold;">you</font> will write the snippet rules

English｜[中文简体](./README.md)
</center>

## Resuult
![](https://img.cdn.sugarat.top/images/snippet/snippet1.gif)

## npm example
>share-snippets-demo
* [NPM Address](https://www.npmjs.com/package/share-snippets-demo)
* [GitHub](https://github.com/ATQQ/share-snippets-demo)

You can clone or fork the project, and then write your own code snippets and publish to[NPM](https://www.npmjs.com/)

**The configuration rules will be introduced at the end of the article**

## Features
### 1. Code snippet
With `Share Snippet`, you can easily let others use your code snippets without you developing a Snippet plugin

The code snippet rules completely refer to the custom code snippet rules of[VS Code official document](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

That is, automatically scan the `code-snippets` file in the workspace and take effect in the workspace (VS Code only takes effect in the snippet file in the .vscode directory by default)

The following is an example of console.log

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
**result**

![](https://img.cdn.sugarat.top/images/snippet/snippet-lg.gif)

`tips：All four attributes are required values to take effect`

**Introduction to code-snippets file attributes**

Take the example above to illustrate
* Print Text：Snippet name (There can be more than one in a file, as long as it is not repeated)
  * scope：Effective range, languages supported by vs code
  * prefix：The character that triggered the code snippet
  * body：The content of the code Snippet, the type is string or string[]
  * description：Description of this code snippet

### 2. Label/component attribute prompt

Below is a simple input component
```json
// input.snippets.json
{
    "my input": {
        "scope": "vue",
        "type": "tag",
        "description": "文本输入框 my-input",
        "name": "my-input",
        "self_closing":true,
        "props": [
            {
                "key":"labelWidth",
                "value":"120",
                "bind":true,
                "description": "label宽度",
                "required":true
            },
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
**result**

![](https://img.cdn.sugarat.top/images/snippet/snippet-input.gif)

`tips:All attributes can be displayed through sp-xxx`
### 3. Specify the template file as a snippet
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
**result**

![](https://img.cdn.sugarat.top/images/snippet/snippet-composition.gif)

## Note
1. The plugin will scan the file when VS Code starts
2. The plugin will only scan files ending with `.code-snippets` (rules of official code snippets) and `.snippets.json`, `.share-snippets` (rules defined by share-snippets plugin) (recommended)
3. As long as it is in the workspace, the eligible items in the `node_modules` directory will also be scanned and enabled

**example**
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

## Configuration rules
**.snippets.json**

Full attribute example display
```json
{
    "snippet name":{
        "type":"",
        "scope":"",
        "description":"",
        "name":"",
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
        "Same as above":"One configuration file can configure multiple snippets"
    }
}
```

**Property details**

|     Name     |   Type   |                Description                |    Value range\|Explanation    |           Example           | required |
| :----------: | :------: | :---------------------------------------: | :----------------------------: | :-------------------------: | :------: |
| snippet name |  string  |               Snippet name                |               -                |        "snippet":""         |    √     |
|     type     |  string  |               Snippet type                |         template\|tag          |        "type":"tag"         |    √     |
|      -       |    -     |                 template                  |         Template code          |      "type":"template"      |    -     |
|      -       |    -     |                    tag                    |         Tag/Component          |        "type":"tag"         |    -     |
|    scope     |  string  |              Effective range              | Languages supported by vs code |    "scope":"vue,js,html"    |    √     |
| description  |  string  |            Snippet description            |               -                | "description":"console.log" |    √     |
|     name     |  string  |     Trigger the prefix of the snippet     |               -                |        "name":"log"         |    √     |
| self_closing | boolean  |       Is it autistic and component        |          [true,false]          |     "self_closing":true     |    -     |
|     path     |  string  | Relative path of referenced template file |               -                |    "path":"./files/1.js"    |    -     |
|    props     | object[] |           Component properties            |        See table below         |              -              |    -     |

**Introduction to props**

|    Name     |  Type   |                Description                 | Value range\|Explanation |               Example               | required |
| :---------: | :-----: | :----------------------------------------: | :----------------------: | :---------------------------------: | :------: |
|     key     | string  |               Property name                |            -             |            "key":"input"            |    √     |
|    value    | string  |              Attribute value               |            -             |     "value":"text,number,date"      |    √     |
| description | string  |            Property description            |            -             | "description":"input box component" |    √     |
|  required   | boolean |  Whether to display during initialization  |       [true,false]       |           "required":true           |    -     |
|    bind     | boolean |           Is it a bound variable           |       [true,false]       |             "bind":true             |    -     |
| hide_value  | boolean | Whether to hide the value of the attribute |       [true,false]       |         "hide_value":false          |    -     |

## Command
First, you need to press `F1` to open the command input box

|  Name   |                Effect                |
| :-----: | :----------------------------------: |
| Refresh | Rescan fragment files in the project |

![图片](https://img.cdn.sugarat.top/mdImg/MTYxOTU4MjczMzA0OA==619582733048)
## Snippet
|  prefix  | effect range |                  description                   |
| :------: | :----------: | :--------------------------------------------: |
| ss-file  |     json     |    Generate template code snippet template     |
|  ss-tag  |     json     |     Generate h5 tag code snippet template      |
|  ss-vue  |     json     |  Generate vue component code snippet template  |
| ss-react |     json     | Generate react component code snippet template |

## Future
* Optimize the instruction of rescanning project code snippets
* Add configurable files to optimize redundant `scope` content in fragment code
* The document is added to the preview image to facilitate understanding of the effect of each attribute
* Automatically generate prefix document
