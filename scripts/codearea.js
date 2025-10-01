//output and input area for user code
const AREAHTML = 
`
<div class="input-output pixel-font">
    <div class="code-editor">
        <div class="line-numbers"></div>
        <textarea class="pixel-font" name="user-code" id="user-code" placeholder="code here..."></textarea>
    </div>
    <textarea name="output" id="output" class="output pixel-font">output</textarea>
</div>
`

//
export class CodeArea{
    constructor(document, parent, codeAreaHTML=AREAHTML, lineNumber=1){
        let template = document.createElement('template');

        template.innerHTML = codeAreaHTML.trim();
        this.content = template.content;
        this.projectEl = template.content.firstElementChild;
        parent.appendChild(this.content);

        this.textarea = this.projectEl.querySelector('textarea[name=user-code]');

        this.textarea.addEventListener('keydown', function(event) {
            if (event.keyCode === 9) {
                event.preventDefault();
                let start = this.selectionStart;
                let end = this.selectionEnd;
                this.value = this.value.substring(0, start) + " " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
            }
        });
    }


    indentText(times=5, beginValue=""){
        this.textarea.value = beginValue;
        for (let index = 0; index < times - 1; index++) {
            this.textarea.value += "\n";
        }
        return this.textarea.value.split("\n").length;
    }

    returnValues(){
        return this.content;
    }
}