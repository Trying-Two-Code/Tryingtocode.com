import { timeSince } from "../../tools.js";
import { findProjects } from "../../firebase-backend/firebaseProjects.js";

class TTCViewDataProjects extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){

        this.innerHTML = `
            <div class="main-font">
                <button class="nice-button main-font database-button" data-js-tag="load-database-options">load projects in section</button>
                <div name="database-project-dropdown" data-js-tag="database-project-dropdown">
                    <p></p>
                </div>
            </div>
        `;

        this.initValues();
        this.initButton();
    }

    initValues(){
        this.maxAmmountPerMinute = 20;
        this.timeSinceLastDone = 0;
        this.owner;
        this.databaseProjectButtonDropdown = this.querySelector("[data-js-tag='database-project-dropdown']"); 
        //rough fix \/
        this.createProject = this.parentElement;
    }

    initButton(){
        this.loadOptionsButton = this.querySelector("[data-js-tag='load-database-options']");
        this.loadOptionsButton.addEventListener("click", () => {
            this.timeSinceLastDone += timeSince("loaded-database", 60001);
            this.loadOptions();
        });
    }

    orderOptionsFromPriority(options){
        console.error("fix this soon");
        let orderedOptionsList = [];

        let findindex = (thisPriority, inList) => {
            if(inList.length === 0) { return 0; }
            if(thisPriority === null) { return 0; }

            thisPriority = parseInt(thisPriority, 10);

            let thisIndex = 0;
            inList.forEach(priority => {
                priority.priority = parseInt(priority.priority, 10);

                console.log(priority.priority, " is other < me is: ", thisPriority, priority.priority < thisPriority, thisIndex);
                if(priority.priority < thisPriority && priority.priority !== ""){
                    thisIndex += 1;
                } else if(priority.priority > thisPriority){
                    thisIndex -= 1;
                }
            });

            return thisIndex;
        }

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

        let canLoadOptions = (this.timeSinceLastDone > (60000 / this.maxAmmountPerMinute)) ? true : false;
        if(!canLoadOptions) {
            console.error("can't load, not enough time elapsed: ", this.timeSinceLastDone);
            return null;
        }

        this.projects = await findProjects({ owner: this.owner });
        this.projects = this.orderOptionsFromPriority(this.projects);
        this.timeSinceLastDone = 0;
        this.showButtons();
    }



    showButtons(){
        let databaseProjectButtonDropdown = this.databaseProjectButtonDropdown
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
                this.createProject.loadDatabaseProject(project.title, project.mission, project.data);
            });

            projectButtons.push(newButton);
        });

        this.projectButtons = projectButtons;
    }
}

customElements.define("ttc-view-data-projects", TTCViewDataProjects);