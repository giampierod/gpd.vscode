"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var TopBottom;
(function (TopBottom) {
    TopBottom[TopBottom["Top"] = 0] = "Top";
    TopBottom[TopBottom["Bottom"] = 1] = "Bottom";
})(TopBottom = exports.TopBottom || (exports.TopBottom = {}));
class SectionMoveDirective {
    constructor(section, prefix, topBottom, editor) {
        this.section = section;
        this.prefix = prefix;
        this.topBottom = topBottom;
        let secPos = editor.getSectionPosition(this.section, this.topBottom === TopBottom.Bottom);
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
exports.SectionMoveDirective = SectionMoveDirective;
//# sourceMappingURL=section-move-directive.js.map