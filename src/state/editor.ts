import { TextEditor, Position, Range, Selection, TextEditorRevealType, window, DecorationOptions} from "vscode";
import { noteHeaderPattern, eolToString } from "./symbols";


export enum TopBottom {
    Top,
    Bottom
}


export class Editor {
    readonly vseditor: TextEditor; 
    constructor(textEditor: TextEditor) {
        this.vseditor = textEditor;    
    }

    public static get activeEditor(): Editor | undefined {
        let vseditor = window.activeTextEditor;
        if(vseditor){
            return new Editor(vseditor);
        } else {
            return undefined;
        }
        
    }

    public search(searchString: string, startPos?: Position, reverse?: boolean): Position | undefined {        
        let searchRegexp = new RegExp(searchString, "g");
        if (!startPos) {
            startPos = new Position(0, 0);
        }
        let finalPos = this.getEof();
        let text = this.vseditor.document.getText(new Range(startPos, finalPos));
        if(reverse){
            text = this.vseditor.document.getText(new Range(new Position(0,0), startPos));            
        }        
        var result = searchRegexp.exec(text);
        if (result) {
            if(!reverse){
                return this.vseditor.document.positionAt(result.index + result[0].length + this.vseditor.document.offsetAt(startPos));
            } else {
                var lastItem = result;                
                while(result){
                    lastItem = result;
                    result = searchRegexp.exec(text);
                }
                return this.vseditor.document.positionAt(lastItem.index);
            }            
        } else {            
            return undefined;
    
        }
    }

    public moveCursor(pos: Position){
        this.vseditor.selection = new Selection(pos, pos);
        this.highlightSection(pos);
    }

    getEof(): Position {
        let lastLineStart = new Position(this.vseditor.document.lineCount - 1, 0);
        let lastLine = this.vseditor.document.lineAt(lastLineStart);
        return lastLine.rangeIncludingLineBreak.end;
    }

    public getSectionPosition(section: string, footer: boolean = false): Position | undefined {                
        let secPos = this.search("//" + section + "//");

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
        let endOfSection = this.search("//End//", pos);
        return new Position(endOfSection!.line, 0);
    }

    getStartOfSection(pos: Position): Position | undefined {
        return this.search(noteHeaderPattern, pos, true);
    }

    public highlightSection(pos: Position) {        
        let top = this.getStartOfSection(pos);
        let bottom = this.getEndOfSection(pos);
        if(top && bottom) {            
            this.vseditor.revealRange(new Range(top, bottom), TextEditorRevealType.AtTop);
            let bottomOffset = this.vseditor.document.offsetAt(bottom);
            let curPos = this.vseditor.document.positionAt(bottomOffset - 1);
            this.vseditor.selection= new Selection(curPos, curPos);
            this.narrow(new Range(curPos, curPos));
        }
        
    }


    
    public addLineToSection(section: string, text: string, topBottom: TopBottom) {        
        let secPos = this.getSectionPosition(section, topBottom === TopBottom.Bottom);
        if (secPos) {
            let offSet = this.vseditor.document.offsetAt(secPos!);
            if (topBottom === TopBottom.Bottom) {
                offSet = this.vseditor.document.offsetAt(secPos!) - 1;
            }
            let insertText = eolToString(this.vseditor.document.eol) + "  " + text;
            this.vseditor.edit((edit) => {
                edit.insert(this.vseditor.document.positionAt(offSet), insertText);
            });
            let cursorPos = this.vseditor.document.positionAt(offSet + insertText.length);
            let cursorSel = new Selection(cursorPos, cursorPos);
            this.vseditor.selection = cursorSel;
        } else {
            window.showErrorMessage("Couldn't find section:" + section);
        }
    
    }

    public narrow(range: Range) {
        let hidden = window.createTextEditorDecorationType({
            opacity: '0'            
          });

        let visble = window.createTextEditorDecorationType({
            opacity: '1'
        });

        let hiddenArray: DecorationOptions[] = [];
        let visibleArray: DecorationOptions[] = [];

        if(range.start.line !== 0){
            let endOffset = this.vseditor.document.offsetAt(range.start);
            let beforeRange = new Range(
                new Position(0,0),
                this.vseditor.document.positionAt(endOffset - 1)
            );
            let hideStart: DecorationOptions = {range: beforeRange};
            hiddenArray.push(hideStart);
        }

        if(range.end.line !== this.getEof().line){
            let endOffset = this.vseditor.document.offsetAt(range.end);
            let afterRange = new Range(
                this.vseditor.document.positionAt(endOffset + 1),
                this.getEof()
            );
            let hideEnd: DecorationOptions = {range: afterRange};
            hiddenArray.push(hideEnd);
        }

        let showRange: DecorationOptions = {range};
        visibleArray.push(showRange);


        this.vseditor.setDecorations(hidden, hiddenArray);
        this.vseditor.setDecorations(visble, visibleArray);

        this.vseditor.revealRange(range);


    }

    
    
}

