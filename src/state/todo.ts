import { Editor, TopBottom } from "./editor";
import { SectionMoveDirective } from "./section-move-directive";
import { isHeader, eolToString, tags } from "./symbols";
import { Position, Selection, window } from "vscode";


export function moveTodoToSection(section: string, topBottom: TopBottom, prefix: string) {
    copyTodoToSection(section, topBottom, prefix, true);
}

export function copyTodoToSection(section: string, topBottom: TopBottom, prefix: string, move?: boolean) {
    let editor = Editor.activeEditor!;
    let copyDirective = [new SectionMoveDirective(section, prefix, topBottom, editor)];
    copyTodoToSections(copyDirective, move);

}

export function copyTodoToSections(directives: SectionMoveDirective[], deleteTodo?: boolean): void {
    let editor = Editor.activeEditor!;
    let vseditor = editor.vseditor;
    let pos = vseditor.selection.anchor;
    let line = vseditor.document.lineAt(pos);
    if (!isHeader(line.text)) {
        let todo = removeTag(line.text, "~").trim();
        vseditor.edit((edit) => {
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    let insertText = "  " + directive.prefix + todo + eolToString(vseditor.document.eol);
                    edit.insert(directive.getPosition()!, insertText);
                }
            });
            if (deleteTodo) {
                edit.delete(line.rangeIncludingLineBreak);
            }
        });
        if (deleteTodo) {
            let newPos = new Position(pos.line, pos.character);
            directives.forEach(directive => {
                if (directive.getPosition()) {
                    if (pos.line > directive.getPosition()!.line) {
                        newPos = new Position(pos.line + 1, pos.character);
                    }
                }
            });
            let cursorSel = new Selection(newPos, newPos);
            vseditor.selection = cursorSel;
        }
    } else {
        window.showWarningMessage("Can't select a header or footer as a Todo item.");
    }
}

function removeTag(text: string, tag: string): string {
    let pattern = new RegExp(escapeRegexp(tag) + "\\(.*?\\)[ ]?", "g");
    return text.replace(pattern, "");
}

function escapeRegexp(s: string): string {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function removeAllTags(todo: string): string {
    var result = todo;
    tags.forEach(tag => {
        result = removeTag(result, tag);
    });
    return result;

}


