//for use as a rect for editable projects

import { runUserCode } from "./user-code/pyrun.js";
import { CodeArea } from "./user-code/code-area.js";
import { isCorrectCode } from  "./user-code/check-code.js";
//import { Toggle } from "./tools.js";
import { scrollToTop } from "./learn.js";

//general use
let theme = window.theme;
let htmlGen = 
`
    <div id="learn-project" class="project mini main-font">
        <!--div class="top-bar proj-child show-when-mini" style="cursor: pointer;">
            <div class="close-restart">
                <div class="button">
                    <button class="project-close-button project-button" title="close project">
                        <img style="width: 30px; height: 30px;" name="close-img" src='./components/visuals/icons/project/close/${window.theme}.png' class="nice-button">
                    </button>
                </div>
                <div class="button">
                    <button class="project-restart-button project-button" title="reset code to defualt">
                        <img style="width: 30px; height: 30px;" name="reset-img" src="./components/art/reload - 3.png" class="nice-button">
                    </button>
                </div>
            </div>
            <img draggable="false" src="./components/art/ttc coin icon.png" class="hide completed-icon show-when-mini" name="completed-icon"></img>
            <p class="project-title show-when-mini" name="project-title">Hello World Project:</p>
            <div class="button project-hint-button">
                <button class="project-hint-button project-button" title="get hint if stuck">
                    <img style="width: 50px; height: 50px;" name="hint-img" src="./components/art/clue - 5.png" class="nice-button">
                </button>
            </div>
            <dialog class="main-font hint-popup hide" open>404</dialog>
        </div-->
        <!--p class="instructions proj-child">instructions</p-->
        <div class="codeAreaParent proj-child show-when-mini"></div>
        <div class="project-button-buttons proj-child">
            <!--button title="run code" name="run-button" class="run-code"><img class="run-code-button-img" src="./components/art/play button 1 - big.png"></img></button>
            <button title="go to next project" alt="next project" name="next-button" class="next-project" name="next-button"><img src="./components/art/arrow - 1.png"></button-->
        </div>
    </div>
`;

var correctCode = new CustomEvent("correctCode", {
    detail: {
        value: 5 //how many coins to give the user
    }
});

export class Display {
    constructor(document, parent, projectJSON, projectIndex=0, htmlString = htmlGen, 
        textareaSize = 1, startToggled=false, code=null) { 
        this.canRun = false; //can't run when I am first made 
        this.toggled = startToggled; 
        this.projectJSON = projectJSON;
        this.textareaSize = textareaSize;
        this.projectIndex = projectIndex;
        this.projectSection = "python 1";
        
        this.createElements(document, parent, htmlString); 
        this.initializeDisplay();
    }

    makeMeCurrentDisplay(){
        window.currentDisplay = this;
        this.checkIfNoobInterval = setInterval(this.checkIfNoob, 500);
    }

    initializeDisplay(){
        this.findElements(); 

        this.initializeMinimizationFeatures();

        this.initButtons();

        this.lastLineCount = 1;

        this.setAttributes();

        this.reward = 5;
        this.xpReward = .4;
        this.xpPunishment = -.1;
    }

    findElements(){
        const query = (className) => {return this.projectEl.querySelector(className);}

        this.runButton =    query('.run-code');
        this.output =       query('.output');
        this.textarea =     this.codeArea.textarea;
        this.lineNumbers =  query(".line-numbers");
        this.closeButton =  query(".project-close-button");
        this.rewindButton = query(".project-restart-button");
        this.title =        query(".project-title");
        this.instructions = query(".instructions");
        this.completedIcon= query(".completed-icon");
        this.nextButton =   query(".next-project");
        this.hintPopup =    query(".hint-popup");
        this.hintButton =   query(".project-hint-button");
    }

    

    initializeMinimizationFeatures(){
        let toggleMe = () => {this.toggleEvent(this);}
        this.projectEl.addEventListener('click', toggleMe);

        //open others up
        window.addEventListener("openMe", data => {
            let detail = data.detail;

            if(this.projectIndex == detail.openIndex){
                this.toggleEvent(this);
            }
        });

        //close me down
        window.addEventListener("closeMe", data => {
            let myIndex = this.projectIndex;

            let detail = data.detail;

            let withinRange = detail.index > myIndex && myIndex > detail.toIndex;

            if(withinRange) {
                //console.trace(detail, " is index and mine is: ", this.projectIndex);
                this.minimize({mini: detail.mini, gone: detail.gone});
            }
        })
    }

