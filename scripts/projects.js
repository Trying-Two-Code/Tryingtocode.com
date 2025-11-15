//for use as a rect for editable projects

import { runUserCode } from "./pyrun.js";
import { CodeArea } from "./codearea.js";
import { getTree } from "./pyrun.js";

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
    </div>
`;

var correctCode = new CustomEvent("correctCode", {
    detail: {
        value: 5
    }
});

/*function checkInclusion(code, JSON, splitJSON="&&&"){
    //if 2 things should be true, use JSONAnd
    splitJSON = splitJSON;
    //loop through things that need to be included
    for (let JSONline of JSON.includes.split(splitJSON)){
        let correct = false;
        code.split("\n").forEach(line => {
            if(line.includes(JSONline)){
                correct = true;
            }
            if(line.includes("#") && !JSONline.includes("#")){
                //player has commented something... hmmmm
                console.error("think of something to check if this is a problem!");
            }
        });
        //keep going unless one of the neccisary lines is never included
        if(!correct){
            console.log("something was wrong...")
            return false;
        }
    }
    //if it hasn't returned false already, then it must be true
    return true;
}

function hasPrintCall(astNode) {
    if (astNode.type === "Call" && astNode.func && astNode.func.id === "print") {
        return true;
    }
    if (astNode.body) {
        return astNode.body.some(hasPrintCall);
    }
    if (Array.isArray(astNode)) {
        return astNode.some(hasPrintCall);
    }
    return false;
}

async function isCorrectCode(code, output, JSON, blankOutput="*"){
    let correct = false;

    //if we don't care about the output, or if the output is correct, then it's good 👍
    let careAboutOutput = !JSON.returns.includes(blankOutput);
    let correctOutput = (output == JSON.returns);
    if(!careAboutOutput || correctOutput){
        correct = true;
    }

    //in this case we know that the code is incorrect
    if(careAboutOutput && !correctOutput) {return false;}

    let codeTree = await getTree(code);
    console.log("code tree: ", codeTree, hasPrintCall(codeTree));
    /*for(key of codeTree.keys()){
        console.log(key);
    }*//*

    //if we care about code content, run this:
    if(JSON.includes != null){
        correct = checkInclusion(code, JSON, "&&&");
        console.log("It was correct: ", checkInclusion(code, JSON, "&&&"));
    }
    
    console.log("it was correct? ", correct);
    return correct;
}
 
"output-includes": "",
"output-discludes": "*",
"code-includes": "*",
"code-discludes": "*",
"failure-shows": "*"

*/
const BLANK = '*';

let errorCode = output => {
    console.log('error check not finished');
    if(output == 'error'){
        return true;
    }
    return false;
}

let checkInclusion = (parts, whole, oppositeParts='*') => {
    if(whole === BLANK){
        return null;
    }

    if(whole === '**') { /* any */ 
        if (checkInclusion(oppositeParts, '')){
            console.log('this is true if the opposite has anything at all');
        }
        return true;
    }

    const partsSplit = '\n'

    for (let index = 0; index < whole.split("&&&").length; index++) {
        const element = whole.split("&&&")[index];
        console.log(element);
        let pass = false;
        parts.split(partsSplit).forEach(part => {
            if(element.includes(part)){
                pass = true;
                part = 'pass';
            }
        });
        if(pass == false){
            return false;
        }
    }

    console.log(parts);
    return true;
}

let isCorrectCode = async (code, json, output) => {
    if (errorCode(output)){
        return false;
    }

    console.log('output is: ', output, 'output something is'.includes('output  is'));

    let tree = await getTree(code);

    let O = [json['output-includes'], json['output-discludes']];
    let C = [json['code-includes'], json['code-discludes']];

    let OI = checkInclusion(output, O[0], O[1]) || true;
    let OD = !checkInclusion(output, O[1], O[0]) || true;
    let CI = checkInclusion(code, C[0], C[1]) || true;
    let CD = !checkInclusion(code, C[1], C[0]) || true;
    
    console.log(OI, ' OI ', OD, ' OD ', CI, ' CI ', CD, 'CD');

    return true;
}

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
            if (this.projectEl.classList.contains('mini')) {
                this.toggleElements(true);
            }
        })

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

    createElements(document, parent, htmlString){
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        this.content = template.content;
        this.projectEl = template.content.firstElementChild;
        parent.appendChild(this.content);

        this.codeAreaParent = this.projectEl.querySelector('[class="codeAreaParent"]');

        this.codeArea = new CodeArea(document, this.codeAreaParent);
    }

    findElements(){
        const query = (_name_) => {return this.projectEl.querySelector(_name_);}

        this.run_button = query('[name="run-button"]');
        this.output = query('[name="output"]');
        this.textarea = this.codeArea.textarea;
        this.lineNumbers = query(".line-numbers");
        this.closeButton = query(".project-close-button");
        this.rewindButton = query(".project-restart-button");
        this.title = query(".project-title");
        this.instructions = query(".instructions");
        this.completedIcon = query(".completed-icon");
    }    

    setAttributes(){
        let addAmm = this.projectJSON.code.split("\n").length - 1;
        this.codeArea.createText(this.projectJSON.code);
        this.codeArea.editPresses(() => this.updateLineNumbers())
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
        
        this.projectEl.dispatchEvent(
            new CustomEvent('toggleElements', {
                detail: { shouldShow: this.projectEl.classList.contains("notmini") }
            }
        )
        );
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
        this.output.value = result;
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
    /*console.error("get rid of below")
    correctCode = new CustomEvent("correctCode", {
            detail: {
                value: 5
            }
        });
    window.dispatchEvent(correctCode);*/
    console.error("get rid of above")
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
    display.run_button.addEventListener('click', async () => {
        let value = display.textarea.value;
        let output = await display.displayUserCode(value);
        let json = display.projectJSON;
        console.log(json);
        correctCode = isCorrectCode(value, json, output).then((output) => {
            if(output){
                rewardPlayer(display);
            }
            else{
                console.log("user code was " + codeReturn + " || But the code should've been " + display.projectJSON.returns);
            }
        });
        
    });
}

