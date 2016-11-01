import * as vscode from 'vscode';
import { window, commands, Disposable, ExtensionContext, TextDocument } from 'vscode';
import * as fs from 'fs'
import * as path from 'path'

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

        try {
            fs.writeFileSync(destFileName, fs.readFileSync(srcFileName));
            vscode.window.showInformationMessage('file sync done!');
        } catch (error) {
            vscode.window.showInformationMessage('file sync err!' + error.toString());
        }

        console.log("sync " + srcFileName + " to " + destFileName + " done");
    }

    cpDir(srcRootPath: string, destRootPath: string) {
        console.log("src dir " + srcRootPath);

        let files: string[] = fs.readdirSync(srcRootPath);

        files.forEach((file: string) => {
            let realPath: string = path.join(srcRootPath, file)
            console.log("in walk " + realPath);

            try {
                let stat: fs.Stats = fs.statSync(realPath);
                let destRealPath: string = realPath.replace(srcRootPath, destRootPath);
                if (stat.isDirectory()) {
                    console.log("src dir " + realPath);
                    console.log("dest dir " + destRealPath);
                    
                    if (realPath.indexOf(".svn") != -1 
                        || destRealPath.indexOf(".git") != -1)
                    {
                        return;
                    }

                    if (!fs.existsSync(destRealPath)) {
                        fs.mkdirSync(destRealPath);
                    }

                    this.cpDir(realPath, destRealPath);
                }
                else {
                    console.log("src file " + realPath);
                    console.log("dest file " + destRealPath);
                    fs.writeFileSync(destRealPath, fs.readFileSync(realPath));
                }
            }
            catch (e) {
                console.log(e.toString());
            }
        });
    }

    dispose() {
        this._disposable.dispose();
    }
}