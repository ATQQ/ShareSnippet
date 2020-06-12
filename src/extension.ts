import * as vscode from 'vscode';
interface CodeSnippet {
	scope: string, // 支持的语言列表
	prefix: string, // 前缀
	body: string | string[], // 片段内容
	description: string // 片段描述
}
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "snippet" is now active!');
	function getProvideCompletionItems(codeSnippet: CodeSnippet) {

		const { prefix, scope, description, body } = codeSnippet;
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
				a.insertText = new vscode.SnippetString(typeof body === 'object' ? body.join('\n') : body);
				return [a];
			}
		};
	}

	function resolveCompletionItem() {
		return null;
	}

	/**
	 * 注册片段
	 * @param codeSnippet 
	 */
	function registerCodeSnippet(codeSnippet: CodeSnippet) {
		let { scope } = codeSnippet;
		context.subscriptions.push(vscode.languages.registerCompletionItemProvider(scope ? scope.split(',') : ['*'],
			{ provideCompletionItems: getProvideCompletionItems(codeSnippet), resolveCompletionItem },
			codeSnippet.prefix));
	}

	/**
	 * 扫描所有符合条件的文件
	 */
	function scanSnippets() {
		vscode.workspace.findFiles('**/share_snippets/**/*.code-snippets').then(files => {
			console.log(`共扫描到${files.length}个文件`);
			for (const file of files) {
				vscode.workspace.fs.readFile(file).then(text => {
					try {
						let code = JSON.parse(JSON.stringify(eval("(" + text.toString() + ")")));
						let SnippetsObjs: CodeSnippet[] = Object.values(code);
						SnippetsObjs.forEach(v => {
							registerCodeSnippet(v);
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
