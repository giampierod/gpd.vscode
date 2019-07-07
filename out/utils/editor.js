"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const symbols_1 = require("./symbols");
class Editor {
    constructor(textEditor) {
        this.vseditor = textEditor;
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
            console.log(text);
        }
        let result = searchRegexp.exec(text);
        if (result) {
            if (!reverse) {
                return this.vseditor.document.positionAt(result.index + result[0].length + this.vseditor.document.offsetAt(startPos));
            }
            else {
                while (searchRegexp.exec(text)) {
                }
                let lastItem = result[result.length - 1];
                let lastItemIndex = result.lastIndexOf(lastItem);
                return this.vseditor.document.positionAt(lastItemIndex);
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
        console.log(top);
        console.log(bottom);
        if (top && bottom) {
            this.vseditor.revealRange(new vscode_1.Range(top, bottom), vscode_1.TextEditorRevealType.InCenterIfOutsideViewport);
            this.vseditor.revealRange(new vscode_1.Range(top, bottom), vscode_1.TextEditorRevealType.AtTop);
        }
    }
}
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map