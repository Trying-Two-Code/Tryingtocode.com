import { setProject } from './firebase-backend/firebaseProjects.js';
import { SimpleToggle } from './tools.js';

// this has to be done since create_project is a custom construct:
// it is not loaded when the window is, but a few miliseconds after.

class LanguageToggle extends SimpleToggle {
    constructor(parent, elements, imageElements, selectedOption="python"){
        super(parent, elements);
        super.hide();

        this.imageElements = imageElements;
        this.parent = parent;

        this.setupLanguageFunctionality();
        this.selection = parent.firstChild.src;
    }
    setupLanguageFunctionality(imageElements){
        console.log(this.imageElements);
        this.setupElements();
    }
    setupElements(){
        if(this.imageElements === undefined) {console.error("O:");}
        for (let index = 0; index < this.imageElements.length; index++) {
            const element = this.imageElements[index];
            console.log(element.firstChild.src);
            element.addEventListener("click", () => {this.changeSelection(element.firstChild.src)})
        }

        if(localStorage.getItem("lastCreateLanguage")){
            this.changeSelection(localStorage.getItem("lastCreateLanguage"));
        }
    }
    changeSelection(toThis) {
        let parentImage = this.parent.firstChild;
        parentImage.src = toThis;
        localStorage.setItem("lastCreateLanguage", toThis);
        this.getSelection(this.imageToOptionDict, toThis);
    }

    toggle() {
        super.toggle();
    }
    getSelection(dict, choice){
        const dictKeys = Object.keys(dict);
        for (let index = 0; index < dictKeys.length; index++) {
            const element = dict[dictKeys[index]];
            let key = dictKeys[index]

            choice = choice.replaceAll("%20", " ");


            if(choice.includes(key)){
                this.selection = element;
            }
        }
        console.log(this.selection);
    }

    get imageToOptionDict(){
        let imageToOptionData = {
            "/components/art/language logo - python.png": "python",
            "/components/art/language logo - javascript.png": "javascript",
            "/components/art/language logo - html.png": "html",
            "/components/art/language logo - c.png": "c"
        }
        return imageToOptionData;
    } 
}

window.addEventListener("user_made", () => {
    console.log("making official data thing");
    setProject({ owner: "OFFICIAL", data: "it worked", title: "YEAH!", section: "2" });
})

window.addEventListener('create_project_set', () => {

    const CREATE_PROJECT =  document.getElementById("create-project-container");
    let queryCREATE_PROJECT = idname => {return CREATE_PROJECT.querySelector(idname);}

    let title =             queryCREATE_PROJECT("#create-title");
    let code =              queryCREATE_PROJECT("#create-code");
    let output =            queryCREATE_PROJECT("#create-output");
    let outputIncludes =    queryCREATE_PROJECT("#measures--output-includes");
    let codeIncludes =      queryCREATE_PROJECT("#measures--code-includes");
    let outputDiscludes =   queryCREATE_PROJECT("#measures--output-discludes");
    let codeDiscludes =     queryCREATE_PROJECT("#measures--code-discludes");
    let mission =           queryCREATE_PROJECT("#create-mission");
    let submitButton =      queryCREATE_PROJECT("#submit-button");
    let errorElement =      queryCREATE_PROJECT("#submit-button-error");
    //let languageSelector =  queryCREATE_PROJECT("#user-create-project--language-select");
    let toggleElement =     queryCREATE_PROJECT("#user-create-project--advanced-toggle");
    let toggledElements =   document.querySelectorAll(".user-create-project--toggled-element");
    let languageSelectToggle =        queryCREATE_PROJECT("#language-select-toggle");
    let languageSelectToggleElement = document.querySelectorAll(".language-select-elements");
    let languageSelectImageElements = document.querySelectorAll(".language-select--image-element");
    languageSelectImageElements = Array.from(languageSelectImageElements);
    
    errorElement.innerHTML = "";

    let getErrorMessageParts = ({ middle = " and" } = {}) => {
        let messageParts = [];
        let errorCount = 0;

        let isStringNull = (string) => {
            return (string === null || string === undefined || string === "");
        }

        let addError = (element, pushString) => {
            if(isStringNull(element.value)){
                if(errorCount > 0) {
                    // another has already been made
                    pushString = middle + pushString;
                }

                errorCount += 1;
                messageParts.push(pushString);
            }
        }

        addError(title, " -title-");
        addError(mission, " -mission-");

        console.log(messageParts, mission.value, title.value);

        return messageParts;
    }

    let createErrorMessage = ({ start = "must contain ", end = "", middle = " and" } = {}) => {
        let messageParts = getErrorMessageParts({ middle: middle });

        if(messageParts == null || messageParts.length == 0) {return null;}

        let errorString = start;
        messageParts.forEach(string => {
            errorString += string;
        });
        errorString += end;

        return errorString;
    }

    let submitEvent = () => {
        
        let errorMessage = createErrorMessage();
        debugger;

        let codeIncludesValue = codeIncludes.value;
        let codeDiscludesValue = codeDiscludes.value;
        let outputIncludesValue = outputIncludes.value;
        let outputDiscludesValue = outputDiscludes.value;

        let includeDisclude = {codeIncludes: codeIncludesValue, codeDiscludes: codeDiscludesValue, outputIncludes: outputIncludesValue, outputDiscludes: outputDiscludesValue};

        console.log(codeIncludes, codeDiscludes, outputIncludes, outputDiscludes);

        if(errorMessage){
            console.log(errorElement.value, errorMessage)
            errorElement.innerHTML = errorMessage;
        } 
        else{
            let chosenLanguage = toggleLanguageDropdown.selection ?? "python";
            console.log(chosenLanguage);

            console.log("got create");
            console.log(title.value, code.value);

            errorElement.innerHTML = "";
            let projectOutput = setProject({ title: title.value, data: code.value, language: chosenLanguage, mission: mission.value, includeDisclude: includeDisclude});
            output.value = projectOutput;
        }

        
    }

    submitButton.addEventListener("click", submitEvent);

    let toggleAdvancedElements = new SimpleToggle(toggleElement, toggledElements, ["../components/art/advanced settings - 2.png", "../components/art/advanced settings - 1.png"]);
    toggleElement.addEventListener("click", () => {toggleAdvancedElements.toggle();});

    console.log(languageSelectImageElements);
    let toggleLanguageDropdown = new LanguageToggle(languageSelectToggle, languageSelectToggleElement, languageSelectImageElements);
    languageSelectToggle.addEventListener("click", () => {toggleLanguageDropdown.toggle();})
    
}
);