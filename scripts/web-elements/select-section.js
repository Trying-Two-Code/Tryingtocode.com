class TTCSectionButton extends HTMLElement{
    static selectionInstances = new Set();

    constructor(){
        super();
    }
    connectedCallback(){
        this.init();
    }
    init(){
        TTCSectionButton.selectionInstances.add(this);
        this.makeElement();
        this.findElements();
        this.initFunctionality();
    }
    makeElement(){
        let name = this.innerHTML;
        console.log(name, " is name");
        this.innerHTML = `
        <button data-js-tag="section-button" class="main-font section-button">
            ${name}
        </button>
        `;
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
        window.TTC.loadProjectsFromDatabase({ section: this.sectionName, owner: this.sectionOwne });
        TTCSectionButton.hideAllSections();
    }
    hideMe(){
        this.classList.add("hide");
    }

    static hideAllSections(){
        for (const inst of TTCSectionButton.selectionInstances) {
            inst.hideMe();
        }
    }
}

customElements.define("ttc-section-button", TTCSectionButton);