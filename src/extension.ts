import * as vscode from 'vscode'
import { generate } from 'json2interface'

export function activate (context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'json2typescript.generate',
    () => {
      vscode.env.clipboard.readText().then(value => {
        try {
          const typeScriptInterfaces = generate(value)

          const activeTextEditor = vscode.window.activeTextEditor

          if (!activeTextEditor) {
            vscode.workspace
              .openTextDocument({
                language: 'typescript',
                content: typeScriptInterfaces
              })
              .then(document => {
                vscode.window.showTextDocument(document)
              })
          } else {
            activeTextEditor.edit(edit => {
              const selection = activeTextEditor.selection.active
              edit.insert(selection, typeScriptInterfaces)
            })
          }

          vscode.window.showInformationMessage(
            'TypeScript interfaces generated'
          )
        } catch (exception) {
          vscode.window.showErrorMessage(
            'The clipboard does not contains a valid JSON'
          )
        }
      })
    }
  )
  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate () {}
