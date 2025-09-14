//for use in learn.html
import { Display } from "./projects.js";

let loadProjects = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
"21", "22"];

const loadProjectJSON = async (index) => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json["projects"][index];
};

//let projectJSON = loadProjectJSON();
let parent = document.getElementById('project-parent');
let display;

function loadProject(this_project){
    loadProjectJSON(this_project).then(JSON => {
        display = new Display(document, parent, JSON);
    });
}

loadProjects.forEach(index => {
    loadProject(index);
});


