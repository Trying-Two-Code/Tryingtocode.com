import { runUserCode } from "../user-code/pyrun.js";

let match = (regex, string) => {
    string = (string || '');
    let matches = (string.match(regex) || null);
    if(matches == null) {return 0;}
    return matches[0].length;
}

class TTCTypeableCode extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        const placeholder_text = this.getAttribute("placeholder") ?? "code here...";
        const language = this.getAttribute("language") ?? "python";
        this.language = language;
        const codeText = this.getAttribute("code-text") ?? "";
        this.readonly = this.getAttribute("readonly") ?? false;

        /*this.style = `
        .code-editor {
            display: flex;
            flex-direction: row;
        }
        `;*/

        this.innerHTML = `
                    <div class="show-when-mini" data-js-tag="container-for-closeable"></div>
                    <div data-js-tag="container-for-hintable"></div>
                    <div data-js-tag="editor-container" class="code-editor input-output">
                        <div class="actual-input-code" style="display: flex; flex-direction: row !important;">
                            <div data-js-tag="side-numbers" class="line-numbers lines code-lines proj-child"></div>
                            <div class="single-block-grid proj-child">
                                <textarea data-js-tag="user-code-section" class="main-font codearea proj-child" name="user-code" placeholder="${placeholder_text}" spellcheck="false">${codeText}</textarea>
                                <pre data-js-tag="pretty-code--pre" class="language-${language} code-highlight code-lines proj-child main-font" name="pretty-pre"><code data-js-tag="pretty-code" class="language-${language}" name="code-editor--pretty-code" aria-hidden="true">${codeText}</code>
                                </pre>
                            </div>
                        </div>
                        <div data-js-tag="container-for-output"></div>
                    </div>
                    <div data-js-tag="container-for-runnable"></div>
        ` ;
        this.initValues();
        this.initFunctionality();
    }

    initValues(){
        this.projectEl = this.querySelector("[data-js-tag='editor-container']");
        let projectEl = this.projectEl;
        let queryME = (dataTag) => { return projectEl.querySelector(`[data-js-tag="${dataTag}"]`);}
        this.textarea = queryME("user-code-section");
        this.prettyCode = queryME("pretty-code--pre");
        this.prettyPre = queryME("pretty-code");
        this.lineNumbers = queryME("side-numbers");
        this.specialEnter = false;
        //this.classList.add("show-when-mini");
    }

    initFunctionality(){
        this.textarea.readOnly = this.readonly;

        //let matchScrollFilled = () => {this.matchScroll(this.prettyPre, this.textarea); this.matchScroll(this.prettyPre, this.lineNumbers);}
        //let matchScrollFilled = () => {this.matchScroll(this.lineNumbers, this.textarea); this.matchScroll(this.prettyCode, this.textarea);}
        let matchScrollFilled = () => {this.matchScroll(this.prettyCode, this.textarea); this.matchScroll(this.lineNumbers, this.prettyCode);}
        this.textarea.addEventListener('scroll', matchScrollFilled);
        
        let updateEverything = () => {
            this.createPrettyCode(this.prettyCode, this.textarea.value);
            this.updateLineNumbers(); 
        }
        this.editPresses(updateEverything);

        window.requestAnimationFrame(() => {this.updateLineNumbers();});
        
    }

    matchScroll(result_element, element){
        // Get and set x and y
        result_element.scrollTop = element.scrollTop;
        result_element.scrollLeft = element.scrollLeft;
    }

    createPrettyCode(prettyCodeElement=this.prettyCode, content=this.textarea.value){
        prettyCodeElement.textContent = content;
        Prism.highlightElement(prettyCodeElement);
    }

    updateLineNumbers(){
        const lines = this.textarea.value.split('\n').length;
        this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
        this.lastLineCount = lines;
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

    getCurrentLine(){
        const text = this.textarea.value;
        const newLineSplit = text.split("\n");

        const end = this.textarea.selectionEnd;

        let upToSelection = text.substring(0, end);
        let subjectiveLineAmmount = upToSelection.split("\n").length; //the ammount of new lines before selection

        let currentLine = newLineSplit[subjectiveLineAmmount - 1];

        return currentLine;
    }

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
            if(event.ctrlKey && this.specialEnter){
                //if ctr+sht+enter
                if(this.runCode){
                    if(event.shiftKey){
                        this.project.openProject(1);
                    }
                    else{
                        //run code if just ctr+enter
                        console.log(this.project);
                        this.runCode();
                    }
                }
                else{
                    console.log("can't run non existant run code", this.runCode);
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

            //this.createPrettyCode(this.prettyCode, this.textarea.value);
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
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;

                //this.createText(this.textarea.value);
                //this.createPrettyCode(this.prettyCode, this.textarea.value);
            }
        }

        let assureLastLineFilled = (value) => {
            //make sure that the last line isn't empty
            console.log(value[value.length-1] == "\n");
            if(value[value.length-1] == "\n"){
                //this.textarea.value += " ";
                let text = this.textarea.value;
                text += " ";
                this.createPrettyCode(undefined, text);
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
            }

            //accessability setting for tab switchers:
            if(event.key === 'Escape'){
                event.preventDefault();
                let focusOn = this.project.runButton;
                focusOn.focus();

            }

            if(event.key === "Backspace"){
                if(isPair(getCharacter(-1)[0])){
                    if(isPair(getCharacter(-1))[1] == getCharacter(1)){
                        this.textarea.selectionStart -= 1;
                        this.textarea.selectionEnd += 1;
                        appendToTextarea("");
                    }
                }

                //make sure that the last line isn't empty
                console.log("value is _", value[value.length-1], "_", value[value.length-1] == "\n");
                if(value[value.length-1] == "\n"){
                    this.prettyCode.value += " ";
                }
            }

            changePairs(event);

            if(event.defaultPrevented){
                call();
            }

            assureLastLineFilled(value);
        });

        this.textarea.addEventListener('input', (input) => {
            //input happens after keydown
            call();

            let value = this.textarea.value;
            assureLastLineFilled(value);
        });
    }
    
}


