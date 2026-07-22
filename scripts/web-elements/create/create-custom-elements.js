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

    <textarea readonly="true" class="main-font share-url hide" data-js-tag="share-url" placeholder="share-url"></textarea>
    <button class="share-button nice-button no-bg-button" data-js-tag="share-button"><img draggable="false" class="share-button--image" src="../components/visuals/icons/create/share/${window.TTC.theme}${window.TTC.imageExtension}" alt="share"></button>
    <button class="submit-button nice-button" data-js-tag="submit-button"><img draggable="false" class="submit-button--image" src="../components/visuals/icons/create/submit/${window.TTC.theme}${window.TTC.imageExtension}" alt="submit"></button>
    <p data-js-tag="error-text" class="error-message">must contain -title- and -mission-</p>
    
    
    <div class="test">
        <div id="project-parent" class="project-parent"></div>
    </div>
</div>
        `;

        this.initValues();
        this.setupLinkButton();
        this.setupViewButton();
        this.setupShareButton();

        let create_project_set = new Event("create_project_set");
        window.dispatchEvent(create_project_set);

    }


    initValues() {
        let queryME = (dataJSTag) => { return this.querySelector(`[data-js-tag=${dataJSTag}]`); }

        this.PROJECT_OUTPUT = queryME('project-output');
        this.ADVANCED_SETTINGS = queryME("advanced-settings");
        this.VIEW_DATA = this.querySelector("ttc-view-data-projects");
        this.VIEW_DATA.createParent = this;
        this.PROJECT_OUTPUT.render();
        this.ADVANCED_SETTINGS.render();

        this.sectionElement =   queryME("create-section");
        this.titleElement =     queryME("title-section");
        this.mission =          queryME('mission-section');
        this.codeArea =         queryME("create-code");
        console.log("usuing code area: ", this.codeArea);
        this.ownerElement =     queryME("owner-section");
        this.shareButton  =     queryME("share-button");
        this.submitButton =     queryME("submit-button");
        this.shareURLTextarea = queryME("share-url");
        this.errorElement =     queryME("error-text");

        this.hint =             queryME("hint-section");
        
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
        this.ownerElement.value   = this.getCurrentLocalData("create_userinput_owner");
        this.sectionElement.value = this.getCurrentLocalData();

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

    getCurrentLocalData(item="create_userinput_section"){
        console.log("getting current section...");
        let localData = localStorage.getItem(item);
        let returnThis = ""
        try{
            let obj = JSON.parse(localData);
            console.log(obj)
            console.log("hello?");
            let okeys = Object.keys(obj);
            for (let index = 0; index < okeys.length; index++) {
                const key = okeys[index];
                const elem = obj[key];
                console.log(key, elem);
                if(elem === 0){
                    returnThis = key;
                    console.log(returnThis, "is return this.");
                }
            }
        } catch{
            returnThis = "";
        }
        return returnThis;
    }

    updateViewButton({newName = "", dataElement = null, localStorageName = ""} = {}){
        this.VIEW_DATA[dataElement] = newName;

        //let newObject = updateCreateUserinputSection(newName, localStorageName);
        //console.log(newObject);
        //newObject = JSON.stringify(newObject);

        //localStorage.setItem(localStorageName, newObject);
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
            this.shareURLTextarea.value = `https://tryingtocode.com/learn?code-language=python&code-section=${this.sectionElement.value}&code-owner=${this.ownerElement.value || window.user.uid}`;
        });
    }

    setupShareButton(){
        let share = async () => {
            try {
                await navigator.clipboard.writeText(this.shareURLTextarea.value ||  `https://tryingtocode.com/learn?code-language=python&code-section=${this.sectionElement.value}&code-owner=${this.ownerElement.value || window.user.uid}`);
            } catch (error) {
                console.error(error.message);
            }
        }
        this.shareButton.addEventListener("click", () => {
            share();
        });

    }

    setupLinkButton(){
        this.linkButtonImageSwapper = new ImageButton(this.linkButton, 
            [`../components/visuals/icons/project/link/${window.TTC.theme}/frame-1${window.TTC.imageExtension}`, 
             `../components/visuals/icons/project/link/${window.TTC.theme}/frame-2${window.TTC.imageExtension}`]);
        
        this.linkButtonImageSwapper.changeOnClick();
    }

    setIncludeDisclude({outputIncludes = "*", codeIncludes = "*", outputDiscludes = "*", codeDiscludes = "*"} = {}) {
        this.outputIncludes.value = outputIncludes;
        this.codeIncludes.value = codeIncludes;
        this.outputDiscludes.value = outputDiscludes;
        this.codeDiscludes.value = codeDiscludes;
    }

    loadDatabaseProject({title = "", mission = "", data = "", includeDisclude = {}, hint = ""} = {}){
        console.log(this.titleElement);
        console.log(title, mission, data, this.titleElement, this.mission, this.codeArea);

        this.titleElement.value = title;
        this.mission.value = mission;
        this.codeArea.textarea.value = data;
        this.hint.value = hint;
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


