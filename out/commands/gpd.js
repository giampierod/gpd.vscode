"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const moment = require("moment");
let dateFormat = "DD/MM/YY hh:mm";
function createNoteCommand(editor, edit) {
    vscode.window.showInformationMessage("Create Note");
}
exports.createNoteCommand = createNoteCommand;
function newTodoCommand() {
    addItemToSection("Backlog", "", TopBottom.Bottom);
}
exports.newTodoCommand = newTodoCommand;
function selectTodoCommand() {
    moveTodoToSection("Todo", TopBottom.Bottom, "");
}
exports.selectTodoCommand = selectTodoCommand;
function doneTodoCommand() {
    let closedTime = `~(${moment().format(dateFormat)}) `;
    moveTodoToSection("Closed", TopBottom.Top, closedTime);
}
exports.doneTodoCommand = doneTodoCommand;
function showNoteCommand() {
}
exports.showNoteCommand = showNoteCommand;
function doneTodoAndRepeatCommand() {
    let closedTime = `~(${moment().format(dateFormat)}) `;
    let copyToTodo = new SectionMoveDirective("Backlog", "", TopBottom.Bottom);
    let moveToClosed = new SectionMoveDirective("Closed", closedTime, TopBottom.Top);
    let directives = [copyToTodo, moveToClosed];
    copyTodoToSections(directives, true);
}
exports.doneTodoAndRepeatCommand = doneTodoAndRepeatCommand;
class SectionMoveDirective {
    constructor(section, prefix, topBottom) {
        this.section = section;
        this.prefix = prefix;
        this.topBottom = topBottom;
        let editor = vscode.window.activeTextEditor;
        let secPos = getSectionPosition(editor, this.section, this.topBottom === TopBottom.Bottom);
        if (secPos) {
            if (this.topBottom === TopBottom.Top) {
                this.position = new vscode.Position(secPos.line + 1, 0);
            }
            else {
                this.position = secPos;
            }
        }
        else {
            vscode.window.showErrorMessage("Couldn't find section:" + this.section);
            this.position = undefined;
        }
    }
    getPosition() {
        return this.position;
    }
}
function copyTodoToSections(directives, deleteTodo) {
    let editor = vscode.window.activeTextEditor;
    let pos = editor.selection.anchor;
    let line = editor.document.lineAt(pos);
    if (!isHeader(line.text)) {
        let todo = removeTag(line.text, "~").trim();
        editor.edit((edit) => {
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    let insertText = "  " + directive.prefix + todo + eolToString(editor.document.eol);
                    edit.insert(directive.getPosition(), insertText);
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
                    if (pos.line > directive.getPosition().line) {
                        newPos = new vscode.Position(pos.line + 1, pos.character);
                    }
                }
            });
            let cursorSel = new vscode.Selection(newPos, newPos);
            editor.selection = cursorSel;
        }
    }
    else {
        vscode.window.showWarningMessage("Can't select a header or footer as a Todo item.");
    }
}
function copyTodoToSection(section, topBottom, prefix, move) {
    let copyDirective = [new SectionMoveDirective(section, prefix, topBottom)];
    copyTodoToSections(copyDirective, move);
}
function removeTag(text, tag) {
    let pattern = new RegExp(escapeRegexp(tag) + "\\(.*?\\)[ ]?", "g");
    return text.replace(pattern, "");
}
function escapeRegexp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function moveTodoToSection(section, topBottom, prefix) {
    copyTodoToSection(section, topBottom, prefix, true);
}
function isHeader(text) {
    let headerPattern = new RegExp('//(.*)//');
    return headerPattern.test(text);
}
var TopBottom;
(function (TopBottom) {
    TopBottom[TopBottom["Top"] = 0] = "Top";
    TopBottom[TopBottom["Bottom"] = 1] = "Bottom";
})(TopBottom || (TopBottom = {}));
function addItemToSection(section, text, topBottom) {
    let editor = vscode.window.activeTextEditor;
    let secPos = getSectionPosition(editor, section, topBottom === TopBottom.Bottom);
    if (secPos) {
        let offSet = editor.document.offsetAt(secPos);
        if (topBottom === TopBottom.Bottom) {
            offSet = editor.document.offsetAt(secPos) - 1;
        }
        let insertText = eolToString(editor.document.eol) + "  " + text;
        editor.edit((edit) => {
            edit.insert(editor.document.positionAt(offSet), insertText);
        });
        let cursorPos = editor.document.positionAt(offSet + insertText.length);
        let cursorSel = new vscode.Selection(cursorPos, cursorPos);
        editor.selection = cursorSel;
    }
    else {
        vscode.window.showErrorMessage("Couldn't find section:" + section);
    }
}
function eolToString(eol) {
    if (eol === vscode.EndOfLine.CRLF) {
        return "\r\n";
    }
    else {
        return "\n";
    }
}
function getSectionPosition(editor, section, footer = false) {
    let headerRegex = new RegExp("//" + section + "//");
    let secPos = search(editor, headerRegex);
    if (secPos) {
        var pos = secPos;
        if (footer) {
            let end = getEndOfSection(editor, secPos);
            if (end) {
                pos = end;
            }
        }
        return pos;
    }
    else {
        return undefined;
    }
}
function getEndOfSection(editor, pos) {
    let footerRegex = new RegExp("//End//");
    let endOfSection = search(editor, footerRegex, pos);
    return new vscode.Position(endOfSection.line, 0);
}
function search(editor, searchString, startPos) {
    if (!startPos) {
        startPos = new vscode.Position(0, 0);
    }
    let finalPos = getEof(editor);
    const text = editor.document.getText(new vscode.Range(startPos, finalPos));
    let result = searchString.exec(text);
    if (result) {
        return editor.document.positionAt(result.index + result[0].length + editor.document.offsetAt(startPos));
    }
    else {
        vscode.window.showErrorMessage("Couldn't find it");
        return undefined;
    }
}
function getEof(editor) {
    let lastLineStart = new vscode.Position(editor.document.lineCount - 1, 0);
    let lastLine = editor.document.lineAt(lastLineStart);
    return lastLine.rangeIncludingLineBreak.end;
}
//# sourceMappingURL=gpd.js.map