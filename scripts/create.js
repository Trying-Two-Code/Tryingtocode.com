import {setProject} from '../firebase.js';

let submitButton = document.getElementById("submit-button");
let title = document.getElementById("create-title");
let code = document.getElementById("create-code");

console.log("hello");

submitButton.addEventListener("click", () => {
    console.log("got create");
    console.log(title.value, code.value);
    setProject(title.value, code.value);
});