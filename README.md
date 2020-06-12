# Share Snippet

Share your code snippets through npm, so other developers can enjoy

English｜[中文简体](./README-zh.md)
## Features
With the help of `Share Snippet`, you can easily let other people use your code snippets without developing Snippet plugins

The rules of code snippets are completely in accordance with the custom code snippet rules of [VS Code official documentation](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

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

`tips: All four attributes are required to take effect`
## Warning
1. The plugin will scan files when VS Code start
2. The plugin will only scan files ending in `.code-snippets` in the `share_snippets` directory
3. No matter how deep the directory level is, as long as the file ending in `.code-snippets` in the `share_snippets` directory can be scanned and enabled in the project


**For example**
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
 
## Commands
First you need to press `F1` to open the command input box

| Command Name |                 effect                  |
| :----------: | :-------------------------------------: |
|   Refresh    | Rescan the snippes files in the project |

## Update Log
### 0.0.1
* Scan the code snippet files ending in `.code-snippets` in the `share_snippets` directory in the workspace

---

## In The Future
* [ ] Optimized instructions for rescanning project code snippets
* [ ] Add configurable files to optimize redundant scope content in snippet code
* [ ] The fragment content `body` supports the specified file (that is, the specified file content is used as the content of the fragment)