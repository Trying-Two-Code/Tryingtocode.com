//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";

//general use

console.log("project");

let htmlGen = `
    <div id="learn-project" class="project center">
        <p>title!</p>
        <textarea name="user-code" id="user-code" placeholder="code here..."></textarea>
        <button name="run-button" class="run-code">run</button>
        <p name="output" id="output">output</p>
    </div>
`;

export class Display{
    constructor(document, parent, htmlString=htmlGen){
        console.log('yea display');
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        this.content = template.content;

        this.projectEl = template.content.firstElementChild;

        parent.appendChild(this.content);
        this.run_button = this.projectEl.querySelector('[name="run-button"]');

        console.log(this.content.firstElementChild);
        //return template.content.firstElementChild;
    }

    async displayUserCode(code){
        let result = await runUserCode(code);
        //this.content.querySelector('[name="output"]').textContent = result;
        console.log(result);
        return result;
        
    }
}


//learn
