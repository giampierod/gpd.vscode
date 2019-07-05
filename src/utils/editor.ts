import { TextEditor, Position, window, Range, Selection, TextEditorRevealType } from "vscode";

export class Editor {
    readonly vseditor: TextEditor; 
    constructor(textEditor: TextEditor) {
        this.vseditor = textEditor;    
    }

    public search(searchString: RegExp, startPos?: Position): Position | undefined {        
        if (!startPos) {
            startPos = new Position(0, 0);
        }
        let finalPos = this.getEof();
        let text = this.vseditor.document.getText(new Range(startPos, finalPos));
        let result = searchString.exec(text);
        if (result) {
            return this.vseditor.document.positionAt(result.index + result[0].length + this.vseditor.document.offsetAt(startPos));
        } else {            
            return undefined;
    
        }
    }

    public moveCursor(pos: Position){
        this.vseditor.selection = new Selection(pos, pos);
        this.vseditor.revealRange(new Range(pos, pos), TextEditorRevealType.Default);
    }

    getEof(): Position {
        let lastLineStart = new Position(this.vseditor.document.lineCount - 1, 0);
        let lastLine = this.vseditor.document.lineAt(lastLineStart);
        return lastLine.rangeIncludingLineBreak.end;
    }

    public getSectionPosition(section: string, footer: boolean = false): Position | undefined {        
        let headerRegex = new RegExp("//" + section + "//");
        let secPos = this.search(headerRegex);

        console.log(secPos!);
    
        if (secPos) {
            var pos = secPos!;
            if (footer) {
                let end = this.getEndOfSection(secPos!);
                if (end) {
                    pos = end!;
                }
            }
            return pos;
        } else {
            return undefined;
        }
    
    }

    getEndOfSection(pos: Position): Position | undefined {
        let footerRegex = new RegExp("//End//");
        let endOfSection = this.search(footerRegex, pos);
        return new Position(endOfSection!.line, 0);
    }
}