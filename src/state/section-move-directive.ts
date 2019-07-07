import * as vscode from "vscode";
import { Editor, TopBottom } from "./editor";




export class SectionMoveDirective {
    section: string;
    prefix: string;
    topBottom: TopBottom;
    position: vscode.Position | undefined;
    public constructor(section: string, prefix: string, topBottom: TopBottom, editor: Editor) {
        this.section = section;
        this.prefix = prefix;
        this.topBottom = topBottom;                
        let secPos = editor.getSectionPosition(this.section, this.topBottom === TopBottom.Bottom);
        if (secPos) {
            if (this.topBottom === TopBottom.Top) {
                this.position = new vscode.Position(secPos!.line + 1, 0);
            } else {
                this.position = secPos!;
            }
        } else {
            vscode.window.showErrorMessage("Couldn't find section:" + this.section);
            this.position = undefined;
        }
    }
    public getPosition(): vscode.Position | undefined {
        return this.position;
    }

}

