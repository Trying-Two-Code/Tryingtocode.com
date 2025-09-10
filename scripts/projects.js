//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";

//general use

let htmlGen = `
    <div id="learn-project" class="project center">
        <p>title!</p>
        <textarea name="user-code" id="user-code" placeholder="code here..."></textarea>
        <button name="run-button" class="run-code">run</button>
        <p name="output" id="output">output</p>
    </div>
`;

export class Display{
    constructor(document, parent, htmlString=htmlGen, textareaSize = 15){
        console.log('yea display');
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        this.content = template.content;

        this.projectEl = template.content.firstElementChild;

        parent.appendChild(this.content);
        this.run_button = this.projectEl.querySelector('[name="run-button"]');
        this.output = this.projectEl.querySelector('[name="output"]');
        this.textarea = this.projectEl.querySelector('[name=user-code]');

        console.log(this.content.firstElementChild);
        //return template.content.firstElementChild;

        this.code = this.projectEl.querySelector('[name="user-code"]');
        this.run_button.addEventListener('click', async () => {
            let value = this.code.value;
            console.log(value);
            await this.displayUserCode(value);
        });

        this.textareaSize = textareaSize;
        this.indentText(textareaSize);
    }

    async displayUserCode(code){
        let result = await runUserCode(code);
        //this.content.querySelector('[name="output"]').textContent = result;
        console.log(result);
        this.output.textContent = result;
        return result;
        
    }

    indentText(times=1){
        for (let index = 0; index < times; index++) {
            this.textarea.value += "\n";
        }
    }
}


//learn
