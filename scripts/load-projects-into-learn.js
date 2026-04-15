import { findProject, findProjects } from "./firebase-backend/firebaseProjects.js";
import { getSettingsObject } from "./settings-functions.js";
import { timeSince } from "./tools.js";

let projectIndex = 35;
window.TTC.events = window.TTC?.events || new EventTarget();

const loadJSON = async (section="projects") => {
    const response = await fetch('../python-projects.json');
    const json = await response.json();
    return json[section];
};

window.TTC.loadProjectsFromDatabase = async ({section="default", owner="OFFICIAL"} = {}) => {
    let projects = await findProjects({ section : section, owner : owner });
    console.assert(typeof projects === "object");

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
let codeLanguage = window.TTC.codeLanguage;

let getCodeLanguage = () => {
    const LANGUAGE_STRING = "code-language";

    let URLString = window.location.search;
    const searchURLString = new URLSearchParams(URLString);

    let isCodeLanguageInURL = searchURLString.has(LANGUAGE_STRING);
    let codeLanguageInURL = isCodeLanguageInURL ? searchURLString.get(LANGUAGE_STRING) : null;
    let currentCodeLanguage = codeLanguageInURL ?? "python";

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

const settingsObject = getSettingsObject();
let userDecidedSection = settingsObject.learnSection;
console.log(settingsObject.learnSection, "OFFICIAL");

let onlineSections = await loadJSON("online-sections");

let projectList = onlineSections[language][userDecidedSection];
let findSection = () => {
    if(!projectList){
        let checkSectionNames = (language, forName) => {
            let languageSpecificSections = onlineSections[language];
            let sectionKeys = Object.keys(languageSpecificSections);

            for (let index = 0; index < sectionKeys.length; index++) {
                const key = sectionKeys[index];
                const proj = onlineSections[language][key];

                if(proj.section == forName){ return [proj, forName]; } 
            }
        };

        let proj0Key1 = checkSectionNames(language, userDecidedSection);
        if(proj0Key1 == null){return null;}
        projectList = proj0Key1[0];
        if(projectList){
            console.log('%c It would be best to store numbers, but this does work technically ', 'background: #ff000056; color: #ffa167', proj0Key1[1], projectList);
            userDecidedSection = proj0Key1[1];
            return true;
        } else{
            console.error(projectList, " ain't nothin! Lookee here: ", language, userDecidedSection, onlineSections);
            return null;
        }
    }
    return true;
};

let sendSection = (owner, section) => {
    window.TTC.loadProjectsFromDatabase({ section: section, owner: owner });
};

let sendAppropriateInformationForSectionAndOwner = () => {
    let timeSinceLastCalled = timeSince("sendAppropriateInformationForSectionAndOwner", 10000);
    if(timeSinceLastCalled < 10000) {return;}
    const owner = "OFFICIAL";
    if(findSection()){
        console.assert(projectList != null);
        const section = userDecidedSection;
        sendSection(owner, section);
    } else{
        console.log("show user a section", window.TTC.events);
        window.TTC.events
    }
};

window.addEventListener("user_set", sendAppropriateInformationForSectionAndOwner);

/*
if(language in onlineSections) {
    let languageSections = onlineSections[language];
    let languageSectionsKeys = Object.keys(languageSections);
    for (let sectionIndex = 0; sectionIndex < languageSectionsKeys.length; sectionIndex++) {
        const key = languageSectionsKeys[sectionIndex];
        const section = languageSections[key];

        const owner = section.owner;
        const sectionName = section.section;

        // this is the function that adds it to the page, but it also takes up resources in firebase so don't go calling it 1000 times a second.
        //window.TTC.loadProjectsFromDatabase({ section: sectionName, owner: owner });
    }
} else{
    console.log(language, "not in", onlineSections);
    //window.alert("your language ain't here bud! Try changing the ?code-language to =python");
}*/