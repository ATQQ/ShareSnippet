import * as vscode from 'vscode';
import {scanSnippets} from './utils/file';
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "snippet" is now active!');
	// 启动的时候扫描注册一下
	scanSnippets(context);
	
	let disposable = vscode.commands.registerCommand('snippet.refresh', () => {
		scanSnippets(context);
		vscode.window.showInformationMessage('refresh snippet success!');
	});
	
	// 注册命令
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
