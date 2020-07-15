import * as vscode from 'vscode';
const allTagProperty = 'sp-'; // 提示标签全部属性
interface Prop {
	key: string
	value: string
	description: string
	required: boolean // 是否必要的属性
	bind: boolean // 是否以 :param=”xx” 的形式展示
	hide_value:boolean // 是否展示值选择列表
}
interface CodeSnippet {
	scope: string, // 支持的语言列表
	prefix: string, // 前缀
	body: string | string[], // 片段内容
	description: string // 片段描述
	type: string
}

interface TagComponent extends CodeSnippet {
	name: string // 组件名称
	props: Prop[] // 参数
	self_closing: boolean // 自闭和
}
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "snippet" is now active!');

	/**
	 * 激活模板片段提示
	 * @param codeSnippet 片段规则
	 */
	function getCodeTemplate(prefix: string, description: string, body: string | string[],documentation?:string) {
		body  = typeof body === 'object' ? body.join('\n') : body;
		documentation = documentation || body; // 没有默认body作为文档
		return function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			// 当前行
			const line = document.lineAt(position);
			// 只截取到光标位置为止
			const lineText = line.text.substring(0, position.character);
			let words = lineText.split(' ');
			let lastWord = words[words.length - 1];
			if (prefix.includes(lastWord)) {
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
	function getTagCodeTemplate(prop: Prop, tagName: string) {
		let { key: prefix, description, bind, value: body,hide_value } = prop;
		const documentation = hide_value?prefix:`${bind?':':''}${prefix}='${body?.split(',')[0]}'`; // 生成后的内容
		body = hide_value?prefix:`${bind?':':''}${prefix}='$\{1|${body}|\}'`; // 用于片段的内容
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
			// TODO：待优化
			if (lastLeftTag > 0 && lastLeftTag > lastRightTag && (prefix.startsWith(inputWord) || `${allTagProperty}${prefix}`.startsWith(inputWord))) {
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

	// getProvideCompletionItems(codeSnippet)
	/**
	 * 注册片段
	 * @param codeSnippet 
	 */
	function registerCodeSnippet(scope: string[], prefixs: string[], provideCompletionItems: any) {
		context.subscriptions.push(vscode.languages.registerCompletionItemProvider(scope,
			{ provideCompletionItems, resolveCompletionItem },
			...prefixs));
	}



	/**
	 * 扫描所有符合条件的文件
	 */
	function scanSnippets() {
		// 扫描VS Code 官方模板code-snippets
		vscode.workspace.findFiles('**/**/*.code-snippets').then(files => {
			console.log(`共扫描到${files.length}个文件`);
			for (const file of files) {
				vscode.workspace.fs.readFile(file).then(text => {
					try {
						let code = JSON.parse(JSON.stringify(eval("(" + text.toString() + ")")));
						let SnippetsObjs: CodeSnippet[] = Object.values(code);
						SnippetsObjs.forEach(v => {
							let { scope, prefix, description, body } = v;
							registerCodeSnippet(scope ? scope.split(',') : ['*'], [prefix], getCodeTemplate(prefix, description, body));
						});
					} catch (err) {
						vscode.window.showErrorMessage(`文件${file.path}解析失败`);
					}
				});
			}
		});

		// 扫描share-snippets
		vscode.workspace.findFiles('**/**/*.share-snippets').then(files => {
			console.log(`共扫描到${files.length}个文件`);
			for (const file of files) {
				vscode.workspace.fs.readFile(file).then(text => {
					try {
						let code = JSON.parse(JSON.stringify(eval("(" + text.toString() + ")")));
						let SnippetsObjs: CodeSnippet[] = Object.values(code);
						SnippetsObjs.forEach(v => {
							const { type } = v;
							if (type === 'tag') {
								const { scope, name: prefix, description, props, self_closing } = v as TagComponent;
								const scopes = scope ? scope.split(',') : ['*'];
								const body = props.filter(p => p?.required).map((p, index) => {
									let { key, value, bind,hide_value } = p;
									if(hide_value){
										return key;
									}
									return `${bind ? ':' : ''}${key}='$\{${index + 1}|${value}|\}'`;
								}).join(' ');
								const documentation = props.filter(p => p?.required).map((p, index) => {
									let { key, value, bind,hide_value } = p;
									if(hide_value){
										return key;
									}
									return `${bind ? ':' : ''}${key}='${value.split(',')[0]}'`;
								}).join(' ');
								const getTagSting = ((close:boolean,tagName:string)=>{
									return (params:string)=> close ? `<${tagName} ${params} />` : `<${tagName} ${params} ></${tagName}>`;
								})(self_closing,prefix);
								// 激活模板代码
								registerCodeSnippet(scopes, [prefix], getCodeTemplate(prefix, description, getTagSting(body),getTagSting(documentation)));
								// 激活属性提示
								for (const prop of props) {
									const { key } = prop;
									registerCodeSnippet(scopes, [key], getTagCodeTemplate(prop, prefix));
								}
							}
						});
					} catch (err) {
						vscode.window.showErrorMessage(`文件${file.path}解析失败`);
					}
				});
			}
		});
	}

	/**
	 * 启动的时候扫描注册一下
	 */
	scanSnippets();

	let disposable = vscode.commands.registerCommand('snippet.refresh', () => {
		scanSnippets();
		vscode.window.showInformationMessage('refresh snippet success!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
