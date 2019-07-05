"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Editor {
    constructor(textEditor) {
        this.vseditor = textEditor;
        this.edit = textEditor.edit;
    }
    search(searchString, startPos) {
        if (!startPos) {
            startPos = new vscode_1.Position(0, 0);
        }
        let finalPos = this.getEof();
        let text = this.vseditor.document.getText(new vscode_1.Range(startPos, finalPos));
        let result = searchString.exec(text);
        if (result) {
            return this.vseditor.document.positionAt(result.index + result[0].length + this.vseditor.document.offsetAt(startPos));
        }
        else {
            vscode_1.window.showErrorMessage("Couldn't find search string" + searchString);
            return undefined;
        }
    }
    moveCursor(pos) {
        this.vseditor.selection = new vscode_1.Selection(pos, pos);
        this.vseditor.revealRange(new vscode_1.Range(pos, pos), vscode_1.TextEditorRevealType.Default);
    }
    getEof() {
        let lastLineStart = new vscode_1.Position(this.vseditor.document.lineCount - 1, 0);
        let lastLine = this.vseditor.document.lineAt(lastLineStart);
        return lastLine.rangeIncludingLineBreak.end;
    }
    getSectionPosition(section, footer = false) {
        let headerRegex = new RegExp("//" + section + "//");
        let secPos = this.search(headerRegex);
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
        let footerRegex = new RegExp("//End//");
        let endOfSection = this.search(footerRegex, pos);
        return new vscode_1.Position(endOfSection.line, 0);
    }
}
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map