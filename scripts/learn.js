//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";
import { setUserDatapoint, getUserData, setupProject, deleteUserData } from "../firebase.js";

let loadIndices = Array.from({length: 50}, (_, i) => [i + 1, "projects"]);
const DEFAULT_REWARD = 5;

const PROJECT_PARENT = document.getElementById('project-parent');

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

const resetButton = document.getElementById('reset-all');
resetButton.addEventListener('click', async () => {
    await deleteUserData(window.user);
    window.resetStats();
    window.location.reload();
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
    console.log("toggle above projects: ", index, add);
    let aboveProjects = projectDisplays.slice(0, index - 1)
    aboveProjects.forEach(element => {
        console.log("hide");
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
    let JSONprojects = JSON.parse(rawProjects || "{}");
    console.log("projects", JSONprojects);
    JSONprojects[title] = content;
    localStorage.setItem("projects", JSON.stringify(JSONprojects));
    if(user && JSONprojects !== "{}"){
        setUserDatapoint(null, null, null, JSONprojects);
    }
};

let getProjects = (title) => {
    let rawProjects = localStore.getItem("projects");
}


window.addEventListener('correctCode', (details) => {
    let title = window.currentDisplay.title.innerHTML;
    let code = window.currentDisplay.textarea.value;
    saveProject(title + ":" + code);
    console.log(details.detail.value);
});

let openProjectAtIndex = index => {
    console.log(projectDisplays[index]);
    console.log("open at index", index, projectDisplays, projectDisplays[index]);
    if(projectDisplays[index]){
        toggleAboveProjects(index, {shouldShow: false});
        console.log(projectDisplays[index]);
        projectDisplays[index].toggleElements(true);
    }
}


//this allows the next project button to work
window.addEventListener('changeOpen', (details) => { //details requires relativeIndex (0 for no change), currentIndex (index of currently open project)
    console.log("change open!!!!!!!");
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

let checkCompletion = (title, userData=null) => {
    if(window.user != null) {
        console.log(window.user.projects);
    } else if(userData !== null){
        console.log(userData);
    }
}

let loadProject = (project, defualtReward=DEFAULT_REWARD, projectIndex=0, JSON, userData) => {

    let display = new Display(document, PROJECT_PARENT, JSON, projectIndex);
    setupProject(display, display.title.innerHTML);

    display.projectEl.addEventListener('toggleElements', (shouldShow) => {
        toggleAboveProjects(projectIndex, shouldShow.detail);
    });

    display.setupTextarea();

    //if(code) logic needs to be implemented|
    
    let code = checkCompletion(JSON.title, userData);
    if(code){
        display.reward = 0;
        display.codeArea.createText(code);
        display.completedIcon.classList.remove("hide");
    } /*else if(mainProj){
        display.reward = DEFAULT_REWARD;
        mainProj = false;
        display.toggleElements(true);
        console.log("main is " + display.title.innerHTML);
    }*/

    return display;
}

let getMainProject = (projects) => {
    for (const element in projects) {
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
    let userData = await getUserData();

    for (let item of projectsList){
        projectIndex++;
        let new_project = loadProject(item[0], DEFAULT_REWARD, projectIndex, JSON[projectIndex], userData);
        let proj_display = new_project;
        projectList.push(new_project);
    }
    
    return projectList;
}

let projectDisplays;
loadProjectsFunction(loadIndices).then(projectsList => {
    projectDisplays = projectsList;
});

