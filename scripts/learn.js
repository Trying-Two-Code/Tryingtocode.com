//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";
import { setUserDatapoint } from "../firebase.js";

let loadProjects = Array.from({length: 50}, (_, i) => [i + 1, "beginner-2"]);
const DEFAULTREWARD = 5;

let parent = document.getElementById('project-parent');
let projects = [];
let mainProj = true;

//for debug purposes, a function to reset player stats
window.resetStats = () => {
    localStorage.setItem("projects", "{}");
    localStorage.removeItem("coin");
}

function localStore(name, value, defaultValue=""){
    let currentValue = localStorage.getItem(name);

    let isNaught = value => {
        return value === '' || value === null || value === defaultValue || value === '{}';
    }

    if (isNaught(currentValue)){
        if(isNaught(value)){
            localStorage.setItem(name, defaultValue);
        } else{
            localStorage.setItem(name, value);
        }
    }

    return localStorage.getItem(name);
}

localStore("projects", '');
//localStore("section", sections[0]);

window.addEventListener("user_made", () => {
    const user = window.user;
    localStore("projects", user.projects || "{}");
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

window.addEventListener('changeOpen', (details) => {
    let currentProject = window.currentDisplay;
    //let nextProject = 
});

const loadProjectJSON = async (index, section="projects") => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json[section][index];
};

let loadProject = (this_project, defaultReward=DEFAULTREWARD, section="projects", projectIndex=0) => {
    loadProjectJSON(this_project, section).then(JSON => {
        const display = new Display(document, parent, JSON);
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
