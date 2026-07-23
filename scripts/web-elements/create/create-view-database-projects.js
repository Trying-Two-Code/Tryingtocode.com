import { timeSince, deleteCreateUserinputSection } from "../../tools.js";
import { deleteSection, findProjects } from "../../firebase-backend/firebaseProjects.js";
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
        this.maxAmmountPerMinute = 60;
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
        this.changeButtonsBy = 3;
        this.maxButtons = 3;

        let sortSections = () => {
            let sectionEntries = Object.entries(this.sections);
            
            sectionEntries.sort((a, b) => a[1] - b[1]);

            return sectionEntries
        }

        let entries = sortSections();
        this.sectionKeys = entries.map(entry => entry[0]);

        /*let index = 0;

        sectionKeys.forEach((key) => {
            if(index < maxButtons){
                this.makeButton(key);
                index += 1;
            }
        });

        if(index >= maxButtons){
            this.makeLoadButton();
        }*/
        this.greatestIndex = 0;

        this.makeAll(0, this.maxButtons, () => {this.makeLoadButton();});
    }

    makeAll(before, after, callback){
        console.log(before, after, this.sectionKeys);
        let index = 0;

        this.sectionKeys.forEach((key) => {
            console.log(index < after, index >= before, index);
            if(index < after && index >= before){
                this.makeButton(key);
                this.greatestIndex += 1;
            }
            index += 1;
        });

        console.log(this.greatestIndex, this.sectionKeys.length);
        if(this.greatestIndex < this.sectionKeys.length){
            callback();
        }

        applySettings();
    }

    makeButton(sectionName="404 error"){
        const newButton = document.createElement("button");

        newButton.innerHTML = `
            <button class="nice-button no-bg-button"><img src="./components/visuals/icons/create/load/${window.TTC.theme}${window.TTC.imageExtension}"></img></button>
            load: ${sectionName}
            <button class="nice-button no-bg-button" data-js-tag="delete-section"><img src="./components/visuals/icons/create/trash/${window.TTC.theme}${window.TTC.imageExtension}"></img></button>
        `;

        let deleteSection = newButton.querySelector("[data-js-tag='delete-section']");

        deleteSection.addEventListener("click", async (event) => {
            const sectionOwner = window?.user?.uid || "OFFICIAL";
            event.stopPropagation();
            console.log("yep");
            let resultOfDeletion = await this.deleteSection(sectionName, sectionOwner);
            console.log("result: ", resultOfDeletion);
            if(resultOfDeletion){
                newButton.remove();
                deleteCreateUserinputSection(sectionName);
            }
        });

        this.sectionDropdown.appendChild(newButton);

        newButton.classList.add("nice-button", "main-font", "database-button");
        newButton.id = `${sectionName}-bring-button`;
        

        newButton.addEventListener("click", (event) => {
            const sectionOwner = window?.user?.uid || "OFFICIAL";
            newButton.classList.add("blink");
            setTimeout(()=>{newButton.classList.remove("blink");}, 1000);
            this.loadCreateSection(sectionName, sectionOwner, newButton);
        });

        this.buttons != null ? this.buttons.push(newButton) : this.buttons = [];
    }

    makeLoadButton(){
        console.log("make it...");
        const newButton = document.createElement("button");
        newButton.innerHTML = `
            ...
        `;

        console.log(this, this?.sectionDropdown);

        this.sectionDropdown.appendChild(newButton);
        newButton.classList.add("nice-button", "main-font", "database-button");

        newButton.addEventListener("click", () => {
            this.makeAll(this.maxButtons, this.maxButtons + this.changeButtonsBy, () => {this.makeLoadButton();});
            this.maxButtons += this.changeButtonsBy;
            newButton.remove();
        });
    }

    async loadCreateSection(sectionName, sectionOwner, blinkButton){
        /*
        this.loadOptionsButton = this.querySelector("[data-js-tag='load-database-options']");
        this.loadOptionsButton.addEventListener("click", () => {
            this.timeSinceLastDone += timeSince("loaded-database", 60001);
            this.loadOptions();
        });*/
        this.section = sectionName;
        this.owner = sectionOwner;

        this.timeSinceLastDone += timeSince("loaded-database", 60001);
        let result = await this.loadOptions();
        
        if(result){
            blinkButton.classList.add("blink-green");
            setTimeout(()=>{blinkButton.classList.remove("blink-green");}, 1000);
        }
    }

    async deleteSection(sectionName, ownerName, overrideUser=false){
        let shouldDelete = overrideUser || confirm(`are you sure you want to delete ${sectionName}?`);
        if(!shouldDelete){
            return false;
        }

        return await deleteSection({
            sectionName: sectionName,
            ownerName: ownerName,
        });
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

        return true;
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