    initButtons(){
        let closeButtonEvent = (e) => {e.stopPropagation(); this.toggleOtherProjects(); this.minimize({mini: true, gone: false}); scrollToTop();}
        let nextButtonEvent = (e) => {e.stopPropagation(); this.openProject(1);} 
        //let rewindButtonEvent = () => {this.codeArea.createText(this.projectJSON.code);} 
        //let hintButtonEvent = () => {this.toggleHint();}

        this.closeButton.addEventListener('click', closeButtonEvent);
        this.nextButton.addEventListener('click', nextButtonEvent);
        //this.nextButton.classList.toggle("glow");
        //this.rewindButton.addEventListener('click', rewindButtonEvent);
        this.codeArea.projectEl.initResetButton(this.rewindButton, this.projectJSON.code);
        //this.hintButton.addEventListener('click', hintButtonEvent);
        //this.hintPopup.addEventListener('click', hintButtonEvent);
        
        //setupRunButton(this);
    }

    checkIfNoob(){
        if(this != window.currentDisplay){return;}

        let inexperienced = (threshold=10) => {
            if(window.xp < threshold) {
                // not a person who has already gotten past a few projects
                console.log("maybe is a noob.");
                console.log("but let's see if they actually need help.");
            } 
        }
        //most users leave after around 2 minutes, so don't go longer than that
        let inNeedOfHelp = (timeLimit=40 /**in seconds */) => {
            let newTime = Date.now();
            result = newTime - this.timebegan;
            timescale = 1000; //seconds
            if(result / timescale > timeLimit);
        }
        console.log("needs help?", inexperienced(), inNeedOfHelp());

    }

    countTimeOpen(){
        console.log("I, ", this.projectIndex, " am closing.");
        let newTime = Date.now();

        let result = null;
        if(typeof this.timebegan !== 'undefined') {
            result = newTime - this.timebegan;
        }

        this.timebegan = Date.now();

        if(result){
            console.log(result);
            result = result / 1000;
            result = Math.round(result);
            try{
                window.logEvent("time open", 
                    {   value: result, 
                        project_index: this.projectIndex, 
                        project_title: this.title.value, 
                        project_section: this.projectSection 
                    });
            }catch{
                console.log("could not log");
            }
            return result;
        }
    }

    openProject(relativeIndex=0){ //open the next project: relativeIndex=1
        this.openOtherProject({openIndex: this.projectIndex + relativeIndex});
        var changeOpenProject = new CustomEvent("closeMe", {detail: {index: this.projectIndex, toIndex: -1, gone: true, mini: true}});
        window.dispatchEvent(changeOpenProject);

        if(relativeIndex == 0) {
            this.makeMeCurrentDisplay();
        }
    }

    createElements(document, parent, htmlString){
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        this.content = template.content;
        this.projectEl = this.content.firstElementChild;
        parent.appendChild(this.content);

        this.codeAreaParent = this.projectEl.querySelector(".codeAreaParent");

        this.codeArea = new CodeArea(document, this.codeAreaParent, this);
    }


