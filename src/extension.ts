import * as vscode from 'vscode';
import {scanSnippets} from './utils/file';
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "snippet" is now active!');
	// 启动的时候扫描注册一下
	scanSnippets(context);
	
	let disposable = vscode.commands.registerCommand('snippet.refresh', () => {
		// 将原有Snippet取消注册重新扫描
		const oldSnippets = context.subscriptions.splice(1,context.subscriptions.length-1);
		oldSnippets.forEach(s=>s.dispose());
		scanSnippets(context);
		vscode.window.showInformationMessage('refresh Share Snippets success!');
	});
	
	// 注册命令
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
