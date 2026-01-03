//output and input area for user code
const AREAHTML = 
`
<div class="top-bar input-output main-font">
    <div class="code-editor">
        <div class="line-numbers lines"></div>
        <textarea class="main-font codearea" name="user-code" id="user-code" placeholder="code here..."></textarea>
    </div>
    <textarea name="output" id="output" class="lines output main-font">output</textarea>
</div>
`
export class CodeArea{
    constructor(document, parent, codeAreaHTML=AREAHTML, lineAmm=1){
        let template = document.createElement('template');

        template.innerHTML = codeAreaHTML.trim();
        this.content = template.content;
        this.projectEl = this.content.firstElementChild;
        parent.appendChild(this.content);

        this.textarea = this.projectEl.querySelector('textarea[name=user-code]');

        this.lineAmm = lineAmm;
    }

    //called by project.js 
    editPresses(call, tab="   "){
        this.textarea.addEventListener('keydown', function(event) {
            if (event.keyCode === 9) { //tab is space instead
                event.preventDefault();
                let start = this.selectionStart;
                let end = this.selectionEnd;
                this.value = this.value.substring(0, start) + tab + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + tab.length;
            }
            if (event.keyCode === 13){ //make (): have an indent next line
                let end = this.selectionEnd;
                let end_value = this.value.substring(end - 1, end);
                if(end_value === ":"){
                    let start = this.selectionStart;
                    event.preventDefault();
                    this.value = this.value.substring(0, start) + "\n" + tab + this.value.substring(end);
                }
            }
            call();
        });
    }

    createText(value){
        this.textarea.value = value;
        for (let index = 0; index < this.lineAmm - 1; index++) {
            this.textarea.value += "\n";
        }
        return this.textarea.value.split("\n").length;
    }
}