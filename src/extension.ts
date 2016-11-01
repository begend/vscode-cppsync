'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FileSyncer from './FileSyncer';
import FileSyncController =  require('./FileSyncController');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "SyncCpp" is now active!');
    var conf = vscode.workspace.getConfiguration('synccpp');
    let srcRootPath: string = conf.get("srcRootPath").toString();
    let destRootPath: string = conf.get("destRootPath").toString();

    // create a new word counter
    let fileSyncer = new FileSyncer();
    let controller = new FileSyncController.FileSyncController(fileSyncer);

    let uploadDisp = vscode.commands.registerCommand('extension.uploadDir', () => {
        fileSyncer.cpDir(srcRootPath, destRootPath);
        vscode.window.showInformationMessage('uploadDir done!');
    });
    
    let downloadDisp = vscode.commands.registerCommand('extension.downloadDir', () => {
        fileSyncer.cpDir(destRootPath, srcRootPath);
        vscode.window.showInformationMessage('downloadDir done');
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(fileSyncer);
    context.subscriptions.push(uploadDisp);
    context.subscriptions.push(downloadDisp);
}

// this method is called when your extension is deactivated
export function deactivate() {
}