customElements.define("ttc-typeable-code", TTCTypeableCode);


export class TTCComplexTypeableCode extends TTCTypeableCode {
    constructor(){
        super();
    }

    complexRender(){
        this.render();
        
        this.runnable = this.getAttribute("runnable") ?? false;
        this.closeable = this.getAttribute("closeable") ?? false;
        this.hintable = this.getAttribute("hintable") ?? false;
        this.linkable = this.getAttribute("linkable") ?? false;
        this.nextProjButton = this.getAttribute("nextProjButton") ?? "gone"; // not implemented

        if(this.runnable || this.closeable || this.hintable || this.linkable) {
            this.initComplexValues();

            if(this.runnable) { this.editToRunnable(); }
            if(this.closeable){ this.editToCloseable(); }
            if(this.hintable) { this.editToHintable(); }
            if(this.linkable) { this.editToLinkable(); }
        }

    }

    initComplexValues(){
        this.runnableContainer = this.querySelector("[data-js-tag='container-for-runnable']");
        this.closeableContainer = this.querySelector("[data-js-tag='container-for-closeable']");
        this.linkableContainer = this.querySelector("[data-js-tag='container-for-hintable']");

        this.outputHeight = this.getAttribute("output-height") ?? null;
    }

    editToRunnable(){
        this.outputContainer = this.querySelector("[data-js-tag='container-for-output']");

        this.codeOutput = "";
        let nextProjectClass = "";
        if(!this.runnableContainer && !this.nextProjButton) { nextProjectClass = "gone"; }

        this.outputHTML = `
        <textarea js-data-tag="output-section" name="output" class="lines output output-mid main-font code-lines proj-child">output</textarea>
        `;
        this.addedRunnableHTML = `
        <div class="project-button-buttons proj-child">
            <button js-data-tag="run-button" title="run code" name="run-button" class="run-code"><img class="run-code-button-img big-image" src="./components/visuals/icons/project/run-code/${window.theme}${window.imageExtension}"></img></button>
            <button title="go to next project" alt="next project" name="next-button" class="next-project ${nextProjectClass} pixel-img" name="next-button"><img class="next-project" src="./components/visuals/icons/project/next-project/${window.theme}${window.imageExtension}"></button>
        </div>
        ` ;
        this.runnableContainer.insertAdjacentHTML("afterbegin", this.addedRunnableHTML);
        this.outputContainer.insertAdjacentHTML("afterbegin", this.outputHTML);

        this.outputArea = this.querySelector("[js-data-tag='output-section']");
        this.runButton = this.querySelector("[js-data-tag='run-button']");


        this.runButton.addEventListener("click", async() => {
            console.log(this.project, "1");
            if(typeof this.project === "undefined") { console.error("if I don't have a display, I can't run"); return; }
            console.log(this.project, "2");
            if(this.project.canRun){
                this.runCode();
            }
        });

        if(this.outputHeight){
            this.outputArea.style.height = this.outputHeight;
        }
        this.outputArea.readOnly = this.readonly;
        this.specialEnter = true;
    }

