"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("./editor");
const section_move_directive_1 = require("./section-move-directive");
const symbols_1 = require("./symbols");
const vscode_1 = require("vscode");
function moveTodoToSection(section, topBottom, prefix) {
    copyTodoToSection(section, topBottom, prefix, true);
}
exports.moveTodoToSection = moveTodoToSection;
function copyTodoToSection(section, topBottom, prefix, move) {
    let editor = editor_1.Editor.activeEditor;
    let copyDirective = [new section_move_directive_1.SectionMoveDirective(section, prefix, topBottom, editor)];
    copyTodoToSections(copyDirective, move);
}
exports.copyTodoToSection = copyTodoToSection;
function copyTodoToSections(directives, deleteTodo) {
    let editor = editor_1.Editor.activeEditor;
    let vseditor = editor.vseditor;
    let pos = vseditor.selection.anchor;
    let line = vseditor.document.lineAt(pos);
    if (!symbols_1.isHeader(line.text)) {
        let todo = removeTag(line.text, "~").trim();
        vseditor.edit((edit) => {
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    let insertText = "  " + directive.prefix + todo + symbols_1.eolToString(vseditor.document.eol);
                    edit.insert(directive.getPosition(), insertText);
                }
            });
            if (deleteTodo) {
                edit.delete(line.rangeIncludingLineBreak);
            }
        });
        if (deleteTodo) {
            let newPos = new vscode_1.Position(pos.line, pos.character);
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    if (pos.line > directive.getPosition().line) {
                        newPos = new vscode_1.Position(pos.line + 1, pos.character);
                    }
                }
            });
            let cursorSel = new vscode_1.Selection(newPos, newPos);
            vseditor.selection = cursorSel;
        }
    }
    else {
        vscode_1.window.showWarningMessage("Can't select a header or footer as a Todo item.");
    }
}
exports.copyTodoToSections = copyTodoToSections;
function removeTag(text, tag) {
    let pattern = new RegExp(escapeRegexp(tag) + "\\(.*?\\)[ ]?", "g");
    return text.replace(pattern, "");
}
function escapeRegexp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function removeAllTags(todo) {
    var result = todo;
    symbols_1.tags.forEach(tag => {
        result = removeTag(result, tag);
    });
    return result;
}
exports.removeAllTags = removeAllTags;
//# sourceMappingURL=todo.js.map