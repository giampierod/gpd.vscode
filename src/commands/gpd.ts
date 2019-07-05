import * as vscode from "vscode";
import * as moment from "moment";
import { Editor } from "./../utils/editor";

let dateFormat = "DD/MM/YY hh:mm";
let noteHeaderPattern = /`\(([a-zA-Z0-9_\"\., ]*)\)/;

export function newTodoCommand() {
    addItemToSection("Backlog", "", TopBottom.Bottom);
}

export function selectTodoCommand() {
    moveTodoToSection("Todo", TopBottom.Bottom, "");
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

    } else {
        vscode.window.showErrorMessage("This is not a GPD or GPD_Note file.");
    }
}

export function doneTodoAndRepeatCommand() {
    let closedTime = `~(${moment().format(dateFormat)}) `;
    let copyToTodo = new SectionMoveDirective("Backlog", "", TopBottom.Bottom);
    let moveToClosed = new SectionMoveDirective("Closed", closedTime, TopBottom.Top);
    let directives = [copyToTodo, moveToClosed];
    copyTodoToSections(directives, true);

}





class SectionMoveDirective {
    section: string;
    prefix: string;
    topBottom: TopBottom;
    position: vscode.Position | undefined;
    public constructor(section: string, prefix: string, topBottom: TopBottom) {
        this.section = section;
        this.prefix = prefix;
        this.topBottom = topBottom;
        let editor = vscode.window.activeTextEditor!;
        let secPos = getSectionPosition(this.section, this.topBottom === TopBottom.Bottom);
        if (secPos) {
            if (this.topBottom === TopBottom.Top) {
                this.position = new vscode.Position(secPos!.line + 1, 0);
            } else {
                this.position = secPos!;
            }
        } else {
            vscode.window.showErrorMessage("Couldn't find section:" + this.section);
            this.position = undefined;
        }
    }
    public getPosition(): vscode.Position | undefined {
        return this.position;
    }

}

function openNote() {
    let editor = vscode.window.activeTextEditor!;
    let curPos = editor.selection.anchor;
    let todo = editor.document.lineAt(curPos).text.trim();
    if (!isHeader(todo)) {
        let noteText = getNoteText(todo);
        if (noteText) {
            let todoMin = todo.replace(noteText.notefull, "").trim();
            openNoteFile().then((noteEditor) => {
                
                let notePos = noteEditor.getSectionPosition(noteText!.noteinner, true);
                
                if (notePos) {
                    noteEditor.moveCursor(notePos!);
                } else {
                    console.log("Didn't find the note: " + noteText!.noteinner);
                }
            }).catch(() => { vscode.window.showErrorMessage("Couldn't get an editor for the note"); });
        } else {
            // Create a new note
        }
    } else {
        vscode.window.showErrorMessage("Can't open note for a header.");
    }




}

function getNoteText(text: string): { notefull: string, noteinner: string } | undefined {
    let noteText = noteHeaderPattern.exec(text);
    if (noteText) {
        return { notefull: noteText[0], noteinner: noteText[1] };
    } else {
        return undefined;
    }

}

async function openNoteFile(): Promise<Editor> {
    let editor = vscode.window.activeTextEditor!;
    let filename = editor.document.uri + "_note";
    return new Editor(await vscode.window.showTextDocument(vscode.Uri.parse(filename)));
}

function copyTodoToSections(directives: SectionMoveDirective[], deleteTodo?: boolean): void {
    let editor = vscode.window.activeTextEditor!;
    let pos = editor.selection.anchor;
    let line = editor.document.lineAt(pos);
    if (!isHeader(line.text)) {
        let todo = removeTag(line.text, "~").trim();
        editor.edit((edit) => {
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    let insertText = "  " + directive.prefix + todo + eolToString(editor.document.eol);
                    edit.insert(directive.getPosition()!, insertText);
                }
            });
            if (deleteTodo) {
                edit.delete(line.rangeIncludingLineBreak);
            }
        });
        if (deleteTodo) {
            let newPos = new vscode.Position(pos.line, pos.character);
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    if (pos.line > directive.getPosition()!.line) {
                        newPos = new vscode.Position(pos.line + 1, pos.character);
                    }
                }
            });
            let cursorSel = new vscode.Selection(newPos, newPos);
            editor.selection = cursorSel;
        }
    } else {
        vscode.window.showWarningMessage("Can't select a header or footer as a Todo item.");
    }
}

function copyTodoToSection(section: string, topBottom: TopBottom, prefix: string, move?: boolean) {
    let copyDirective = [new SectionMoveDirective(section, prefix, topBottom)];
    copyTodoToSections(copyDirective, move);

}

function removeTag(text: string, tag: string): string {
    let pattern = new RegExp(escapeRegexp(tag) + "\\(.*?\\)[ ]?", "g");
    return text.replace(pattern, "");
}

function escapeRegexp(s: string): string {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}





function moveTodoToSection(section: string, topBottom: TopBottom, prefix: string) {
    copyTodoToSection(section, topBottom, prefix, true);
}

function isHeader(text: string): boolean {
    let headerPattern = new RegExp('//(.*)//');
    return headerPattern.test(text);
}

enum TopBottom {
    Top,
    Bottom
}

function addItemToSection(section: string, text: string, topBottom: TopBottom) {
    let editor = vscode.window.activeTextEditor!;
    let secPos = getSectionPosition(section, topBottom === TopBottom.Bottom);
    if (secPos) {
        let offSet = editor.document.offsetAt(secPos!);
        if (topBottom === TopBottom.Bottom) {
            offSet = editor.document.offsetAt(secPos!) - 1;
        }
        let insertText = eolToString(editor.document.eol) + "  " + text;
        editor.edit((edit) => {
            edit.insert(editor.document.positionAt(offSet), insertText);
        });
        let cursorPos = editor.document.positionAt(offSet + insertText.length);
        let cursorSel = new vscode.Selection(cursorPos, cursorPos);
        editor.selection = cursorSel;
    } else {
        vscode.window.showErrorMessage("Couldn't find section:" + section);
    }

}

function eolToString(eol: vscode.EndOfLine): string {
    if (eol === vscode.EndOfLine.CRLF) {
        return "\r\n";
    } else {
        return "\n";
    }
}


function getSectionPosition(section: string, footer: boolean = false): vscode.Position | undefined {
    let editor = vscode.window.activeTextEditor!;
    let headerRegex = new RegExp("//" + section + "//");
    let secPos = search(headerRegex);

    if (secPos) {
        var pos = secPos;
        if (footer) {
            let end = getEndOfSection(editor, secPos!);
            if (end) {
                pos = end!;
            }
        }
        return pos;
    } else {
        return undefined;
    }

}

function getEndOfSection(editor: vscode.TextEditor, pos: vscode.Position): vscode.Position | undefined {
    let footerRegex = new RegExp("//End//");
    let endOfSection = search(footerRegex, pos);
    return new vscode.Position(endOfSection!.line, 0);
}

function search(searchString: RegExp, startPos?: vscode.Position): vscode.Position | undefined {
    let editor = vscode.window.activeTextEditor!;
    console.log(editor.document.fileName);
    if (!startPos) {
        startPos = new vscode.Position(0, 0);
    }
    let finalPos = getEof(editor);
    const text = editor.document.getText(new vscode.Range(startPos, finalPos));
    let result = searchString.exec(text);
    if (result) {
        return editor.document.positionAt(result.index + result[0].length + editor.document.offsetAt(startPos));
    } else {
        vscode.window.showErrorMessage("Couldn't find it");
        return undefined;

    }
}

function getEof(editor: vscode.TextEditor): vscode.Position {
    let lastLineStart = new vscode.Position(editor.document.lineCount - 1, 0);
    let lastLine = editor.document.lineAt(lastLineStart);
    return lastLine.rangeIncludingLineBreak.end;
}