    async runCode(){
        this.codeOutput = await runUserCode(this.textarea.value);
        this.outputArea.value = this.codeOutput[1];
        this.project.evaluateUserCode(this.codeOutput);
    }

    editToCloseable(){
        this.addedCloseableHTML = `
        <div class="top-bar proj-child show-when-mini">
            <div class="close-restart show-when-mini">
                <div class="button">
                    <button class="project-close-button project-button" title="close project">
                        <img style="width: 30px; height: 30px;" name="close-img" src='./components/visuals/icons/project/close/${window.theme}${window.imageExtension}' class="nice-button">
                    </button>
                </div>
                <div class="button">
                    <button class="project-restart-button project-button" title="reset code to defualt">
                        <img style="width: 30px; height: 30px;" name="reset-img" src="./components/visuals/icons/project/reload/${window.theme}${window.imageExtension}" class="nice-button">
                    </button>
                </div>
                <img draggable="false" src="./components/visuals/icons/project/coin-collected-indicator/${window.theme}${window.imageExtension}" class="hide completed-icon show-when-mini pixel-img" name="completed-icon"></img>
                <p style="font-size: 1.3rem;" class="project-title show-when-mini" name="project-title">title</p>
                <div data-js-tag="hintable-container"></div>
            </div>
            <dialog data-js-tag='hint-popup' class="main-font hint-popup hide" open>404</dialog>
        </div>
        <p class="instructions proj-child" name="project-mission">mission</p> 
        `;
        this.closeableContainer.insertAdjacentHTML("afterbegin", this.addedCloseableHTML);
        this.projectTitle = this.querySelector("[name='project-title']");
        this.mission = this.querySelector("[name='project-mission']");
        this.hintableContainer = this.querySelector("[data-js-tag='hintable-container']");
        this.hintablePopup = this.querySelector("[data-js-tag='hint-popup']");
    }

    editToHintable(){
        if(!this.hintableContainer) { return; }
        
        this.addedHintableHTML = `
            <div class="button project-hint-button">
                <button data-js-tag="hint-toggle-button" class="project-hint-button project-button" title="get hint if stuck">
                    <img style="width: 50px; height: 50px;" name="hint-img" src="./components/visuals/icons/project/hint/${window.theme}${window.imageExtension}" class="nice-button">
                </button>
            </div>
        `;
        
        this.hintableContainer.insertAdjacentHTML("afterbegin", this.addedHintableHTML);
        
        let addBehaviour = () => {
            this.hintToggleButton = this.querySelector("[data-js-tag='hint-toggle-button']");
            let toggleEvent = () => {
                //console.log(this.hintablePopup);
                this.hintablePopup.show();
                this.hintablePopup.classList.toggle("hide");
            }

            this.hintToggleButton.addEventListener("click", toggleEvent);
            this.hintablePopup.addEventListener("click", toggleEvent);
        }

        addBehaviour();
    }

    editToLinkable(){
        this.addedLinkableHTML = `
            <button class="nice-button link-button" name="link-unlink-toggle"><img class="link-button--image" src="../components/visuals/icons/project/link/${window.theme}/frame-1${window.imageExtension}"></img></button>
        `;

        this.linkableContainer.insertAdjacentHTML("afterbegin", this.addedLinkableHTML);
    }

    initResetButton(resetButton, initialCode){
        if(!this.textarea) { console.error("cannot reset a non existant codearea"); return; }
        resetButton.addEventListener("click", () => {
            this.textarea.value = initialCode;
            this.createPrettyCode();
        });
    }
}

customElements.define("ttc-complex-typeable-code", TTCComplexTypeableCode);