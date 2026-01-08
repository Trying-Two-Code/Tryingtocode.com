//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";
import { setUserDatapoint } from "../firebase.js";

console.log("learn is at least going");

let loadIndices = Array.from({length: 50}, (_, i) => [i + 1, "beginner-2"]);
const DEFAULT_REWARD = 5;

var projects = [];

//for debug purposes, a function to reset player stats
window.resetStats = () => {
    console.log("reseting stats")
    localStorage.setItem("projects", "{}");
    localStorage.removeItem("coin");
}

document.addEventListener("keydown", (event) => {
    if(!event.ctrlKey){ return;}
    if((event.key === 'q' || event.key === 'Q')){
        window.resetStats();
    }
});

function localStore(name, value, defaultValue=""){
    let currentValue = localStorage.getItem(name);

    let isBlank = value => {
        return value === '' || value === null || value === defaultValue || value === '{}';
    }

    if (isBlank(currentValue)){
        if(isBlank(value)){
            localStorage.setItem(name, defaultValue);
        } else{
            localStorage.setItem(name, value);
        }
    }

    return localStorage.getItem(name);
}

function setStat(name, priorityValue, otherValue, defaultValue=""){
    let setToValue; 

    let isBlank = value => {
        let blankValues = ["", null, defaultValue, "{}"];
        blankValues.forEach(element => {
            if(element === value){
                return true;
            }
        });
        return false;
    }

    let decidePriority = (priority, other) => {
        if(!isBlank(priority)){
            return priority;
        }
        if(!isBlank(other)){
            return other;
        }
        return null;
    }

    const priority = decidePriority(priorityValue, otherValue);
    if(priority === null){
        setToValue = defaultValue;
    } else{
        setToValue = priority;
    }
    
    localStorage.setItem(name, setToValue); //THIS IS THE FINAL DECISION
}

function setStats(names, priorityValues, otherValues, defaultValue=""){
    for (let index = 0; index < names.length; index++) {
        const name = names[index];
        const priorityValue = priorityValues[index];
        const otherValue = otherValues[index];
        setStat(name, priorityValue, otherValue, defaultValue);
    }
}

setStat("projects", '');
//setStat("section", sections[0]);

window.addEventListener("user_made", () => {
    const user = window.user;
    setStat("projects", user.projects || "{}");
    setUserDatapoint();
});

let toggleAboveProjects = (index, add) => {
    let aboveProjects = projects.slice(0, index - 1)
    aboveProjects.forEach(element => {
        if (add.shouldShow === true){
            element.hide();
        }else{
            element.minimize();
        }
    })
}

// Save or update a project
let saveProject = (this_proj) => {
    const [title, content] = this_proj.split(":");
    let rawProjects = localStorage.getItem("projects");
    console.log("rawProjects", rawProjects);
    let projects = JSON.parse(rawProjects || "{}");
    console.log("projects", projects);
    projects[title] = content;
    localStorage.setItem("projects", JSON.stringify(projects));
    if(user && projects !== "{}"){
        setUserDatapoint(null, null, null, projects);
    }
};


window.addEventListener('correctCode', (details) => {
    let title = window.currentDisplay.title.innerHTML;
    let code = window.currentDisplay.textarea.value;
    saveProject(title + ":" + code);
    console.log(details.detail.value);
});

let openProjectAtIndex = index => {
    if(projects[index]){
        toggleAboveProjects(index, {shouldShow: true});
        console.log(projects[index]);
        projects[index].toggleElements(true);
    }
}

//this allows the next project button to work
window.addEventListener('changeOpen', (details) => { //details requires relativeIndex (0 for no change), currentIndex (index of currently open project)
    let relativeIndex = details.detail.relativeIndex;
    let currentIndex = details.detail.index;
    let newIndex = relativeIndex + currentIndex - 1; //-1 because of indexs starting at 0 vs projects starting at 1

    console.log("CHANGE OPEN!", details, relativeIndex, currentIndex, newIndex);

    openProjectAtIndex(newIndex);
});

const loadJSON = async (section="projects") => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json[section];
};

/*let loadProject = async (this_project, defaultReward=DEFAULT_REWARD, section="projects", projectIndex=0) => {
    console.log("load");
    return loadProjectJSON(this_project, section).then(JSON => {
        const projectParent = document.getElementById('project-parent');
        var display = new Display(document, projectParent, JSON, projectIndex);

        projects.push(display);
        display.projectEl.addEventListener('toggleElements', (shouldShow) => {
            toggleAboveProjects(projectIndex, shouldShow.detail);
        });
        display.setupTextarea();
        let title = document.getElementById("main-content");
        let code = getProject(JSON.title);
        if(code){
            display.reward = 0;
            display.codeArea.createText(code);
            display.completedIcon.classList.remove("hide");
        } /*else if(mainProj){
            display.reward = defaultReward;
            mainProj = false;
            display.toggleElements(true);
            console.log("main is " + display.title.innerHTML);
        }/
        return display;
    });
}
*/

const PROJECT_PARENT = document.getElementById('project-parent');

let loadProject = (project, defualtReward=DEFAULT_REWARD, projectIndex=0, JSON) => {
    let display = new Display(document, PROJECT_PARENT, JSON, projectIndex);

    display.projectEl.addEventListener('toggleElements', (shouldShow) => {
        toggleAboveProjects(projectIndex, shouldShow.detail);
    });

    display.setupTextarea();

    //if(code) logic needs to be implemented

    return display;
}

let getMainProject = (projects) => {
    console.log(projects);
    for (const element in projects) {
        console.log(element);
        if(!(element.code)){
            return element;
        }
    }
    return null;
}

let loadProjectsFunction = async (projectsList, section="projects") => {
    const JSON = await loadJSON(section);
    let projectIndex = 0;
    let projectList = [];

    for (let item of projectsList){
        projectIndex++;
        console.log("JSON is this:", JSON[projectIndex]);
        let new_project = loadProject(item[0], DEFAULT_REWARD, projectIndex, JSON[projectIndex]);
        let proj_display = new_project;
        console.log(proj_display);
        projectList.push(new_project);
    }
    
    console.log("getting main...");
    const main_ = projectList[ getMainProject(projectList) ];
    console.log("main is ", main_, main_.index);
    main_.toggleElements(true);
}

loadProjectsFunction(loadIndices);
