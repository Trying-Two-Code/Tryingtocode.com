//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";

let learnProjects = localStorage.getItem("projects") || "";
localStorage.setItem("projects", learnProjects);


let loadProjects = Array.from({length: 21}, (_, i) => i + 1);
let finishedProjects = localStorage.getItem("finished") || "";
localStorage.setItem("finished", finishedProjects);

let toggleAboveProjects = (index, add) => {
    console.log(projects.slice(0, index - 1));
    console.log(add.shouldShow)
    projects.slice(0, index - 1).forEach(element => {
        if (add.shouldShow == true){
            console.log("it is adding it");
            element.projectEl.classList.add("gone");
            element.projectEl.classList.remove("notminimized");
            element.projectEl.classList.add("minimized");
        }else{
            console.log("it is subtracting it");
            element.projectEl.classList.remove("gone");
        }
    })
}

let saveProject = (this_proj) => {
    let current = localStorage.getItem("projects") || this_proj
    let project_list = current.split(";");
    let x = 0;
    let new_val = "";
    project_list.forEach(value => {
        let value_list = value.split(":");
        let this_proj_list = value.split(":")
        x++;
        if (value_list[0] == this_proj_list[0]){
            value_list[1] = this_proj_list[1];
        }
        new_val += value_list.join(":") + ";";
    });
    localStorage.setItem("projects", new_val);
};

let getProject = (title) => {
    let current = localStorage.getItem("projects") || ""
    if(current == ""){
        return null
    } 
    else{
        let project_list = current.split(";");
        project_list.forEach(value => {
            let value_list = value.split(":");
            if(value_list[0] == title){
                return value;
            }
        });
    }
    return null
};

saveProject("helloworld:print('hello')");
saveProject("helloworld2:print('hello2')");
let proj = getProject("helloworld");
console.log(proj);

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
        display.projectEl.addEventListener('toggleElements', (shouldShow) => {
            console.log("This is shouldShow: ")
            console.log(shouldShow.detail.shouldShow)
            toggleAboveProjects(this_project, shouldShow.detail);
        })
        display.setupTextarea();
        let title = document.getElementById("main-content")
    });
}



loadProjects.forEach(index => {
    loadProject(index);
});