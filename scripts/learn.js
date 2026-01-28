//for use in learn.html
import { Display } from "./projects.js";
import "./coin.js";
import { setUserDatapoint, getUserData, setupProject, deleteUserData } from "../firebase.js";

const LOAD_INDICES = Array.from({length: 34}, (_, i) => [i + 1, "projects"]);
const DEFAULT_REWARD = 5;
const PROJECT_PARENT = document.getElementById('project-parent');

//for debug purposes, a function to reset player stats
window.resetStats = async () => {
    console.log("reseting stats")
    localStorage.setItem("projects", "{}");
    localStorage.setItem("coin", 0);
    await deleteUserData(window.user);
}

let isBlank = (value, extraBlank=undefined) => {
    let blankValues = ["", null, extraBlank, "{}"];
    blankValues.forEach(element => {
        if(element === value){
            return true;
        }
    });
    return false;
}

//RESET STATS DEBUG
document.addEventListener("keydown", (event) => {
    if(!event.ctrlKey){ return;}
    if((event.key === 'q' || event.key === 'Q')){
        window.resetStats().then(() => {
            window.location.reload();
        });
    }
});

function setStat(name, priorityValue, otherValue, defaultValue=""){
    let decidePriority = (priority, other) => {
        if(!isBlank(priority, defaultValue)){ return priority; }
        if(!isBlank(other, defaultValue))   { return other; }

        return defaultValue;
    }

    const priority = decidePriority(priorityValue, otherValue);

    localStorage.setItem(name, priority); //THIS IS THE FINAL DECISION
}

window.addEventListener("user_set", async () => {
    const user = window.user;
    setStat("projects", user.projects || "{}");
});

let goToTop = () => {
    console.error("FIX THIS, make it maintainable, and look at phone when it's sideways... bleck!");
    if(window.innerWidth < 600){
        window.scrollTo({top: 160, left: 0, behavior: "smooth"});
    } else{
        window.scrollTo({top: 10, left: 0, behavior: "smooth"});     
    }
}

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
    });
    goToTop();
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

    console.log("SAVING USER PROJECT", JSONprojects);
    if(user && JSONprojects !== "{}"){
        setUserDatapoint(null, null, null, JSONprojects);
    }
};

window.addEventListener('correctCode', (details) => {
    let title = window.currentDisplay.title.innerHTML;
    let code = window.currentDisplay.textarea.value;

    saveProject(title + ":" + code);

    console.log(details.detail.value);
});

let openProjectAtIndex = index => {
    if(projectDisplays[index]){
        toggleAboveProjects(index, {shouldShow: false});
        console.log(projectDisplays[index]);
        projectDisplays[index].toggleElements(true);
    }
}

//this allows the next project button to work
window.addEventListener('changeOpen', (details) => { //details requires relativeIndex (0 for no change), currentIndex (index of currently open project)
    let relativeIndex = details.detail.relativeIndex;
    let currentIndex = details.detail.index;
    let newIndex = relativeIndex + currentIndex - 1; //-1 because of indexs starting at 0 vs projects starting at 1

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

    return display;
}

let loadProjectsFunction = async (projectsList, section="projects") => {
    const JSON = await loadJSON(section);
    let userData = await getUserData();

    let projectIndex = 0;
    let projectList = [];

    for (let item of projectsList){
        projectIndex++;
        let new_project = loadProject(item[0], DEFAULT_REWARD, projectIndex, JSON[projectIndex], userData);
        let proj_display = new_project;
        projectList.push(new_project);
    }
    
    return projectList;
}

let projectDisplays;
loadProjectsFunction(LOAD_INDICES).then(projectsList => {
    projectDisplays = projectsList;

    let loaderElement = document.getElementById("loader");
    if (loaderElement != null){
        console.log(loaderElement);
        loaderElement.classList.add("loader-fade");
        loaderElement.classList.remove("loader");
    }

    Prism.highlightAll();
});


