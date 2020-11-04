import * as vscode from 'vscode';
import * as nodePath from 'path';
import * as nodeFs from 'fs';
import { mergeStringArr, parseJsonFileContent, parseScope, matchPrefix } from './index';
import { Prop, TagComponent, TemplateConfig, languageType, CodeSnippet, componentType } from './../types';
const allTagProperty = 'sp-'; // 提示标签全部属性
let context = {} as vscode.ExtensionContext;
const vueScope = ['vue'];
const reactScope = ['typescriptreact', 'javascriptreact', 'javascript', 'typescript'];

/**
 * 激活模板片段提示
 * @param codeSnippet 片段规则
 */
function getCodeTemplate(prefix: string, description: string, body: string | string[], documentation?: string) {
    body = Array.isArray(body) ? body.join('\n') : body;
    documentation = documentation || body; // 没有默认body作为文档
    return function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        // 当前行
        const line = document.lineAt(position);
        // 只截取到光标位置为止
        const lineText = line.text.substring(0, position.character);
        let words = lineText.split(' ');
        let lastWord = words[words.length - 1];
        if (matchPrefix(prefix, lastWord)) {
            let a = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
            a.detail = description;
            a.documentation = documentation;
            a.insertText = new vscode.SnippetString(body as string);
            return [a];
        }
    };
}

/**
 * 激活组件/标签片段带属性提示
 * @param codeSnippet 片段规则
 */
function getTagCodeTemplate(prop: Prop, tagName: string, type?: componentType) {
    let { key: prefix, description } = prop;
    const documentation = getComponentPropBody(prop, type, 1, true);
    const body = getComponentPropBody(prop, type, 1);

    return function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        // 当前行
        const line = document.lineAt(position);
        // 只截取到光标位置为止
        const lineText = line.text.substring(0, position.character);
        // 1到当前行之间的内容
        const preLineText = document.getText().split('\n').slice(0, position.line).join("");

        // ------------- 处理获取的文本 ----
        const words = lineText.split(' ');
        // 当前正在输入的词
        const inputWord = words[words.length - 1];

        const preText = preLineText + lineText;

        // 确保是被<tagName 包裹
        const lastLeftTag = preText.lastIndexOf(`<${tagName}`);
        const lastRightTag = preText.lastIndexOf('>');

        if (lastLeftTag > 0 && lastLeftTag > lastRightTag && (matchPrefix(prefix, inputWord) || matchPrefix(`${allTagProperty}${prefix}`, inputWord))) {
            let a = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Property);
            a.detail = description;
            a.documentation = documentation;
            a.insertText = new vscode.SnippetString(body);
            let b = new vscode.CompletionItem(`${allTagProperty}${prefix}`, vscode.CompletionItemKind.Property);
            b.detail = description;
            b.documentation = documentation;
            b.insertText = new vscode.SnippetString(body);
            return [a, b];
        }
    };
}

function resolveCompletionItem() {
    return null;
}

/**
 * 激活片段
 */
function registerCodeSnippet(scope: string[], prefixs: string[], provideCompletionItems: any) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(scope,
        { provideCompletionItems, resolveCompletionItem },
        ...prefixs));
}

/**
 * 激活通用组件提示
 * @param v 
 */
function registerTagSnippet(v: TagComponent) {
    const { scope, name: prefix, description, props } = v;
    const scopes = mergeStringArr(parseScope(scope),['html'], vueScope, reactScope);
    const body = getComponentBody(v, 'tag');
    const documentation = getComponentBody(v, 'tag', true);
    // 激活模板代码
    registerCodeSnippet(scopes, [prefix], getCodeTemplate(prefix, description, body, documentation));
    // 激活属性提示
    for (const prop of props) {
        const { key } = prop;
        registerCodeSnippet(scopes, [key], getTagCodeTemplate(prop, prefix, 'tag'));
    }
}

/**
 * 获取组件属性完整内容
 * @param propName 属性名称
 * @param value 属性值
 * @param compType 组件类型
 * @param index 第几个属性
 * @param isDocument 是否用作文档展示
 */
function getComponentPropBody(prop: Prop, compType: componentType = 'tag', index: number, isDocument = false) {
    let { key, bind, value, hide_value } = prop;

    // 如果只展示 属性（bool）
    if (hide_value) {
        return key;
    }
    let values = `$\{${index}|${value}|\}`;

    // 是文档，展示第一个值
    if (isDocument) {
        values = `${value.split(',')[0]}`;
    }

    if (compType === 'react') {
        return `${key}={${bind ? values : `'${values}'`}}`;
    }
    if (compType === 'vue') {
        return `${bind ? ':' : ''}${key}='${values}'`;
    }
    if (compType === 'tag') {
        return `${key}='${values}'`;
    }

    console.error('组件类型不支持');
    return ' ';
}

/**
 * 获取组件完整内容
 * @param v 组件描述
 * @param compType 组件类型
 * @param isDocument 是否用作文档展示
 */
function getComponentBody(v: TagComponent, compType: componentType, isDocument = false) {
    const { name, props, self_closing } = v;

    // 参数拼接出来的str
    const propsStr = props.filter(p => p?.required).map((prop, index) => {
        return getComponentPropBody(prop, compType, index + 1, isDocument);
    }).join(' ');

    return self_closing ? `<${name} ${propsStr} />` : `<${name} ${propsStr} ></${name}>`;
}

