//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";

//general use

let htmlGen = `
    <div id="learn-project" class="project center">
        <p>title!</p>
        <div class="code-editor">
            <div class="line-numbers"></div>
            <textarea name="user-code" id="user-code" placeholder="code here..."></textarea>
        </div>
        <button name="run-button" class="run-code">run</button>
        <p name="output" id="output">output</p>
    </div>
`;

export class Display {
    constructor(document, parent, htmlString = htmlGen, textareaSize = 5) { // default to 5 lines
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        this.content = template.content;
        this.projectEl = template.content.firstElementChild;
        parent.appendChild(this.content);

        this.run_button = this.projectEl.querySelector('[name="run-button"]');
        this.output = this.projectEl.querySelector('[name="output"]');
        this.textarea = this.projectEl.querySelector('textarea[name=user-code]');
        this.lineNumbers = this.projectEl.querySelector('.line-numbers');

        this.code = this.textarea;
        this.run_button.addEventListener('click', async () => {
            let value = this.code.value;
            await this.displayUserCode(value);
        });

        this.textareaSize = textareaSize;
        this.indentText(textareaSize);

        this.lastLineCount = 1; // Track previous line count

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

    async displayUserCode(code){
        let result = await runUserCode(code);
        this.output.textContent = result;
        return result;
    }

    indentText(times=5){
        this.textarea.value = ""; // clear first
        for (let index = 0; index < times; index++) {
            this.textarea.value += "\n";
        }
    }
}


//learn
