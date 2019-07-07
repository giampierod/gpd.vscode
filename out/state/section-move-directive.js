"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const editor_1 = require("./editor");
class SectionMoveDirective {
    constructor(section, prefix, topBottom, editor) {
        this.section = section;
        this.prefix = prefix;
        this.topBottom = topBottom;
        let secPos = editor.getSectionPosition(this.section, this.topBottom === editor_1.TopBottom.Bottom);
        if (secPos) {
            if (this.topBottom === editor_1.TopBottom.Top) {
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
exports.SectionMoveDirective = SectionMoveDirective;
//# sourceMappingURL=section-move-directive.js.map