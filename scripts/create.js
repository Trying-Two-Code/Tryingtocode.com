import { setProject, findProjects } from './firebase-backend/firebaseProjects.js';
import { SimpleToggle, timeSince } from './tools.js';


class LanguageToggle extends SimpleToggle {
    constructor(parent, elements, imageElements, selectedOption="python"){
        super(parent, elements);
        super.hide();

        this.imageElements = imageElements;
        this.parent = parent;

        this.setupLanguageFunctionality();
    }

    setupLanguageFunctionality(){
        this.setupElements();
    }

    setupElements(){
        if(this.imageElements === undefined) {console.error("O:");}
        for (let index = 0; index < this.imageElements.length; index++) {
            const element = this.imageElements[index];
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
        this.updateSelection(this.imageToOptionDict, toThis);
    }

    toggle() {
        super.toggle();
    }

    updateSelection(dict, choice){
        const dictKeys = Object.keys(dict);
        for (let index = 0; index < dictKeys.length; index++) {
            let key = dictKeys[index];
            const element = dict[key];

            choice = choice.replaceAll("%20", " ");

            if(choice.includes(key)){
                this.selection = element;
            }
        }
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

let getJSONOfProject = (dataObject = { title: "", mission: "", section: "default",
    outputDiscludes: "", outputIncludes: "", codeIncludes: "", codeDiscludes: "",
    hint: "", 
}) => {
    let passIntoJson = {};
    Object.keys(dataObject).forEach(key => {
        const dataPiece = dataObject[key];

        if(dataPiece){
            passIntoJson[key] = dataPiece;
        }
    });
    return passIntoJson;
}

export let getJSONOfCurrentCreateProject = (currentProject) => {
    console.log(currentProject.titleElement);
    let dataObject = {
        title: currentProject.titleElement.value,
        mission: currentProject.mission.value,
        section: currentProject.sectionElement.value,
        "output-discludes": currentProject.outputDiscludes.value,
        "output-includes": currentProject.outputIncludes.value,
        "code-includes": currentProject.codeIncludes.value,
        "code-discludes": currentProject.codeDiscludes.value/*,
        hint: hint*/
    };
    let jsonOfCurrentCreateProject = getJSONOfProject(dataObject);
    console.log(jsonOfCurrentCreateProject);
    return jsonOfCurrentCreateProject;
}

/*class CreateProject{
    constructor(){
        this.canRun = true;
    }
}*/

// this has to be done since create_project is a custom construct:
// it is not loaded when the window is, but a few miliseconds after.

window.addEventListener('create_project_set', () => {

    const CREATE_PROJECT = document.getElementById("create-project-container");
    let PROJECT_OUTPUT = CREATE_PROJECT.PROJECT_OUTPUT;
    console.log(PROJECT_OUTPUT);

    let section =           CREATE_PROJECT.sectionElement;
    let title =             CREATE_PROJECT.titleElement;
    let mission =           CREATE_PROJECT.mission;
    let priority =          CREATE_PROJECT.priorityElement;
    let codeArea =          CREATE_PROJECT.codeArea;
    let outputIncludes =    CREATE_PROJECT.outputIncludes;
    let codeIncludes =      CREATE_PROJECT.codeIncludes;
    let outputDiscludes =   CREATE_PROJECT.outputDiscludes;
    let codeDiscludes =     CREATE_PROJECT.codeDiscludes;
    let submitButton =      CREATE_PROJECT.submitButton;
    let errorElement =      CREATE_PROJECT.errorElement;
    let ownerTextbox =      CREATE_PROJECT.ownerElement;
    let toggleElement =     CREATE_PROJECT.advancedSettingsToggleElement;
    let toggledElements =   CREATE_PROJECT.advancedSettingsBeingToggled;
    let languageSelectToggle =          CREATE_PROJECT.languageSelectToggle;
    let languageSelectToggleElements =  CREATE_PROJECT.languageSelectElementsBeingToggled;
    let  languageSelectImageElements =  CREATE_PROJECT.languageSelectImageElements;
/*reset*/languageSelectImageElements =  Array.from(languageSelectImageElements);

    
    errorElement.innerHTML = "";

    let getErrorMessageParts = ({ middle = " and" } = {}) => {
        let messageParts = [];
        let errorCount = 0;

        let isStringNull = (string) => {
            return (string === null || string === undefined || string === "");
        }

        let addError = (element, pushString) => {
            if(element == null || isStringNull(element.value)){
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

    let timeSinceLastSubmited = timeSince("submited-project-to-database", 10000);

    let submitEvent = () => {
        timeSinceLastSubmited += timeSince("submited-project-to-database", 0);

        let errorMessage = createErrorMessage();

        let codeIncludesValue = codeIncludes.value;
        let codeDiscludesValue = codeDiscludes.value;
        let outputIncludesValue = outputIncludes.value;
        let outputDiscludesValue = outputDiscludes.value;
        let includeDisclude = {codeIncludes: codeIncludesValue, 
                               codeDiscludes: codeDiscludesValue, 
                               outputIncludes: outputIncludesValue, 
                               outputDiscludes: outputDiscludesValue};
        
        let selectedOwner = ownerTextbox.value ? ownerTextbox.value : window.user.uid;
        console.log("YO YO YO! LOOK HERE!_", selectedOwner, "_");

        console.log(codeIncludes, codeDiscludes, outputIncludes, outputDiscludes);

        if(errorMessage){
            console.log(errorElement.value, errorMessage)
            errorElement.innerHTML = errorMessage;
        } 
        else{
            if(timeSinceLastSubmited < 0) { return; }
            timeSinceLastSubmited = -10000; // only once every 10 seconds

            let chosenLanguage = toggleLanguageDropdown.selection ?? "python";

            errorElement.innerHTML = "";
            try{
                let projectOutput = setProject({ section: section.value ?? "default", 
                                                 title: title.value, 
                                                 data: codeArea.textarea.value, 
                                                 language: chosenLanguage, 
                                                 mission: mission.value, 
                                                 includeDisclude: includeDisclude, 
                                                 owner: selectedOwner,
                                                 priority: priority.value });
                
                projectOutput.then((result) => {
                    console.log(result);
                    PROJECT_OUTPUT.value = result;

                    if(result instanceof Error){
                        errorElement.innerHTML = `problem setting project: ${result}`;
                    }
                });
            } catch {
                errorElement.innerHTML = "problem setting project";
            }
        }

        
    }

    submitButton.addEventListener("click", submitEvent);

    let toggleAdvancedElements = new SimpleToggle(toggleElement, 
                                                [toggledElements], 
                                                [`../components/visuals/icons/create/advanced-toggle/${window.theme}/frame-2${window.imageExtension}`, 
                                                 `../components/visuals/icons/create/advanced-toggle/${window.theme}/frame-1${window.imageExtension}`]);
    toggleElement.addEventListener("click", () => {toggleAdvancedElements.toggle();});

    let toggleLanguageDropdown = new LanguageToggle(languageSelectToggle, 
                                                    languageSelectToggleElements, 
                                                    languageSelectImageElements);
    languageSelectToggle.addEventListener("click", () => {toggleLanguageDropdown.toggle();})
    
    var link = true;
    let linkElementsToOutput = () => {
        //link multiple elements:
        let bindElementToValue = (element, bindHandler) => {
            element.addEventListener("input", () => {
                if(!link) { return; }
                bindHandler();
            });
        }

        //1. title
        bindElementToValue(title, () => {
            console.log(PROJECT_OUTPUT.projectTitle);
            PROJECT_OUTPUT.projectTitle.innerHTML = title.value || "title";
        });

        //2. mission
        bindElementToValue(mission, () => {
            PROJECT_OUTPUT.mission.innerHTML = mission.value || "mission";
        });

        //3. code
        bindElementToValue(codeArea, () => {
            PROJECT_OUTPUT.code.value = codeArea.textarea.value || "";
            PROJECT_OUTPUT.updateCode();
        });
    }

    linkElementsToOutput();

    const linkUnlink = PROJECT_OUTPUT.linkUnlink;
    linkUnlink.addEventListener("click", () => {
        link = !link;
    });
}
);