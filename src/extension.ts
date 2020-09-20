import * as vscode from 'vscode'
import { generate } from 'json2interface'

export function activate (context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'json2typescript.generate',
    () => generateInterfaces()
  )
  context.subscriptions.push(disposable)
}

async function generateInterfaces () {
  const clipBoardContent = await readFromClipboard()

  try {
    const typeScriptInterfaces = generate(clipBoardContent)
    const activeTextEditor = vscode.window.activeTextEditor

    if (!activeTextEditor) {
      const document = await vscode.workspace
        .openTextDocument({
          language: 'typescript',
          content: typeScriptInterfaces
        })
      await vscode.window.showTextDocument(document)
    } else {
      await activeTextEditor.edit(edit => {
        const selection = activeTextEditor.selection.active
        edit.insert(selection, typeScriptInterfaces)
      })
    }

    vscode.window.showInformationMessage('TypeScript interfaces generated')
  } catch (exception) {
    vscode.window.showErrorMessage(
      'The clipboard does not contain a valid JSON'
    )
  }
}

async function readFromClipboard () {
  return vscode.env.clipboard.readText()
}

// this method is called when your extension is deactivated
export function deactivate () {}
