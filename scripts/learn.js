//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";

let learnProjects = localStorage.getItem("projects") || "";
localStorage.setItem("learnProjects", learnProjects);


let loadProjects = Array.from({length: 21}, (_, i) => i + 1);
let finishedProjects = localStorage.getItem("finished") || "";
localStorage.setItem("finished", finishedProjects);

let toggleAboveProjects = (index, add) => {
    console.log(projects.slice(0, index - 1));
    projects.slice(0, index - 1).forEach(element => {
        if (add == true){
            element.projectEl.classList.add("gone");
        }else{
            element.projectEl.classList.remove("gone");
        }
    })
}

const loadProjectJSON = async (index) => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json["projects"][index];
};

let parent = document.getElementById('project-parent');
let projects = [];
let display;

function loadProject(this_project){
    loadProjectJSON(this_project).then(JSON => {
        display = new Display(document, parent, JSON);
        projects.push(display);
        display.projectEl.addEventListener('toggleElements', () => {
            let shouldShow = display.projectEl.classList.contains('gone')
            toggleAboveProjects(this_project, shouldShow);
        })
        display.setupTextarea();
        let title = document.getElementById("main-content")
    });
}

loadProjects.forEach(index => {
    loadProject(index);
});