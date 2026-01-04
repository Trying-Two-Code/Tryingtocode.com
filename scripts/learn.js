//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";
import { setUserDatapoint } from "../firebase.js";
import { updateSettings } from "./settings.js";

console.log("learn is at least going");

let loadProjects = Array.from({length: 50}, (_, i) => [i + 1, "beginner-2"]);
const DEFAULTREWARD = 5;

let parent = document.getElementById('project-parent');
var projects = [];
let mainProj = true;

//for debug purposes, a function to reset player stats
window.resetStats = () => {
    localStorage.setItem("projects", "{}");
    localStorage.removeItem("coin");
}

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
    let projects = JSON.parse(rawProjects || "{}");
    projects[title] = content;
    localStorage.setItem("projects", JSON.stringify(projects));
    if(user && projects !== "{}"){
        setUserDatapoint(null, null, null, rawProjects);
    }
};

let getProject = (title) => {
    const projects = JSON.parse(localStorage.getItem("projects") || "{}");
    return projects[title] || null;
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

const loadProjectJSON = async (index, section="projects") => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json[section][index];
};

let loadProject = (this_project, defaultReward=DEFAULTREWARD, section="projects", projectIndex=0) => {
    loadProjectJSON(this_project, section).then(JSON => {
        const display = new Display(document, parent, JSON, projectIndex);
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
        } else if(mainProj){
            display.reward = defaultReward;
            mainProj = false;
            display.toggleElements(true);
            console.log("main is " + display.title.innerHTML);
        }
    });
}

let loadProjectsFunction = (projectsList) => {
    let projectIndex = 0;
    for (let item of projectsList){
        projectIndex++;
        loadProject(item[0], DEFAULTREWARD, item[1], projectIndex);
    }
}

loadProjectsFunction(loadProjects)
