//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";
import { CodeArea } from "./codearea.js";

//general use

let htmlGen = 
`
    <div id="learn-project" class="project minimized pixel-font">
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
            </div>
            <p class="project-title" id="project-title">Hello World Project:</p>
        </div>
        <p class="instructions">instructions</p>
        <div class="player-input-parent"></div>
        <button name="run-button" class="run-code" class="output pixel-font">run</button>
    </div>
`;

let correctCode = new CustomEvent("correctCode", {
    detail: {
        value: 5
    }
});

export class Display {
    constructor(document, parent, projectJSON, htmlString = htmlGen, textareaSize = 1 /*default to 1 line*/, toggled=false, code=null) { 
        this.toggled = toggled;

        this.createElements(document, parent, htmlString);
        this.findElements();

        this.min = true;

        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleElements(false);
        });

        this.projectEl.addEventListener('click', async () => {
            if (this.projectEl.classList.contains('minimized')) {
                this.toggleElements(true);
            }
        })

        this.rewindButton.addEventListener('click', () => {
            this.codeArea.createText(this.projectJSON.code);
        });

        this.projectJSON = projectJSON;
        this.run_button.addEventListener('click', async () => {
            let value = this.textarea.value;
            let codeReturn = await this.displayUserCode(value);
            if(codeReturn == this.projectJSON.returns){
                correctCode = new CustomEvent("correctCode", {
                    detail: {
                        value: (this.reward !== undefined) ? this.reward : 5
                    }
                });
                window.dispatchEvent(correctCode);
                this.reward = 0;
            }
            else{
                console.log("user code was " + codeReturn + " || But the code should've been " + this.projectJSON.returns);
            }
        });

        this.textareaSize = textareaSize;
        this.codeArea.createText("\n");

        this.lastLineCount = 1;

        this.setAttributes();

        this.reward = 5;
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
        this.lineNumbers = this.projectEl.querySelector(".line-numbers");
        this.closeButton = this.projectEl.querySelector(".project-close-button");
        this.rewindButton = this.projectEl.querySelector(".project-restart-button");
        this.title = this.projectEl.querySelector(".project-title");
        this.instructions = this.projectEl.querySelector(".instructions");
    }    

    setAttributes(){
        let addAmm = this.projectJSON.code.split("\n").length - 1;
        this.codeArea.createText(this.projectJSON.code);
        let title = this.projectJSON.title;
        this.title.innerHTML = title;
        this.instructions.innerHTML = 'mission: ' + this.projectJSON.instruction;
        this.output.disabled = true;
    }

    async getInput(){
        this.old = this.output.value;
        this.output.disabled = false;
        return new Promise (resolve => {
            const handler = (e) => {
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
        window.currentDisplay = this;
        if (value) {
            this.editClass("minimized", false);
            this.editClass("notminimized", true);
        } else {
            this.editClass("minimized", true);
            this.editClass("notminimized", false);
        }
        this.projectEl.dispatchEvent(
            new CustomEvent('toggleElements', {
                detail: { shouldShow: this.projectEl.classList.contains("notminimized") }
            }
        )
        );
    }

    editClass(className, set){
        this.projectEl.classList.toggle(className, set);
    }

    toggleClass(className, element){
        element.classList.toggle(className);
    }

    async displayUserCode(code){
        this.output.value = "";
        let result = await runUserCode(code);
        this.output.value = result;
        return result;
    }
    
    setupTextarea(){
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
