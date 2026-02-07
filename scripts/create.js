import { setProject } from './firebase-backend/firebaseProjects.js';
import { SimpleToggle } from './tools.js';





window.addEventListener('create_project_set', () => {
    let submitButton =      document.getElementById("submit-button");
    let title =             document.getElementById("create-title");
    let code =              document.getElementById("create-code");
    let output =            document.getElementById("create-output");
    let languageSelector =  document.getElementById("user-create-project--language-select");
    let toggleElement =     document.getElementById("user-create-project--advanced-toggle");
    let toggledElements =   document.querySelectorAll(".user-create-project--toggled-element");

    let submitEvent = () => {
        console.log(languageSelector.value);
        let chosenLanguage = languageSelector.options[languageSelector.selectedIndex].text;
        console.log(chosenLanguage);

        console.log("got create");
        console.log(title.value, code.value);

        let projectOutput = setProject({ title: title.value, data: code.value, language: chosenLanguage });
        output.value = projectOutput;
    }

    submitButton.addEventListener("click", submitEvent);

    let toggleAdvancedElements = new SimpleToggle(toggleElement, toggledElements, ["../components/art/advanced settings - 2.png", "../components/art/advanced settings - 1.png"]);
    toggleElement.addEventListener("click", () => {toggleAdvancedElements.toggle();});

}
);