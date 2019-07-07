import { EndOfLine } from "vscode";

export let noteTagPattern = /`\(([a-zA-Z0-9_\"\., ]*)\)/.source; 
export let noteHeaderPattern = /\/\/[a-zA-Z0-9_\"\., ]*\/\//.source;
export let dateFormat = "DD/MM/YY hh:mm";
export let tags = ["`", "~", "$", "#", "@", "!"];
export let headerPattern = "//(.*)//";

export function eolToString(eol: EndOfLine): string {
    if (eol === EndOfLine.CRLF) {
        return "\r\n";
    } else {
        return "\n";
    }
}

export function isHeader(text: string): boolean {
    let headerPattern = new RegExp('//(.*)//');
    return headerPattern.test(text);
}