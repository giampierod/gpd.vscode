"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
exports.noteTagPattern = /`\(([a-zA-Z0-9_\"\., ]*)\)/.source;
exports.noteHeaderPattern = /\/\/[a-zA-Z0-9_\"\., ]*\/\//.source;
exports.dateFormat = "DD/MM/YY hh:mm";
exports.tags = ["`", "~", "$", "#", "@", "!"];
exports.headerPattern = "//(.*)//";
function eolToString(eol) {
    if (eol === vscode_1.EndOfLine.CRLF) {
        return "\r\n";
    }
    else {
        return "\n";
    }
}
exports.eolToString = eolToString;
function isHeader(text) {
    let headerPattern = new RegExp('//(.*)//');
    return headerPattern.test(text);
}
exports.isHeader = isHeader;
//# sourceMappingURL=symbols.js.map