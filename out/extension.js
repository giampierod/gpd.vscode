"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const gpd_1 = require("./commands/gpd");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let newTodo = vscode.commands.registerCommand('extension.newTodo', gpd_1.newTodoCommand);
    context.subscriptions.push(newTodo);
    let selectTodo = vscode.commands.registerCommand("extension.selectTodo", gpd_1.selectTodoCommand);
    context.subscriptions.push(selectTodo);
    let doneTodo = vscode.commands.registerCommand("extension.doneTodo", gpd_1.doneTodoCommand);
    context.subscriptions.push(doneTodo);
    let doneTodoAndRepeat = vscode.commands.registerCommand("extension.doneTodoAndRepeat", gpd_1.doneTodoAndRepeatCommand);
    context.subscriptions.push(doneTodoAndRepeat);
    let toggleNote = vscode.commands.registerCommand("extension.toggleNote", gpd_1.toggleNoteCommand);
    context.subscriptions.push(toggleNote);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
module.exports = {
    activate,
    deactivate
};
//# sourceMappingURL=extension.js.map