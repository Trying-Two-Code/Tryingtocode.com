//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";
import { CodeArea } from "./codearea.js";
import { isCorrectCode } from  "./checkCode.js";

//general use

let htmlGen = 
`
    <div id="learn-project" class="project mini pixel-font">
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
            <img src="./components/art/ttc coin icon.png" class="hide completed-icon" id="completed-icon"></img>
            <p class="project-title" id="project-title">Hello World Project:</p>
        </div>
        <p class="instructions">instructions</p>
        <div class="codeAreaParent"></div>
        <button name="run-button" class="run-code run-button"><img src="./components/art/play button 1 - big.png"></img></button>
        <button name="next-button" class="next-project" id="next-button"></button>
    </div>
`;

var correctCode = new CustomEvent("correctCode", {
    detail: {
        value: 5 //how many coins to give the user
    }
});


export class Display {
    constructor(document, parent, projectJSON, htmlString = htmlGen, textareaSize = 1 /*default to 1 line*/, toggled=false, code=null) { 
        this.canRun = false; //can't run when I am first made
        this.toggled = toggled;

        this.createElements(document, parent, htmlString);
        this.findElements();

        this.min = true;

        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleElements(false);
        });

        this.projectEl.addEventListener('click', async () => {
            if (this.projectEl.classList.contains('mini')) {
                this.toggleElements(true);
            }
        });

        this.nextButton.addEventListener('click', () => {
            this.openProject(1);
        });

        this.rewindButton.addEventListener('click', () => {
            this.codeArea.createText(this.projectJSON.code);
        });

        this.projectJSON = projectJSON;
        
        setupRunButton(this);

        this.textareaSize = textareaSize;
        this.codeArea.createText("\n");

        this.lastLineCount = 1;

        this.setAttributes();

        this.reward = 5;
    }

    openProject(relativeIndex=0){
        if(relativeIndex == 0) {/* do not change index */ return; }
    }

    createElements(document, parent, htmlString){
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        this.content = template.content;
        this.projectEl = this.content.firstElementChild;
        parent.appendChild(this.content);

        this.codeAreaParent = this.projectEl.querySelector('[class="codeAreaParent"]');

        this.codeArea = new CodeArea(document, this.codeAreaParent);
    }

    findElements(){
        const query = (_name_) => {return this.projectEl.querySelector(_name_);}

        this.runButton = query('[name="run-button"]');
        this.output = query('[name="output"]');
        this.textarea = this.codeArea.textarea;
        this.lineNumbers = query(".line-numbers");
        this.closeButton = query(".project-close-button");
        this.rewindButton = query(".project-restart-button");
        this.title = query(".project-title");
        this.instructions = query(".instructions");
        this.completedIcon = query(".completed-icon");
        this.nextButton = query(".next-project");
    }    

    setAttributes(){
        let addAmm = this.projectJSON.code.split("\n").length - 1;
        this.codeArea.createText(this.projectJSON.code);
        this.codeArea.editPresses(() => this.updateLineNumbers());
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
                    
                }
            }
            this.output.addEventListener("keydown", handler);
        });
    }

    toggleElements(value=false){ // false = stop showing this project
        window.currentDisplay = this;

        this.editClass("mini", !value);
        this.editClass("notmini", value);
        this.canRun = value;
        this.rewindButton.disabled = !value;
        
        this.projectEl.dispatchEvent(
            new CustomEvent('toggleElements', {
                detail: { shouldShow: this.projectEl.classList.contains("notmini") }
            }
        ));
    }

    //make small
    minimize(element=this){
        element.editClass("gone", false);
        element.editClass("notmini", false);
        element.editClass("mini", true);
    }

    //make totally invisible
    hide(element=this){
        element.editClass("gone", true);
        element.editClass("notmini", false);
        element.editClass("mini", true);

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
        this.output.value = result[1];
        return result;
    }

    setupTextarea(){
        this.textarea.addEventListener('input', () => this.updateLineNumbers());

        this.textarea.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.textarea.scrollTop;
        });
        
        this.updateLineNumbers();
    }

    updateLineNumbers(){
        const lines = this.textarea.value.split('\n').length;
        this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
        this.lastLineCount = lines;
    }
}

function rewardPlayer(display){
    console.log("reward, ", display.reward);
    if(display.reward !== 0 && display.reward !== null){
        console.log("reward 2");
        correctCode = new CustomEvent("correctCode", {
            detail: {
                value: (display.reward !== undefined) ? display.reward : 5
            }
        });
            
        window.dispatchEvent(correctCode);
        display.reward = 0;
        display.completedIcon.classList.remove("hide");
    }
}

function setupRunButton(display){
    display.runButton.addEventListener('click', async () => {
        if(!display.canRun){
            console.log("SHOULDN'T HAVE RUN")
        }
        else{
            console.log('PAY ATTENTION!', display.canRun, display);
            let value = display.textarea.value;
            console.log("mark 1");
            let output = await display.displayUserCode(value);
            console.log('output in project 2: ', output);
            let json = display.projectJSON;
            console.log(json, output[1]);
            console.log("workd");
            correctCode = isCorrectCode(value, json, output[1]).then((passed) => {
                console.log("results: ", passed, output, output[0]);
                if(passed && output[0]){
                    rewardPlayer(display);
                }
                else{
                    //console.log("user code was " + output + " || But the code should've been " + display.projectJSON["output-includes"]);
                    //logDescrepensy(output, value, json);
                }
            });
        }
    });
}

function logDescrepensy(output, code, json){
    let CI = [json["code-includes"], code];
    let CD = [json["code-discludes"], code];
    let OI = [json["output-includes"], output[1]];
    let OD = [json["output-discludes"], output[1]];

    let properties = [CI, CD, OI, OD];

    for (let index = 0; index < properties.length; index++) {
        const element = properties[index];
        if(element[0] != element[1]){
            console.log("!");
            console.log("!(potential) discrepensy found!");
            console.log("factor 1: ");
            console.log(element[0]);
            console.log("factor 2: ")
            console.log(element[1]);
            console.log("!");
        }
    }
}

