import { getCodeLanguage, onlineSections, sendAppropriateInformationForSectionAndOwner } from "../load-projects-into-learn.js";
import { applySettings, editSetting } from "../settings-functions.js";
import { deleteAllTextareasExport } from "./typeable-code.js";

class TTCSectionButton extends HTMLElement{
    static selectionInstances = new Set();
    static id = 0;
    static classOrientation = Math.random() < 0.5;

    constructor(){
        super();
    }

    connectedCallback(){
        this.init();
    }

    init(){
        this.identifySelf();
        this.makeElement();
        this.findElements();
        this.initFunctionality();
    }

    identifySelf(){
        TTCSectionButton.selectionInstances.add(this);
        TTCSectionButton.id += 1;
        TTCSectionButton.sectionSelectionParent = this.sectionSelectionParent;
        this.id = TTCSectionButton.id;
    }

    makeElement(){
        let name = this.innerHTML;
        console.log(name, " is name");
        this.classOrientation = (this.id % 2 == 1) ? "left" : "right";
        this.innerHTML = `
            <label data-js-tag="section-label-title" class="hide simple-title main-font smaller-text" for="ttc-section-button--button-${this.id}">
                ${name}
            </label>
            <button data-js-tag="section-button" class="main-font section-button nice-button" id="ttc-section-button--button-${this.id}">
                <img
                class="pixel-img big-img"
                src="./components/visuals/icons/create/language/${this.sectionLanguage}/${window.TTC.theme}${window.TTC.imageExtension}"
                ></img>
            </button>
        `;
        this.classList.add(`${this.classOrientation}`);
        applySettings();
    }

    findElements(){
        this.sectionButton = this.querySelector("[data-js-tag='section-button']");
        this.labelTitle = this.querySelector("[data-js-tag='section-label-title']");
    }

    initToggleLabel(){
        let initHide = () => {
            let initHideOnClick = () => {
                let hide = () => {
                    this.labelTitle.classList.add("hide");
                    document.removeEventListener("click", hide);
                };
                document.addEventListener("click", hide);

                this.sectionButton.removeEventListener("pointerleave", initHideOnClick); //{once: true}
            }
            this.sectionButton.addEventListener("pointerleave", initHideOnClick);
        }

        let initShow = () => {
            this.sectionButton.addEventListener("pointerenter", () => {
                this.labelTitle.classList.remove("hide");
                initHide();
            });
        }

        initShow();
    }

    initFunctionality(){
        this.sectionButton.addEventListener('click', () => {
            this.showSection();
        });
        this.initToggleLabel();
    }
    showSection(){
        //sectionOwner & sectionName & sectionLanguage are set in learn.js: createSectionButton
        console.log(this.sectionOwner, this.sectionName);
        window.TTC.loadProjectsFromDatabase({ section: this.sectionName, owner: this.sectionOwner });
        
        const SECTION_STRING = "code-section";
        const OWNER_STRING = "code-owner";
        const url = new URL(window.location);
        url.searchParams.set(SECTION_STRING,    this.sectionName);
        url.searchParams.set(OWNER_STRING,      this.sectionOwner);
        window.history.replaceState({}, "", url);

        TTCSectionButton.hideAllSections();
        editSetting({learnSection: this.sectionName});
    }
    hideMe(){
        this.classList.add("hide");
    }

    static hideAllSections(){
        console.assert(TTCSectionButton.sectionSelectionParent != null);
        TTCSectionButton.sectionSelectionParent.classList.add("closed");
        for (const inst of TTCSectionButton.selectionInstances) {
            inst.hideMe();
        }
    }
}

export const hideAllSectionsExport = (sectionParent=null) => {
    if(TTCSectionButton.id > 0){ //a section button has been made
        TTCSectionButton.hideAllSections();
    } else{ //DIY
        console.assert(sectionParent !== null);
        sectionParent.classList.add("closed");
    }
}

customElements.define("ttc-section-button", TTCSectionButton);

class TTCBringBackSectionSelection extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.init();
    }
    init(){
        this.makeElement();
        this.findElement();
        this.initFunctionality();
    }
    makeElement(){
        this.innerHTML = `
            <button data-js-tag='go-home' class="nice-button">go back to selections</button>
        `;
    }
    findElement(){
        this.mainButton = this.querySelector("[data-js-tag='go-home']");
    }
    initFunctionality(){
        this.mainButton.addEventListener("click", () => {
            this.bringBackEvent();
        });
    }

    bringBackEvent(){
        deleteAllTextareasExport();
        editSetting({learnSection: ""});
        this.remove();
        //sendAppropriateInformationForSectionAndOwner();
        bringBackSections();
        //showSectionSelectionsAgain() <- find out the function
    }
}

let bringBackSections = () => {
    let language = getCodeLanguage();
    let sections = onlineSections;
    let showSectionSelectionEvent = new CustomEvent("showSectionSelection", {detail: {language: language, sections: sections[language]}});
    window.TTC.events.dispatchEvent(showSectionSelectionEvent);
}

customElements.define("ttc-bring-section-back", TTCBringBackSectionSelection);