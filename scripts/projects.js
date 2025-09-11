//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";

//general use

let htmlGen = 
`
    <div id="learn-project" class="project center minimized">
        <div class="top-bar">
            <div class="button">
            <button>
                <img id="close-img" src='./components/art/close button 1.png'>
            </button>
            </div>
            <div class="button">
            <button>
                <img id="reset-img" src="">
            </button>
            </div>
            <p class="project-title">Hello World Project:</p>
        </div>
        <div class="input-output">
            <div class="code-editor">
                <div class="line-numbers"></div>
                <textarea name="user-code" id="user-code" placeholder="code here..."></textarea>
            </div>
            <textarea name="output" id="output" class="output">output</textarea>
        </div>
        <button name="run-button" class="run-code">run</button>
    </div>
`;



export class Display {
    constructor(document, parent, htmlString = htmlGen, textareaSize = 5, toggled=false) { // default to 5 lines
        this.toggled = toggled;

        this.createElements(document, parent, htmlString);
        this.findElements();

        //this.projectJSON = projectJSON;
        //this.setAttributes();

        this.code = this.textarea;
        this.run_button.addEventListener('click', async () => {
            let value = this.code.value;
            await this.displayUserCode(value);
        });

        this.textarea.addEventListener('keydown', function(event) {
            if (event.keyCode === 9) {
                event.preventDefault();
                let start = this.selectionStart;
                let end = this.selectionEnd;
                this.value = this.value.substring(0, start) + " " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
            }
        });

        this.textareaSize = textareaSize;
        this.indentText(textareaSize);

        this.lastLineCount = 1; // Track previous line count

        this.setupTextarea();
    }

    createElements(document, parent, htmlString){
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        this.content = template.content;
        this.projectEl = template.content.firstElementChild;
        parent.appendChild(this.content);
    }

    findElements(){
        this.run_button = this.projectEl.querySelector('[name="run-button"]');
        this.output = this.projectEl.querySelector('[name="output"]');
        this.textarea = this.projectEl.querySelector('textarea[name=user-code]');
        this.lineNumbers = this.projectEl.querySelector('.line-numbers');
    }    

    setAttributes(){
        //this.textarea.value = this.projectJSON["1"].code;

    }

    toggleElements(value=false){ // false = stop showing this project
        this.projectEl.classList.add("hide");
    }

    async displayUserCode(code){
        let result = await runUserCode(code);
        this.output.value = result;
        return result;
    }

    indentText(times=5){
        this.textarea.value = ""; // clear first
        for (let index = 0; index < times; index++) {
            this.textarea.value += "\n";
        }
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


//learn
