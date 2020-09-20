// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import * as chai from 'chai'
import * as spies from 'chai-spies'

chai.use(spies)

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('Should activate extension', async () => {
    await vscode.extensions
      .getExtension('michelefenu.json2typescript')
      ?.activate()

    const isActive = vscode.extensions.getExtension(
      'michelefenu.json2typescript'
    )?.isActive

    chai.expect(isActive).to.be.true
  })

  test('Should convert JSON to TypeScript without active editors', async () => {
    await vscode.extensions
      .getExtension('michelefenu.json2typescript')
      ?.activate()

    await vscode.env.clipboard.writeText('{"test": "rteret"}')
    await vscode.commands.executeCommand('json2typescript.generate')

    const editorText = vscode.window.activeTextEditor?.document.getText()

    chai.expect(editorText).to.contain('interface')
    chai.expect(editorText).to.contain('string')
  })

  test('Should convert JSON to TypeScript with active editors', async () => {
    await vscode.extensions
      .getExtension('michelefenu.json2typescript')
      ?.activate()

    const document = await vscode.workspace.openTextDocument({
      language: 'text',
      content: 'this is a file'
    })
    await vscode.window.showTextDocument(document)

    await vscode.env.clipboard.writeText('{"test": "rteret"}')
    await vscode.commands.executeCommand('json2typescript.generate')

    const editorText = vscode.window.activeTextEditor?.document.getText()

    chai.expect(editorText).to.contain('this is a file')
    chai.expect(editorText).to.contain('interface')
    chai.expect(editorText).to.contain('string')
  })
  

  test('Should display an error for non valid JSON', async () => {
    const spy = chai.spy(vscode.window.showErrorMessage)

    await vscode.extensions
      .getExtension('michelefenu.json2typescript')
      ?.activate()

    await vscode.env.clipboard.writeText('{iAmNotAValidJson}')
    await vscode.commands.executeCommand('json2typescript.generate')

    chai.expect(spy).to.have.been.called
  })
})
