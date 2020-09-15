"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const json2interface = require("json2interface");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "json2typescript" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('json2typescript.generate', () => {
        const editor = vscode.window.activeTextEditor;
        vscode.env.clipboard.readText().then(value => {
            try {
                const typeScriptInterfaces = json2interface.generate(value);
                const activeTextEditor = vscode.window.activeTextEditor;
                if (!activeTextEditor) {
                    vscode.workspace
                        .openTextDocument({
                        language: 'typescript',
                        content: typeScriptInterfaces
                    })
                        .then(document => {
                        console.log('open...');
                        vscode.window.showTextDocument(document);
                    });
                }
                else {
                    activeTextEditor === null || activeTextEditor === void 0 ? void 0 : activeTextEditor.edit(edit => {
                        const selection = activeTextEditor.selection.active;
                        edit.insert(selection, typeScriptInterfaces);
                    });
                }
                vscode.window.showInformationMessage('TypeScript interfaces generated');
            }
            catch (exception) {
                vscode.window.showErrorMessage('The clipboard does not contains a valid JSON');
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map