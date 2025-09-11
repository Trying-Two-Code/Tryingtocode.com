//for use in learn.html
import { Display } from "./projects.js";

const loadProjectJSON = async () => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json[0];
};

//let projectJSON = loadProjectJSON();
let parent = document.getElementById('project-parent');
const display = new Display(document, parent);

//loadProjectJSON().then(project => {
//    const display = new Display(document, document.body, project);
//});

