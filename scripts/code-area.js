//output and input area for user code
const AREAHTML = 
`
<div class="top-bar input-output main-font">
    <div class="code-editor">
        <div class="line-numbers lines code-lines"></div>
        <div class="single-block-grid">
            <textarea class="main-font codearea" name="user-code" placeholder="code here..." spellcheck="false"></textarea>
            <pre class="code-highlight code-lines" name="pretty-pre"><code class="main-font language-python" name="pretty-code"></code>
            </pre>
        </div>
    </div>
    <textarea name="output" class="lines output main-font code-lines">output</textarea>
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

        let appendToTextarea = (text) => {
            let start = this.textarea.selectionStart;
            let end = this.textarea.selectionEnd;
            return this.textarea.value.substring(0, start) + text + this.textarea.value.substring(end);
        }

        let getCharacter = (relativeIndex=1) => {
            let start = this.textarea.selectionStart;
            let end = this.textarea.selectionEnd;
            return this.textarea.value.substring(start, end + relativeIndex);
        }

        let changeEnter = (event) => {
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
            }
        }

        let changeTab = (event) => {
            event.preventDefault();
            let start = this.textarea.selectionStart;
            this.textarea.value = appendToTextarea(tab);
            this.textarea.selectionStart = this.textarea.selectionEnd = start + tab.length;

            this.createText(this.textarea.value);
            this.createPrettyCode(this.prettyCode, this.textarea.value);
        }

        let isPair = (string) => {
            let brackets = {'(' : ')', '[' : ']', '{' : '}'};
            let pairs = {'"': '"', "'": "'", "`": "`", ...brackets};

            let beginPairs = Object.keys(pairs);

            return [beginPairs.includes(string), pairs[string]];
        }

        let changePairs = (event) => {
            let brackets = {'(' : ')', '[' : ']', '{' : '}'};
            let pairs = {'"': '"', "'": "'", "`": "`", ...brackets};

            let nextCharacter = getCharacter(1);
            let goodNextCharacter = nextCharacter.includes(" ") || nextCharacter.includes("\n") || nextCharacter == "";

            if(isPair(event.key)[0] && goodNextCharacter){
                event.preventDefault();
                let start = this.textarea.selectionStart;
                
                this.textarea.value = appendToTextarea(event.key + pairs[event.key]);
                //this.textarea.selectionEnd -= 2;
                console.log(pairs[event.key]);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;

                //this.createText(this.textarea.value);
                this.createPrettyCode(this.prettyCode, this.textarea.value);
            }
        }

        this.textarea.addEventListener('keydown', (event) => {
            let value = this.textarea.value;

            if (event.key === 'Tab') { //tab is tab instead of switch
                changeTab(event);
                this.createText(this.textarea.value);
            }
            if (event.key === 'Enter'){ //make indents if pressing enter
                changeEnter(event);
                this.createText(this.textarea.value);
            }
            //accessability setting for tab switchers:
            if(event.key === 'Escape'){
                event.preventDefault();
                let focusOn = this.project.runButton;
                console.log(focusOn);
                focusOn.focus();
            }
            if(event.key === "Backspace"){
                if(isPair(getCharacter(-1)[0])){
                    console.log(isPair(getCharacter(-1)), getCharacter(1))
                    if(isPair(getCharacter(-1))[1] == getCharacter(1)){
                        this.textarea.selectionStart -= 1;
                        this.textarea.selectionEnd += 1;
                        appendToTextarea("");
                    }
                }
            }

            changePairs(event);

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