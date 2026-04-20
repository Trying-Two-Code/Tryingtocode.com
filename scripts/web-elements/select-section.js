import { applySettings } from "../settings-functions.js";

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
        <button data-js-tag="section-button" class="main-font section-button nice-button ${this.classOrientation}">
            ${name}
            <img
            src="./components/visuals/icons/create/language/${this.sectionLanguage}/${window.TTC.theme}${window.TTC.imageExtension}"
            ></img>
        </button>
        `;
        applySettings();
    }
    findElements(){
        this.sectionButton = this.querySelector("[data-js-tag='section-button']");
    }
    initFunctionality(){
        this.sectionButton.addEventListener('click', () => {
            this.showSection();
        });
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
    }
    hideMe(){
        this.classList.add("hide");
    }

    static hideAllSections(){
        TTCSectionButton.sectionSelectionParent.classList.add("closed");
        for (const inst of TTCSectionButton.selectionInstances) {
            inst.hideMe();
        }
    }
}

customElements.define("ttc-section-button", TTCSectionButton);

class TTCBringbackSectionSelection extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.init();
    }
    init(){
        this.makeElement();
    }
    makeElement(){
        this.innerHTML = `
        
        `;
    }
}