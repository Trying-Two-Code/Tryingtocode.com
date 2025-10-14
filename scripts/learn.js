//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";

if (localStorage.getItem("projects") == '') {localStorage.setItem("projects", "{}")}

let loadProjects = Array.from({length: 21}, (_, i) => i + 1);

let toggleAboveProjects = (index, add) => {
    projects.slice(0, index - 1).forEach(element => {
        if (add.shouldShow == true){
            element.editClass("gone", true);
            element.editClass("notminimized", false);
            element.editClass("minimized", true);
        }else{
            element.editClass("gone", false);
        }
    })
}

// Save or update a project
let saveProject = (this_proj) => {
    const [title, content] = this_proj.split(":");
    let projects = JSON.parse(localStorage.getItem("projects") || "{}");
    projects[title] = content;
    localStorage.setItem("projects", JSON.stringify(projects));
};

let getProject = (title) => {
    const projects = JSON.parse(localStorage.getItem("projects") || "{}");
    return projects[title] || null;
};

window.addEventListener('correctCode', (details) => {
    let title = window.currentDisplay.title.innerHTML;
    let code = window.currentDisplay.textarea.value;
    saveProject(title + ":" + code);
    console.log(details.detail.value)
})

const loadProjectJSON = async (index) => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json["projects"][index];
};

let parent = document.getElementById('project-parent');
let projects = [];
let display;

let mainProj = true;
function loadProject(this_project){
    loadProjectJSON(this_project).then(JSON => {
        display = new Display(document, parent, JSON);
        projects.push(display);
        display.projectEl.addEventListener('toggleElements', (shouldShow) => {
            toggleAboveProjects(this_project, shouldShow.detail);
        })
        display.setupTextarea();
        let title = document.getElementById("main-content")
        let code = getProject(JSON.title);
        if(code){
            display.reward = 0;
            display.codeArea.createText(code);
        } else if(mainProj){
            display.reward = 5;
            mainProj = false;
            display.toggleElements(true);
            console.log("main is " + display.title.innerHTML)
        }
    });
}

loadProjects.forEach(index => {
    loadProject(index);
});