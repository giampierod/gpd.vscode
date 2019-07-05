// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { createNoteCommand, newTodoCommand, selectTodoCommand, doneTodoCommand, doneTodoAndRepeatCommand } from "./commands/gpd";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function activate(context: vscode.ExtensionContext) {

	let createNote = vscode.commands.registerTextEditorCommand('extension.createNote', createNoteCommand);
	context.subscriptions.push(createNote);

	let newTodo = vscode.commands.registerCommand('extension.newTodo', newTodoCommand);
	context.subscriptions.push(newTodo);

	let selectTodo = vscode.commands.registerCommand("extension.selectTodo", selectTodoCommand);
	context.subscriptions.push(selectTodo);

	let doneTodo = vscode.commands.registerCommand("extension.doneTodo", doneTodoCommand);
	context.subscriptions.push(doneTodo);
	
	let doneTodoAndRepeat = vscode.commands.registerCommand("extension.doneTodoAndRepeat", doneTodoAndRepeatCommand);
	context.subscriptions.push(doneTodoAndRepeat);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
};