/**
 * 激活React组件提示
 * @param v 
 */
function registerReactComponent(v: TagComponent) {
    const { name: prefix, description, props } = v;
    const scopes = reactScope;
    const body = getComponentBody(v, 'react');
    const documentation = getComponentBody(v, 'react', true);

    // 激活模板代码
    registerCodeSnippet(scopes, [prefix], getCodeTemplate(prefix, description, body, documentation));
    // 激活属性提示
    for (const prop of props) {
        const { key } = prop;
        registerCodeSnippet(scopes, [key], getTagCodeTemplate(prop, prefix, 'react'));
    }
}

/**
 * 激活Vue组件提示
 * @param v 
 */
function registerVueComponent(v: TagComponent) {
    const { name: prefix, description, props } = v;
    const scopes = vueScope;
    const body = getComponentBody(v, 'vue');
    const documentation = getComponentBody(v, 'vue', true);

    // 激活模板代码
    registerCodeSnippet(scopes, [prefix], getCodeTemplate(prefix, description, body, documentation));
    // 激活属性提示
    for (const prop of props) {
        const { key } = prop;
        registerCodeSnippet(scopes, [key], getTagCodeTemplate(prop, prefix, 'vue'));
    }
}

/**
 * 激活模板文件
 * @param v 
 */
function registerTemplateSnippet(tempConfig: TemplateConfig, file: vscode.Uri) {
    const { scope, name: prefix, description, path: relativePath } = tempConfig;
    const scopes = parseScope(scope);
    const { path: filepath } = file;
    const dirname = nodePath.dirname(filepath);
    const path = nodePath.resolve(dirname, relativePath);
    nodeFs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            console.error(`${path} not find`);
            return;
        }
        registerCodeSnippet(scopes, [prefix], getCodeTemplate(prefix, description, data, data));
    });
}

/**
 * 解析注册share snippets 文件
 * @param files 
 */
function registerSnippetsFiles(files: vscode.Uri[]) {
    console.log(`共扫描到${files.length}个文件`);
    for (const file of files) {
        vscode.workspace.fs.readFile(file).then(text => {
            try {
                const snippetsConfig = parseJsonFileContent(text.toString());
                const snippets: CodeSnippet[] = Object.values(snippetsConfig);
                snippets.forEach(snippet => {
                    const { type } = snippet;
                    switch (type) {
                        case 'tag':
                            registerTagSnippet(snippet as TagComponent);
                            break;
                        case 'template':
                            registerTemplateSnippet(snippet as TemplateConfig, file);
                            break;
                        case 'component':
                            const t = snippet as TagComponent;
                            if (t.language === 'react') {
                                registerReactComponent(t);
                            }
                            if (t.language === 'vue') {
                                registerVueComponent(snippet as TagComponent);
                            }
                            break;
                    }
                });
            } catch (err) {
                vscode.window.showErrorMessage(`文件${file.path}解析失败`);
            }
        });
    }
}

/**
 * 解析注册 VS code 官方提供的 Code snippets 文件
 * @param files 
 */
function registerCodeSnippetsFiles(files: vscode.Uri[]) {
    console.log(`共扫描到${files.length}个文件`);
    for (const file of files) {
        vscode.workspace.fs.readFile(file).then(text => {
            try {
                const snippetConfig = parseJsonFileContent(text.toString());
                const snippets: CodeSnippet[] = Object.values(snippetConfig);
                snippets.forEach(snippet => {
                    const { scope, prefix, description, body } = snippet;
                    registerCodeSnippet(parseScope(scope), [prefix], getCompletionItem(prefix, description, body));
                });
            } catch (err) {
                vscode.window.showErrorMessage(`文件${file.path}解析失败`);
            }
        });
    }
}

/**
 * 扫描所有符合条件的文件
 */
export function scanSnippets(_context: vscode.ExtensionContext) {
    // 插件的上下文（我猜）
    context = _context;

    // 扫描VS Code 官方模板code-snippets
    vscode.workspace.findFiles('**/**/*.code-snippets').then(files => {
        registerCodeSnippetsFiles(files);
    });

    // 扫描share-snippets
    vscode.workspace.findFiles('**/**/*.share-snippets').then(files => {
        registerSnippetsFiles(files);
    });

    // 扫描share-snippets
    vscode.workspace.findFiles('**/**/*.snippets.json').then(files => {
        registerSnippetsFiles(files);
    });
}

/**
 * 获取补全代码片段的实例
 * @param prefix 激活片段的前缀
 * @param description 片段简介
 * @param body 片段的完整内容
 * @param documentation 片段的文档提示
 */
function getCompletionItem(prefix: string, description: string, body: string | string[], documentation?: string) {
    body = Array.isArray(body) ? body.join('\n') : body;
    documentation = documentation || body; // 没有默认body作为文档
    return function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        // 当前行
        const line = document.lineAt(position);
        // 只截取到光标位置为止
        const lineText = line.text.substring(0, position.character);
        let words = lineText.split(' ');
        let lastWord = words[words.length - 1];
        if (matchPrefix(prefix, lastWord)) {
            let a = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
            a.detail = description;
            a.documentation = documentation;
            a.insertText = new vscode.SnippetString(body as string);
            return [a];
        }
    };
}