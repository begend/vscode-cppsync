import * as vscode from 'vscode';
import { window, commands, Disposable, ExtensionContext, TextDocument } from 'vscode';
import FileSyncer from './FileSyncer'

export class FileSyncController {

    private _fileSyncer: FileSyncer;
    private _disposable: Disposable;

    constructor(fileSyncer: FileSyncer) {
        console.log("in controller ctr");
        this._fileSyncer = fileSyncer;
        
        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        //window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        //window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        vscode.workspace.onDidSaveTextDocument(this._onEvent, this, subscriptions)
        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._fileSyncer.syncFile();
    }
}