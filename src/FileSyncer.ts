import * as vscode from 'vscode';
import { window, commands, Disposable, ExtensionContext, TextDocument } from 'vscode';
import * as fs from 'fs'

export default class FileSyncer {
    private _disposable: Disposable;

    public syncFile() {
        console.log("in sync file");
        let editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        // Get the document
        var doc: TextDocument = editor.document;

        var conf = vscode.workspace.getConfiguration('synccpp');
        let srcRootPath: string = conf.get("srcRootPath").toString();
        let destRootPath: string = conf.get("destRootPath").toString();
        
        //let srcRootPath = "d:\\work\\node\\synccode-master"
        //let destRootPath = "d:\\work\\node\\bak"
        this.cpFileImp(doc.fileName, srcRootPath, destRootPath)
    }

    cpFileImp(srcFileName: string, srcRootPath: string, destRootPath: string) {
        let destFileName: string = srcFileName.replace(srcRootPath, destRootPath)

        let pathArr: string[] = destFileName.split("\\");
        pathArr.pop();
        let finalPath: string = pathArr.join("\\")

        fs.exists(finalPath, function (exists: Boolean) {
            if (exists) {
                console.log('path exists ' + finalPath);
            }
            else {
                fs.mkdir(finalPath);
                console.log('mkdir ' + finalPath);
            }
        })

        fs.writeFileSync(destFileName, fs.readFileSync(srcFileName));

        console.log("sync " + srcFileName + " to " + destFileName + " done");
    }

    dispose() {
        this._disposable.dispose();
    }
}