    setAttributes(){
        let title = this.projectJSON.title;
        if(this.projectJSON.hint != undefined) {
            this.hintPopup.innerHTML = this.projectJSON.hint;
        } else {
            this.hintButton.classList.add("hide"); 
        }
        this.title.innerHTML = title;
        this.instructions.innerHTML = 'mission: ' + this.projectJSON.instruction;

        this.codeArea.textarea.value = this.projectJSON.code;
        this.codeArea.projectEl.createPrettyCode(this.codeArea.prettyPre, this.projectJSON.code);
        //debugger;
        //this.output.disabled = true;
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
                    //***
                }
            }
            this.output.addEventListener("keydown", handler);
        });
    }
    toggleOtherProjects(details = {index: this.projectIndex, toIndex: -1, gone: false, mini: true}){
        let localToggleEvent = new CustomEvent("closeMe", {detail: details});
        window.dispatchEvent(localToggleEvent);
    }

    openOtherProject(details = {openIndex: 0}){
        let localToggleEvent = new CustomEvent("openMe", {detail: details});
        window.dispatchEvent(localToggleEvent);
    }

    toggleEvent(element) {
        //close others down
        let makeProjectsGone = () => {
            this.toggleOtherProjects({index: this.projectIndex, toIndex: -1, gone: true, mini: true})
        }

        let makeDisplayGone = () => {
            this.toggleOtherProjects({index: window.currentDisplay.projectIndex, toIndex: this.projectIndex, gone: false, mini: true});
            window.currentDisplay.minimize({mini: true, gone: false});
        }

        let minimizeBelowCurrentDisplay = () => {
            if(typeof window.currentDisplay !== "undefined"){
                makeDisplayGone();
            }
        }

        //open me up
        if (element.projectEl.classList.contains('mini') || element.projectEl.classList.contains('gone')) {
            if(window.currentDisplay != null){
                window.currentDisplay.countTimeOpen();
            }
            this.timebegan = Date.now();
            console.log("I, ", this.projectIndex, " am opening up");

            minimizeBelowCurrentDisplay();
            makeProjectsGone();

            this.minimize({mini: false, gone: false});
        
            console.log("set current display");
            this.makeMeCurrentDisplay();

            //must wait to scroll, else it won't take up the full screen space and 
            //window won't understand where to scroll to.
            const timeToScroll = 310;
            setTimeout(scrollToTop, timeToScroll);
        }

    }

    minimize(values = {mini: true, gone: false}){ // true = stop showing this project 
        let changeClass = (change, value=false) => {
            this.projectEl.classList.toggle(change, value);
        }

        changeClass("mini", values.mini); //makes projects small
        changeClass("gone", values.gone); //makes projects turn into TINY squares (see learn.css)

        let detectCanRun = () => {
            if(values.mini || values.gone){
                this.canRun = false;
                this.toggleHint(this.hintPopup, true);
            } else {
                this.canRun = true;
            }
        }

        detectCanRun();
    }

    toggleHint(element=this.hintPopup, toThis=undefined) {
        return;
        this.hintToggled = !this.hintToggled;
        element.classList.toggle("hide", toThis);
    }

    addXP(result){
        let alreadyPassed = this.reward == 0;
        console.log("add xp?");
        console.log(alreadyPassed, result);
        if(!alreadyPassed) { 
            switch (result) {
                case true:
                    window.addXP(this.xpReward);
                    this.xpReward = -.001;
                    break;
                case false:
                    window.addXP(this.xpPunishment);
                    this.xpPunishment = -.01;
                    break;
                default:
                    window.addXP(-.01);
            };
        }
        
    }

    async evaluateUserCode(output){
        let decision = (success) => {
            console.log(success, success && success !== null)

            this.output.classList.toggle("output-mid", (success === null));
            this.output.classList.toggle("output-correct", success && success !== null);
            this.output.classList.toggle("output-incorrect", !success && success !== null);
            
            if(success !== null){ this.addXP(success); }
            
        }
        decision(null);

        let value = this.textarea.value;

        if(!output[0]){
            decision(false);
            return false;
        }

        let json = this.projectJSON;

        correctCode = isCorrectCode(value, json, output[1]).then((passed) => {
            if(passed) {decision(true);}
            this.playerCorrect(passed);
        });

    }
    
    playerCorrect(passed){
        if(passed){
            rewardPlayer(this);
            this.nextButton.classList.add("glow");
        }
        else{
            //console.log("user code was " + output + " || But the code should've been " + this.projectJSON["output-includes"]);
            //logDiscrepancy(output, value, json);
        }
    }
    
}

function rewardPlayer(display){
    if(display.reward !== 0 && display.reward !== null){
        const defaultReward = 5;
        correctCode = new CustomEvent("correctCode", {
            detail: {
                value: (display.reward !== undefined) ? display.reward : defaultReward
            }
        });
            
        window.dispatchEvent(correctCode);
        display.reward = 0;
        display.completedIcon.classList.remove("hide");
    }
}

/* //useful log function

function logDiscrepancy(output, code, json){
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

*/