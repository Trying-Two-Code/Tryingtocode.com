import { ImageButton } from "../../tools.js";

class TTCCreateProject extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        this.exampleAttribute = this.getAttribute("ex");

        

        this.innerHTML = `

<ttc-view-data-projects></ttc-view-data-projects>
<div class="create-align">
    <div class="create" data-js-tag="create-page-holder">
        <div class="user-create-project main-font">

            <div class="row">
                <div class="create-main">
                    <textarea class="main-font code-lines create-section" name="section" data-js-tag="create-section" placeholder="section">default</textarea>
                    <textarea class="main-font code-lines create-title" name="title" data-js-tag="title-section" placeholder="title"></textarea>
                    <textarea class="code-lines create-mission main-font" name="mission" placeholder="mission" data-js-tag="mission-section"></textarea>
                    <div class="create-code-container">
                        <ttc-typeable-code data-js-tag="create-code" data-js-tag="create-code" name="defualt code" class="main-font" placeholder="defualt code" language="python"></ttc-typeable-code>
                    </div>
                </div>
                <div id="create-output">
                    <ttc-create-project-output data-js-tag="project-output"></ttc-create-project-output>
                </div>
            </div>

            <ttc-create-advanced-settings data-js-tag="advanced-settings"></ttc-create-advanced-settings>
        </div>
        
    </div>

    <button class="submit-button nice-button" data-js-tag="submit-button"><img draggable="false" class="submit-button--image" src="../components/visuals/icons/create/submit/${window.theme}${window.imageExtension}" alt="submit"></button>
    <p data-js-tag="error-text" class="error-message">must contain -title- and -mission-</p>
    
    
    <div class="test">
        <div id="project-parent" class="project-parent"></div>
    </div>
</div>
        `;

        this.initValues();
        this.setupLinkButton();
        this.setupViewButton();

        let create_project_set = new Event("create_project_set");
        window.dispatchEvent(create_project_set);

    }


    initValues() {
        let queryME = (dataJSTag) => { return this.querySelector(`[data-js-tag=${dataJSTag}]`); }

        this.PROJECT_OUTPUT = queryME('project-output');
        this.ADVANCED_SETTINGS = queryME("advanced-settings");
        this.VIEW_DATA = this.querySelector("ttc-view-data-projects");
        this.PROJECT_OUTPUT.render();
        this.ADVANCED_SETTINGS.render();

        this.sectionElement =   queryME("create-section");
        this.titleElement =     queryME("title-section");
        this.mission =          queryME('mission-section');
        this.codeArea =         queryME("create-code");
        console.log("usuing code area: ", this.codeArea);
        this.ownerElement =     queryME("owner-section");
        this.submitButton =     queryME("submit-button");
        this.errorElement =     queryME("error-text");
        
        this.measureParent =    queryME("user-measure");
        this.outputIncludes =   this.measureParent.querySelector("[data-js-tag='measure-output-includes']");
        this.codeIncludes =     this.measureParent.querySelector("[data-js-tag='measure-code-includes']");
        this.outputDiscludes =  this.measureParent.querySelector("[data-js-tag='measure-output-discludes']");
        this.codeDiscludes =    this.measureParent.querySelector("[data-js-tag='measure-code-discludes']");

        this.createOutput = this.querySelector("ttc-create-project-output");
        this.linkButton = this.createOutput.querySelector("[name='link-unlink-toggle']");

        this.advancedSettingsToggleElement =      queryME("advanced-toggle");
        this.advancedSettingsBeingToggled =       queryME("settings-toggled-element");
        this.languageSelectToggle =               queryME("language-select-toggle");
        this.languageSelectElementsBeingToggled = this.querySelectorAll(".language-toggled-elements");
        this.languageSelectImageElements =        this.querySelectorAll(".language-select--image-element");

        this.priorityElement =  this.ADVANCED_SETTINGS.priorityElement;
        this.canRun = true;

        this.PROJECT_OUTPUT.project = this;

        this.initViewButtons();
    }

    initViewButtons(){
        let checkLocalStorage = (value) => {
            try{
                let localStorageValue = localStorage.getItem(value);
                return localStorageValue;
            } catch {
                return "";
            }
        }
        this.ownerElement.value   = checkLocalStorage("create_userinput_owner");
        this.sectionElement.value = checkLocalStorage("create_userinput_section");
        this.updateViewButton({
            newName: this.ownerElement.value, 
            dataElement: "owner", 
            localStorageName: "create_userinput_owner"
        });
        this.updateViewButton({
            newName: this.sectionElement.value,
            dataElement: "section",
            localStorageName: "create_userinput_section"
        });
    }

    updateViewButton({newName = "", dataElement = null, localStorageName = ""} = {}){
        this.VIEW_DATA[dataElement] = newName;
        localStorage.setItem(localStorageName, newName);
        console.log("change", newName);
    }

    setupViewButton(){
        //add changing owner
        //add changing section
        this.ownerElement.addEventListener("input", () => {
            this.updateViewButton({   
                newName: this.ownerElement.value, 
                dataElement: this.VIEW_DATA.owner, 
                localStorageName: "create_userinput_owner"
            });
        });
        this.sectionElement.addEventListener("input", () => {
            this.updateViewButton({
                newName: this.sectionElement.value,
                dataElement: this.VIEW_DATA.section,
                localStorageName: "create_userinput_section"
            });
        });
    }

    setupLinkButton(){
        this.linkButtonImageSwapper = new ImageButton(this.linkButton, 
            [`../components/visuals/icons/project/link/${window.theme}/frame-1${window.imageExtension}`, 
             `../components/visuals/icons/project/link/${window.theme}/frame-2${window.imageExtension}`]);
        
        this.linkButtonImageSwapper.changeOnClick();
    }

    setIncludeDisclude({outputIncludes = "*", codeIncludes = "*", outputDiscludes = "*", codeDiscludes = "*"} = {}) {
        this.outputIncludes.value = outputIncludes;
        this.codeIncludes.value = codeIncludes;
        this.outputDiscludes.value = outputDiscludes;
        this.codeDiscludes.value = codeDiscludes;
    }

    loadDatabaseProject({title = "", mission = "", data = "", includeDisclude = {}} = {}){
        console.log(this.titleElement);
        console.log(title, mission, data, this.titleElement, this.mission, this.codeArea);

        this.titleElement.value = title;
        this.mission.value = mission;
        this.codeArea.textarea.value = data;
        this.setIncludeDisclude(includeDisclude);
    }

}

customElements.define("ttc-create-project", TTCCreateProject);

class TTCViewProject extends TTCCreateProject {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("yea boi!");
    }
}

customElements.define("ttc-view-project", TTCViewProject);


