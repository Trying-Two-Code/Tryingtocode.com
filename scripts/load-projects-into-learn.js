import { findProject, findProjects } from "./firebase-backend/firebaseProjects.js";

let projectIndex = 35;
window.TTC.events = window.TTC?.events || new EventTarget();

const loadJSON = async (section="projects") => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json[section];
};

window.TTC.loadProjectsFromDatabase = async ({section="default", owner="OFFICIAL"} = {}) => {
    let projects = await findProjects({ section : section, owner : owner }); ! 
    console.log(projects);
    console.assert(typeof projects === "object");

    console.trace();
    console.log(section, owner, projects);
    const projectKeys = Object.keys(projects);
    console.log("you need to order these by priority");
    for (let keyIndex = 0; keyIndex < projectKeys.length; keyIndex++) {
        const key = projectKeys[keyIndex];
        const project = projects[key];
        
        let reward = project?.reward || window.TTC.DEFAULT_REWARD;
        let hint = project?.hint || "";

        let projectJSON = {
            "code": project.data,
            "code-discludes": project.includeDisclude.codeDiscludes,
            "code-includes": project.includeDisclude.codeIncludes,
            "output-discludes": project.includeDisclude.outputDiscludes,
            "output-includes": project.includeDisclude.outputIncludes,
            "failure-shows": "",
            "hint": hint,
            "instruction": project.mission,
            "title": project.title
        };
        console.log(projectJSON);

        let newProject = {
            title: project.title,
            reward: reward,
            index: projectIndex,
            projectData: projectJSON
        };

        let sendProjectToLearn = new CustomEvent("createLearnProject", {detail: newProject});
        window.TTC.events.dispatchEvent(sendProjectToLearn);

        projectIndex++;
    }
    

    Prism.highlightAll();
    applySettings();
}


let language = window.TTC.language;
console.log(language);
let codeLanguage = window.TTC.codeLanguage;
console.log(codeLanguage, localStorage);

let getCodeLanguage = () => {
    const LANGUAGE_STRING = "code-language";

    let URLString = window.location.search;
    const searchURLString = new URLSearchParams(URLString);

    
    let isCodeLanguageInURL = searchURLString.has(LANGUAGE_STRING);
    let codeLanguageInURL = isCodeLanguageInURL ? searchURLString.get(LANGUAGE_STRING) : null;
    let currentCodeLanguage = codeLanguageInURL ?? "python";

    console.log(currentCodeLanguage);
    try{
        if(!codeLanguageInURL){
            //location.replace(`${URLString}?code-language=${currentCodeLanguage}`);

            //chatgpt: do not trust these 3 lines of code
            const url = new URL(window.location);
            url.searchParams.set(LANGUAGE_STRING, currentCodeLanguage);
            window.history.replaceState({}, "", url);
        }
    } catch (error) {
        console.error("location assigning ain't gonna work there buddy ol pal. Here is why: ", error);
    }

    return currentCodeLanguage;
}

language = getCodeLanguage();

let onlineSections = await loadJSON("online-sections");
console.log(onlineSections);

if(language in onlineSections) {
    let languageSections = onlineSections[language];
    let languageSectionsKeys = Object.keys(languageSections);
    for (let sectionIndex = 0; sectionIndex < languageSectionsKeys.length; sectionIndex++) {
        const key = languageSectionsKeys[sectionIndex];
        const section = languageSections[key];
        console.log(key);

        const owner = section.owner;
        const sectionName = section.section;
        console.log(owner, sectionName);

        // this is the function that adds it to the page, but it also takes up resources in firebase so don't go calling it 1000 times a second.
        //window.TTC.loadProjectsFromDatabase({ section: sectionName, owner: owner });
    }
} else{
    console.log(language, "not in", onlineSections);
    window.alert("your language ain't here bud! Try changing the ?code-language to =python");
}