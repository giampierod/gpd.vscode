"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const symbols_1 = require("./symbols");
var TopBottom;
(function (TopBottom) {
    TopBottom[TopBottom["Top"] = 0] = "Top";
    TopBottom[TopBottom["Bottom"] = 1] = "Bottom";
})(TopBottom = exports.TopBottom || (exports.TopBottom = {}));
class Editor {
    constructor(textEditor) {
        this.vseditor = textEditor;
    }
    static get activeEditor() {
        let vseditor = vscode_1.window.activeTextEditor;
        if (vseditor) {
            return new Editor(vseditor);
        }
        else {
            return undefined;
        }
    }
    search(searchString, startPos, reverse) {
        let searchRegexp = new RegExp(searchString, "g");
        if (!startPos) {
            startPos = new vscode_1.Position(0, 0);
        }
        let finalPos = this.getEof();
        let text = this.vseditor.document.getText(new vscode_1.Range(startPos, finalPos));
        if (reverse) {
            text = this.vseditor.document.getText(new vscode_1.Range(new vscode_1.Position(0, 0), startPos));
        }
        var result = searchRegexp.exec(text);
        if (result) {
            if (!reverse) {
                return this.vseditor.document.positionAt(result.index + result[0].length + this.vseditor.document.offsetAt(startPos));
            }
            else {
                var lastItem = result;
                while (result) {
                    lastItem = result;
                    result = searchRegexp.exec(text);
                }
                return this.vseditor.document.positionAt(lastItem.index);
            }
        }
        else {
            return undefined;
        }
    }
    moveCursor(pos) {
        this.vseditor.selection = new vscode_1.Selection(pos, pos);
        this.highlightSection(pos);
    }
    getEof() {
        let lastLineStart = new vscode_1.Position(this.vseditor.document.lineCount - 1, 0);
        let lastLine = this.vseditor.document.lineAt(lastLineStart);
        return lastLine.rangeIncludingLineBreak.end;
    }
    getSectionPosition(section, footer = false) {
        let secPos = this.search("//" + section + "//");
        console.log(secPos);
        if (secPos) {
            var pos = secPos;
            if (footer) {
                let end = this.getEndOfSection(secPos);
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
    getEndOfSection(pos) {
        let endOfSection = this.search("//End//", pos);
        return new vscode_1.Position(endOfSection.line, 0);
    }
    getStartOfSection(pos) {
        return this.search(symbols_1.noteHeaderPattern, pos, true);
    }
    highlightSection(pos) {
        let top = this.getStartOfSection(pos);
        let bottom = this.getEndOfSection(pos);
        if (top && bottom) {
            this.vseditor.revealRange(new vscode_1.Range(top, bottom), vscode_1.TextEditorRevealType.AtTop);
            let bottomOffset = this.vseditor.document.offsetAt(bottom);
            let curPos = this.vseditor.document.positionAt(bottomOffset - 1);
            this.vseditor.selection = new vscode_1.Selection(curPos, curPos);
            this.vseditor.revealRange(new vscode_1.Range(curPos, curPos));
        }
    }
    addLineToSection(section, text, topBottom) {
        let secPos = this.getSectionPosition(section, topBottom === TopBottom.Bottom);
        if (secPos) {
            let offSet = this.vseditor.document.offsetAt(secPos);
            if (topBottom === TopBottom.Bottom) {
                offSet = this.vseditor.document.offsetAt(secPos) - 1;
            }
            let insertText = symbols_1.eolToString(this.vseditor.document.eol) + "  " + text;
            this.vseditor.edit((edit) => {
                edit.insert(this.vseditor.document.positionAt(offSet), insertText);
            });
            let cursorPos = this.vseditor.document.positionAt(offSet + insertText.length);
            let cursorSel = new vscode_1.Selection(cursorPos, cursorPos);
            this.vseditor.selection = cursorSel;
        }
        else {
            vscode_1.window.showErrorMessage("Couldn't find section:" + section);
        }
    }
}
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map