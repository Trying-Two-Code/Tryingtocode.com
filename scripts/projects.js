//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";
import { CodeArea } from "./codearea.js";

//general use

let htmlGen = 
`
    <div id="learn-project" class="project center minimized">
        <div class="top-bar">
            <div class="button">
            <button class="project-close-button">
                <img id="close-img" src='./components/art/close button 1.png'>
            </button>
            </div>
            <div class="button">
            <button class="project-restart-button">
                <img id="reset-img" src="./components/art/rewind icon - stroke.png">
            </button>
            <p class="instructions">instructions<!p>
            </div>
            <p class="project-title">Hello World Project:</p>
        </div>
        <div class="player-input-parent"></div>
        <button name="run-button" class="run-code">run</button>
    </div>
`;



export class Display {
    constructor(document, parent, projectJSON, htmlString = htmlGen, textareaSize = 1, toggled=false) { // default to 5 lines
        this.toggled = toggled;

        this.createElements(document, parent, htmlString);
        this.findElements();

        this.min = true;

        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('close button clicked');
            this.toggleElements();
        });
        this.projectEl.addEventListener('click', async () => {
            if (this.projectEl.classList.contains('minimized')) {
            console.log('main clicked');
            this.toggleElements();
            }
        })

        this.rewindButton.addEventListener('click', () => {
            console.log('rewind button clicked');
            this.codeArea.indentText(1, this.projectJSON.code);
        });

        this.projectJSON = projectJSON;

        this.run_button.addEventListener('click', async () => {
            let value = this.textarea.value;
            await this.displayUserCode(value);
        });

        this.textareaSize = textareaSize;
        this.codeArea.indentText(textareaSize);

        this.lastLineCount = 1;

        this.setAttributes();

    }

    createElements(document, parent, htmlString){
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        this.content = template.content;
        this.projectEl = template.content.firstElementChild;
        parent.appendChild(this.content);

        this.inputParent = this.projectEl.querySelector('[class="player-input-parent"]');

        this.codeArea = new CodeArea(document, this.inputParent);
    }

    findElements(){
        this.run_button = this.projectEl.querySelector('[name="run-button"]');
        this.output = this.projectEl.querySelector('[name="output"]');
        this.textarea = this.codeArea.textarea;
        this.lineNumbers = this.projectEl.querySelector('.line-numbers');
        this.closeButton = this.projectEl.querySelector('[class="project-close-button"]');
        this.rewindButton = this.projectEl.querySelector('[class="project-restart-button"]');
        this.title = this.projectEl.querySelector('[class="project-title"]');
        this.instructions = this.projectEl.querySelector("[class='instructions']");
    }    

    setAttributes(){
        //console.log(this.projectJSON.code);
        let addAmm = this.projectJSON.code.split("\n").length - 1;
        this.codeArea.indentText(5 + addAmm, this.projectJSON.code);
        this.title.innerHTML = this.projectJSON.title;
        this.instructions.innerHTML = 'instructions: ' + this.projectJSON.instruction;
        this.output.disabled = true;
    }

    async getInput(){
        this.old = this.output.value;
        this.output.disabled = false;
        return new Promise (resolve => {
            const handler = (e) => {
            console.log(e.key);
            if (e.key === "Enter") {
                e.preventDefault();
                this.output.removeEventListener("keydown", handler);
                this.output.disabled = true; 
                resolve(this.output.value.slice(this.old.length));
            }
            if(e.key === "Backspace"){
                e.preventDefault();
            }
        }
        this.output.addEventListener("keydown", handler);
        });
    }

    toggleElements(value=false){ // false = stop showing this project
        console.log(this.min);
        this.toggleClass("minimized", this.projectEl);
        this.toggleClass("notminimized", this.projectEl);
        window.currentDisplay = this;
        this.projectEl.dispatchEvent(new Event('toggleElements'));
    }

    toggleClass(className, element){
        if(element.classList.contains(className)){
            element.classList.remove(className);
        } else{
            element.classList.add(className)
        }
    }

    async displayUserCode(code){
        this.output.value = "";
        let result = await runUserCode(code);
        this.output.value = result;
        return result;
    }
    
    setupTextarea(){
        console.log(this.textarea.value);

        const updateLineNumbers = () => {
            const lines = this.textarea.value.split('\n').length;
            this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
            this.lastLineCount = lines;
        };

        this.textarea.addEventListener('input', updateLineNumbers);

        this.textarea.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.textarea.scrollTop;
        });
        

        updateLineNumbers();
    }
}


//learn
