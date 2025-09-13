//for use in learn.html
import { Display } from "./projects.js";

const loadProjectJSON = async (index) => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json["projects"][index];
};

//let projectJSON = loadProjectJSON();
let parent = document.getElementById('project-parent');
let display;

loadProjectJSON("1").then(JSON => {
    display = new Display(document, parent, JSON);
});

