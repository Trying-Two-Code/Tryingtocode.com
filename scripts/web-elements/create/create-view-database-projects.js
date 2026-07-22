import { timeSince } from "../../tools.js";
import { findProjects } from "../../firebase-backend/firebaseProjects.js";
import { applySettings } from "../../settings-functions.js";

class TTCViewDataProjects extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){

        this.innerHTML = `
            <div class="main-font">
                <ol name="database-section-dropdown" data-js-tag="database-section-dropdown">

                </ol>

                <div name="database-project-dropdown" data-js-tag="database-project-dropdown">

                </div>
            </div>
        `;
        this.initValues();
        this.initButtons();
    }

    initValues(){
        this.maxAmmountPerMinute = 20;
        this.timeSinceLastDone = 0;
        this.owner;
        this.section = "default";
        this.sectionDropdown = this.querySelector("[data-js-tag='database-section-dropdown'");
        console.log("setting it to: ", this.sectionDropdown, this);
        this.databaseProjectButtonDropdown = this.querySelector("[data-js-tag='database-project-dropdown']"); 
        //rough fix \/
        this.createProject = this.parentElement;
        
        applySettings();

        try{
            this.sections = JSON.parse(localStorage.getItem("create_userinput_section"));
        } catch{
            console.error("error");
        }
    }

    initButtons(){
        const maxButtons = 1;

        let sortSections = () => {
            let sectionEntries = Object.entries(this.sections);
            
            sectionEntries.sort((a, b) => a[1] - b[1]);

            return sectionEntries
        }

        let entries = sortSections();
        let sectionKeys = entries.map(entry => entry[0]);

        let index = 0;

        sectionKeys.forEach((key) => {
            if(index < maxButtons){
                this.makeButton(key);
                index += 1;
            }
        });

        if(index >= maxButtons){
            this.makeLoadButton();
        }
    }

    makeButton(sectionName="404 error"){
        const newButton = document.createElement("button");

        newButton.innerHTML = `
            load projects in ${sectionName}
        `;

        console.log(newButton, this.databaseProjectButtonDropdown, this);
        this.sectionDropdown.appendChild(newButton);

        newButton.classList.add("nice-button", "main-font", "database-button");
        newButton.id = `${sectionName}-bring-button`;

        newButton.addEventListener("click", () => {
            const sectionOwner = window?.user?.uid || "OFFICIAL";
            this.loadCreateSection(sectionName, sectionOwner);
        });

        this.buttons != null ? this.buttons.push(newButton) : this.buttons = [];
    }

    makeLoadButton(){
        const newButton = document.createElement("button");
    }

    loadCreateSection(sectionName, sectionOwner){
        /*
        this.loadOptionsButton = this.querySelector("[data-js-tag='load-database-options']");
        this.loadOptionsButton.addEventListener("click", () => {
            this.timeSinceLastDone += timeSince("loaded-database", 60001);
            this.loadOptions();
        });*/
        this.section = sectionName;
        this.owner = sectionOwner;

        this.timeSinceLastDone += timeSince("loaded-database", 60001);
        this.loadOptions();
    }

    orderOptionsFromPriority(options){
        console.assert(options.length > 0);
        console.error("fix this soon");
        let orderedOptionsList = [];

        let findindex = (thisPriority, inList) => {
            if(inList.length === 0) { return 0; }
            if(thisPriority === null) { return 0; }

            thisPriority = parseInt(thisPriority, 10);

            let thisIndex = inList.length;
            inList.forEach(priority => {
                priority.priority = parseInt(priority.priority, 10);

                console.log(priority.priority, " is other < me is: ", thisPriority, priority.priority < thisPriority, thisIndex);
                let priorityValid = priority.priority !== "";
                let mineIsLesser = priority.priority < thisPriority
                let mineIsGreater = priority.priority > thisPriority;
                if(mineIsLesser && priorityValid){
                    //thisIndex += 1;
                } else if(mineIsGreater){
                    thisIndex -= 1;
                }
            });

            return thisIndex;
        }

        console.log(options);
        options.forEach(option => {
            //if the priority is highest, push
            console.log(option.title);
            let index = findindex(option.priority, orderedOptionsList);
            orderedOptionsList.splice(index, 0, option);
        });

        return orderedOptionsList;
    }

    async loadOptions(){
        if(typeof this.owner !== "string") { console.error(" owner not set: thou shalt set thine owner ");}
        if(typeof this.section !== "string") { console.error(" section not set: thou shalt set thine section ");}

        let canLoadOptions = (this.timeSinceLastDone > (60000 / this.maxAmmountPerMinute)) ? true : false;
        if(!canLoadOptions) {
            console.error("can't load, not enough time elapsed: ", this.timeSinceLastDone);
            return null;
        }

        console.log("this section is: _", this.section ,"_")
        this.projects = await findProjects({ owner: this.owner, section: this.section });
        console.log(this.projects, this.owner, this.section);
        this.projects = this.orderOptionsFromPriority(this.projects);
        this.timeSinceLastDone = 0;
        this.showButtons();
        this.changeSectionTextarea();
    }



    showButtons(){
        let databaseProjectButtonDropdown = this.databaseProjectButtonDropdown;
        let projectButtons = [];

        if(typeof this.projectButtons !== "undefined"){
            this.projectButtons.forEach((button) => {
                button.remove();
            });
        }
        
        this.projects.forEach((project) => {
            let buttonName = project.title.replaceAll(" ", "-").toLowerCase();
            let buttonClasses = "nice-button main-font database-button";
            
            let newButton = document.createElement("button");
            newButton.classList = buttonClasses;
            newButton.name = buttonName;
            newButton.innerHTML = project.title;

            databaseProjectButtonDropdown.appendChild(newButton);

            newButton.addEventListener("click", () => {
                this.createProject.loadDatabaseProject({
                    title: project.title, 
                    mission: project.mission, 
                    data: project.data, 
                    includeDisclude: project.includeDisclude,
                    hint: project.hint
                });
            });

            projectButtons.push(newButton);
        });

        this.projectButtons = projectButtons;
        applySettings();
    }

    changeSectionTextarea(){
        this.createParent.sectionElement.value = this.section;
    }
}

customElements.define("ttc-view-data-projects", TTCViewDataProjects);