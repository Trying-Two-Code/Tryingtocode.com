//output and input area for user code
const AREAHTML = 
`
<div class="top-bar input-output main-font">
    <div class="code-editor">
        <div class="line-numbers lines"></div>
        <div class="single-block-grid">
            <textarea class="main-font codearea" name="user-code" placeholder="code here..." spellcheck="false"></textarea>
            <pre class="code-highlight" name="pretty-pre"><code class="main-font language-python" name="pretty-code"></code>
            </pre>
        </div>
    </div>
    <textarea name="output" id="output" class="lines output main-font">output</textarea>
</div>

`
export class CodeArea{
    constructor(document, parent, project=null, codeAreaHTML=AREAHTML, lineAmm=1){
        this.document = document;
        this.parent = parent;
        this.codeAreaHTML = codeAreaHTML;
        this.lineAmm = lineAmm;
        this.project = project;

        this.setAttributes();
    }

    setAttributes(){
        let template = document.createElement('template');

        template.innerHTML = this.codeAreaHTML.trim();
        this.content = template.content;
        this.projectEl = this.content.firstElementChild;
        this.parent.appendChild(this.content);

        this.textarea = this.projectEl.querySelector('textarea[name=user-code]');
        this.prettyCode = this.projectEl.querySelector('code[name=pretty-code]');
        this.prettyPre = this.projectEl.querySelector('pre[name=pretty-pre]');

        let matchScrollFilled = () => {this.matchScroll(this.prettyPre, this.textarea);}
        this.textarea.addEventListener('scroll', matchScrollFilled);
    }

    matchScroll(result_element, element){
        // Get and set x and y
        result_element.scrollTop = element.scrollTop;
        result_element.scrollLeft = element.scrollLeft;
    }

    createPrettyCode(prettyCodeElement, content){
        prettyCodeElement.textContent = content;
        Prism.highlightElement(prettyCodeElement);

    }

    //called by project.js 
    editPresses(call, tab="\t"){
        let prettyCode = this.prettyCode;

        this.textarea.addEventListener('keydown', (event) => {
            let value = this.textarea.value;
            createPrettyCode(prettyCode, value);

            if (event.keyCode === 9) { //tab is tab instead of switch
                event.preventDefault();
                let start = this.textarea.selectionStart;
                let end = this.textarea.selectionEnd;
                this.textarea.value = this.textarea.value.substring(0, start) + tab + this.textarea.value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + tab.length;
            }
            if (event.keyCode === 13){ //make indents if pressing enter
                event.preventDefault();
                //if ctr+enter
                if(event.ctrlKey){
                    //if ctr+sht+enter
                    if(event.shiftKey){
                        this.project.openProject(1);
                    }
                    else{
                        //run code if just ctr+enter
                        console.log(this.project.displayUserCode);
                        this.project.evaluateUserCode();
                    }
                } else{
                    //just do normal boring enter stuff
                    let autoTabResult = this.autoTab();
                    let newValue = autoTabResult[0] + autoTabResult[1]
                    this.textarea.value = newValue;
                    this.textarea.selectionStart = autoTabResult[0].length;
                    this.textarea.selectionEnd = autoTabResult[0].length;

                    this.createText(newValue);
                }
            }

            call();
        });

        let createPrettyCode = this.createPrettyCode;
        this.textarea.addEventListener('input', () => {
            let value = this.textarea.value
            createPrettyCode(prettyCode, value);
        });
    }

    getCurrentLine(){
        const text = this.textarea.value;
        const newLineSplit = text.split("\n");

        const end = this.textarea.selectionEnd;

        let upToSelection = text.substring(0, end)
        let subjectiveLineAmmount = upToSelection.split("\n").length; //the ammount of new lines before selection

        let currentLine = newLineSplit[subjectiveLineAmmount - 1];

        return currentLine;
    }
    
    autoTab(){
        let text  = this.textarea.value;
        let start = this.textarea.selectionStart;
        let end   = this.textarea.selectionEnd

        let tabReg = /^[ \t]+:*|:/
        let value = this.getCurrentLine();

        let tabamm = match(tabReg, value);

        let before = text.substring(0, start) + "\n" + "\t".repeat(tabamm); //everything before selection area
        this.textarea.selectionStart = before.length;
        let after = text.substring(end)

        return [before, after];
    }

    createText(value){
        this.textarea.value = value;
        for (let index = 0; index < this.lineAmm - 1; index++) {
            this.textarea.value += "\n";
        }

        this.createPrettyCode(this.prettyCode, this.textarea.value);

        return this.textarea.value.split("\n").length;
    }
}

let match = (regex, string) => {
    string = (string || '');
    let matches = (string.match(regex) || null);
    if(matches == null) {return 0;}
    return matches[0].length;
}