// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { newTodoCommand, selectTodoCommand, doneTodoCommand, doneTodoAndRepeatCommand, toggleNoteCommand, showAllNotesCommand } from "./commands/gpd";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function activate(context: vscode.ExtensionContext) {

	let newTodo = vscode.commands.registerCommand('gpd.newTodo', newTodoCommand);
	context.subscriptions.push(newTodo);

	let selectTodo = vscode.commands.registerCommand("gpd.selectTodo", selectTodoCommand);
	context.subscriptions.push(selectTodo);

	let doneTodo = vscode.commands.registerCommand("gpd.doneTodo", doneTodoCommand);
	context.subscriptions.push(doneTodo);

	let doneTodoAndRepeat = vscode.commands.registerCommand("gpd.doneTodoAndRepeat", doneTodoAndRepeatCommand);
	context.subscriptions.push(doneTodoAndRepeat);

	let openNote = vscode.commands.registerCommand("gpd.openNote", toggleNoteCommand);
	context.subscriptions.push(openNote);
	
	let openTodo = vscode.commands.registerCommand("gpd.openTodo", toggleNoteCommand);
	context.subscriptions.push(openTodo);

	// let showAllNotes = vscode.commands.registerCommand("gpd.showAllNotes", showAllNotesCommand);
	// context.subscriptions.push(showAllNotes);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
};
