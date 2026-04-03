//for use in learn.html
//connects resources needed in learn.html but shouldn't actually be doing very much!

import { Display } from "./projects.js";
import "./coin/coin.js";
import { setUserDatapoint, getUserData, setupProject, deleteUserData } from "./firebase-backend/firebase.js";
import './firebase-backend/firebaseProjects.js';
import './load-projects-into-learn.js';
import { applySettings, getSettingsObject } from "./settings-functions.js";

const LOAD_INDICES = Array.from({length: 33}, (_, i) => [i + 1, "projects"]);
const DEFAULT_REWARD = 5;
window.TTC.DEFAULT_REWARD = DEFAULT_REWARD;
const PROJECT_PARENT = document.getElementById('project-parent');

//for debug purposes, a function to reset player stats
window.resetStats = async () => {
    console.log("reseting stats")
    localStorage.setItem("projects", "{}");
    localStorage.setItem("coin", 0);n
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
    if((event.key === 'y' || event.key === 'Y')){
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

const doSomethingWithProject = (projects) => {
    console.log("here it is");

    projects.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
    }) ;

    console.log("projects = ", projects);
}

window.addEventListener("user_set", async () => {
    const user = window.user;
    setStat("projects", user.projects || "{}");

    //console.log(window.user.uid);
    /*findProject({section: "defualt", title: "default-1"}).then(() => 
        {
            doSomethingWithProject(resolve);
        }
    );*/
});

export let scrollToTop = () => {
    console.warn("FIX THIS, make it maintainable, and look at phone when it's sideways... bleck!");

    let defaultSetScroll = () => {
        if(window.innerWidth < 600){
            window.scrollTo({top: 160, left: 0, behavior: "smooth"});
        } else{
            window.scrollTo({top: 10, left: 0, behavior: "smooth"});     
        }
    }

    let scrollToCurrentDisplay = () => {
        window.currentDisplay.projectEl.scrollIntoView({behavior: "smooth", top: 0});
    }

    if(window?.currentDisplay != null){
        //window.currentDisplay.projectEl.scrollIntoView({ behavior: "smooth", top: 100 });
        //window.scrollTo({top: window.currentDisplay.projectEl.getBoundingClientRect().top, left: 0, behavior: "smooth"});
        window.requestAnimationFrame(scrollToCurrentDisplay);
        //scrollToCurrentDisplay();
    } else {
        //use default behaviour if need be
        defaultSetScroll();
    }
}
/*
let scroll = window.confirm("can we scroll to top?");
let prompt = window.prompt("say something...", "what");
if(scroll) {*/scrollToTop();

try {
    let backToTopButton = document.getElementById("main--back-to-top-button");
    backToTopButton.addEventListener("click", scrollToTop);
} catch (error) {
    console.log(error);
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
        console.log("save this new project here :", JSONprojects);
        setUserDatapoint(null, null, null, JSONprojects);
    }
};

window.addEventListener('correctCode', (details) => {
    let title = window.currentDisplay.title.innerHTML;
    let code = window.currentDisplay.textarea.value;

    saveProject(title + ":" + code);

    console.log(details.detail.value);
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

let loadProject = (project, defualtReward=DEFAULT_REWARD, projectIndex=0, JSON, userData=null, lastDisplayNumber=0) => {
    let display = new Display(document, PROJECT_PARENT, JSON, projectIndex);
    setupProject(display, display.title.innerHTML);

    return display;
}

let projectIndex = 0;

let loadProjectsFunction = async (projectsList, section="projects") => {
    const JSON = await loadJSON(section);
    let userData = await getUserData();

    let projectList = [];

    for (let item of projectsList){
        let new_project = loadProject(item[0], DEFAULT_REWARD, projectIndex, JSON[projectIndex + 1], userData, projectList.length);
        let proj_display = new_project;
        projectList.push(new_project);
        projectIndex++;
    }
    
    return projectList;
}

let projectDisplays;
const loaderElement = document.getElementById("loader");
loadProjectsFunction(LOAD_INDICES).then(projectsList => {
    projectDisplays = projectsList;

    if (loaderElement != null){
        console.log(loaderElement);
        loaderElement.classList.add("loader-fade");
        loaderElement.classList.remove("loader");
    }

    Prism.highlightAll();
    applySettings();
});

window.TTC.events.addEventListener("createLearnProject", (details) => {
    let data = details.detail;
    let title = data.title;
    let reward = data.reward;
    let index = data.index;
    let projectData = data.projectData;

    let newProject = loadProject(
        title,
        reward, 
        index, 
        projectData
    );

    console.log(newProject);
})


console.error("for all yall devs out there looking through the log and thinking to yourself: what is this? why is this? this hurts my head! why do you have so many logs in production?");
console.error("it's allllll good I'll fix it later 👍");
console.error("and if you're just a user in here, bro, get off. Someone prolly trying to scam you or smth");
console.error("thanks for coming over and trying my website out btw");