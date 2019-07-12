import * as vscode from "vscode";
import * as moment from "moment";
import { Editor, TopBottom } from "../state/editor";
import { noteTagPattern, dateFormat, isHeader } from "../state/symbols";
import { SectionMoveDirective } from "../state/section-move-directive";
import { moveTodoToSection, copyTodoToSections, removeAllTags } from "./../state/todo";



export function newTodoCommand() {    
    Editor.activeEditor!.addLineToSection("Backlog", "", TopBottom.Bottom);
}

export function selectTodoCommand() {
    moveTodoToSection("Todo", TopBottom.Top, "");
}

export function doneTodoCommand() {
    let closedTime = `~(${moment().format(dateFormat)}) `;
    moveTodoToSection("Closed", TopBottom.Top, closedTime);
}

export function toggleNoteCommand() {
    let editor = vscode.window.activeTextEditor!;
    if (editor.document.languageId === "GPD") {
        openNote();
    } else if (editor.document.languageId === "GPD_Note") {
        openGpd();
    } else {
        vscode.window.showErrorMessage("This is not a GPD or GPD_Note file.");
    }
}

export function doneTodoAndRepeatCommand() {
    let closedTime = `~(${moment().format(dateFormat)}) `;
    let editor = new Editor(vscode.window.activeTextEditor!);
    let copyToTodo = new SectionMoveDirective("Backlog", "", TopBottom.Bottom, editor);
    let moveToClosed = new SectionMoveDirective("Closed", closedTime, TopBottom.Top, editor);
    let directives = [copyToTodo, moveToClosed];
    copyTodoToSections(directives, true);

}

export function showAllNotesCommand(){
    let editor = new Editor(vscode.window.activeTextEditor!);
    editor.unnarrow();
}

function openGpd() {
    let editor = vscode.window.activeTextEditor!;
    let filename = editor.document.uri.toString().replace(/_note/i,'');    
    vscode.window.showTextDocument(vscode.Uri.parse(filename));    
}

function openNote() {
    let editor = vscode.window.activeTextEditor!;
    let curPos = editor.selection.anchor;
    let todoLine = editor.document.lineAt(curPos);
    let todo = editor.document.lineAt(curPos).text.trim();
    if (!isHeader(todo)) {
        let noteText = getNoteText(todo);
        if (noteText) {
            let todoMin = todo.replace(noteText.notefull, "").trim();
            openOrCreateNote(noteText!.noteinner, todo);
           
        } else {
            let notePos = todoLine.range.end;
            let noteId = moment().format("YYYY.MM.DD.hh.mm");
            let noteInsert = " `(" + noteId + ")";
            editor.edit((edit) => {
                edit.insert(notePos, noteInsert);                
            });
            openOrCreateNote(noteId, todo);

        }
    } else {
        vscode.window.showErrorMessage("Can't open note for a header.");
    }
}

function getNoteText(text: string): { notefull: string, noteinner: string } | undefined {
    let noteHeaderRegexp = new RegExp(noteTagPattern);
    let noteText = noteHeaderRegexp.exec(text);
    if (noteText) {
        return { notefull: noteText[0], noteinner: noteText[1] };
    } else {
        return undefined;
    }

}

function openOrCreateNote(noteId: string, todo: string){
    openNoteFile().then((noteEditor) => {                
        let notePosEnd = noteEditor.getSectionPosition(noteId, true);        
        if (notePosEnd) {
            let notePos = noteEditor.vseditor.document.positionAt(noteEditor.vseditor.document.offsetAt(notePosEnd!) - 1);
            noteEditor.moveCursor(notePos);
        } else {
            noteEditor.vseditor.edit((edit) => {
                let pos = new vscode.Position(0,0);
                edit.insert(pos,`//${noteId}//
  ${removeAllTags(todo)}
  
//End//

`);
            }).then(() => {
                let notePos = new vscode.Position(2, 2);
                noteEditor.moveCursor(notePos);
            });
            
        }
        
    }).catch(() => { vscode.window.showErrorMessage("Couldn't get an editor for the note file."); });
    
}

async function openNoteFile(): Promise<Editor> {
    let editor = vscode.window.activeTextEditor!;
    let filename = editor.document.uri + "_note";
    return new Editor(await vscode.window.showTextDocument(vscode.Uri.parse(filename)));
}















