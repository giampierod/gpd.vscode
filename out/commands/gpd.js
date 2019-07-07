"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const moment = require("moment");
const editor_1 = require("../state/editor");
const symbols_1 = require("../state/symbols");
const section_move_directive_1 = require("../state/section-move-directive");
const todo_1 = require("./../state/todo");
function newTodoCommand() {
    editor_1.Editor.activeEditor.addLineToSection("Backlog", "", editor_1.TopBottom.Bottom);
}
exports.newTodoCommand = newTodoCommand;
function selectTodoCommand() {
    todo_1.moveTodoToSection("Todo", editor_1.TopBottom.Bottom, "");
}
exports.selectTodoCommand = selectTodoCommand;
function doneTodoCommand() {
    let closedTime = `~(${moment().format(symbols_1.dateFormat)}) `;
    todo_1.moveTodoToSection("Closed", editor_1.TopBottom.Top, closedTime);
}
exports.doneTodoCommand = doneTodoCommand;
function toggleNoteCommand() {
    let editor = vscode.window.activeTextEditor;
    if (editor.document.languageId === "GPD") {
        openNote();
    }
    else if (editor.document.languageId === "GPD_Note") {
        openGpd();
    }
    else {
        vscode.window.showErrorMessage("This is not a GPD or GPD_Note file.");
    }
}
exports.toggleNoteCommand = toggleNoteCommand;
function doneTodoAndRepeatCommand() {
    let closedTime = `~(${moment().format(symbols_1.dateFormat)}) `;
    let editor = new editor_1.Editor(vscode.window.activeTextEditor);
    let copyToTodo = new section_move_directive_1.SectionMoveDirective("Backlog", "", editor_1.TopBottom.Bottom, editor);
    let moveToClosed = new section_move_directive_1.SectionMoveDirective("Closed", closedTime, editor_1.TopBottom.Top, editor);
    let directives = [copyToTodo, moveToClosed];
    todo_1.copyTodoToSections(directives, true);
}
exports.doneTodoAndRepeatCommand = doneTodoAndRepeatCommand;
function openGpd() {
    let editor = vscode.window.activeTextEditor;
    let filename = editor.document.uri.toString().replace(/_note/i, '');
    vscode.window.showTextDocument(vscode.Uri.parse(filename));
}
function openNote() {
    let editor = vscode.window.activeTextEditor;
    let curPos = editor.selection.anchor;
    let todoLine = editor.document.lineAt(curPos);
    let todo = editor.document.lineAt(curPos).text.trim();
    if (!symbols_1.isHeader(todo)) {
        let noteText = getNoteText(todo);
        if (noteText) {
            let todoMin = todo.replace(noteText.notefull, "").trim();
            openOrCreateNote(noteText.noteinner, todo);
        }
        else {
            let notePos = todoLine.range.end;
            let noteId = moment().format("YYYY.MM.DD.hh.mm");
            let noteInsert = " `(" + noteId + ")";
            editor.edit((edit) => {
                edit.insert(notePos, noteInsert);
            });
            openOrCreateNote(noteId, todo);
        }
    }
    else {
        vscode.window.showErrorMessage("Can't open note for a header.");
    }
}
function getNoteText(text) {
    let noteHeaderRegexp = new RegExp(symbols_1.noteTagPattern);
    let noteText = noteHeaderRegexp.exec(text);
    if (noteText) {
        return { notefull: noteText[0], noteinner: noteText[1] };
    }
    else {
        return undefined;
    }
}
function openOrCreateNote(noteId, todo) {
    openNoteFile().then((noteEditor) => {
        let notePosEnd = noteEditor.getSectionPosition(noteId, true);
        if (notePosEnd) {
            let notePos = noteEditor.vseditor.document.positionAt(noteEditor.vseditor.document.offsetAt(notePosEnd) - 1);
            noteEditor.moveCursor(notePos);
        }
        else {
            noteEditor.vseditor.edit((edit) => {
                let pos = new vscode.Position(0, 0);
                edit.insert(pos, `//${noteId}//
  ${todo_1.removeAllTags(todo)}
  
//End//

`);
            });
            let notePos = new vscode.Position(2, 2);
            noteEditor.moveCursor(notePos);
        }
    }).catch(() => { vscode.window.showErrorMessage("Couldn't get an editor for the note file."); });
}
function openNoteFile() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let filename = editor.document.uri + "_note";
        return new editor_1.Editor(yield vscode.window.showTextDocument(vscode.Uri.parse(filename)));
    });
}
//# sourceMappingURL=gpd.js.map