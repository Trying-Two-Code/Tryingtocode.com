//for use in ALL HTML FILES
import { Collapsable } from "./collapse.js";
import { Display } from "./projects.js"


let d = new Display(document);
console.log(d);
let dropdown = new Collapsable(document.getElementById("dropdown-button"), Array.from(document.getElementsByClassName("dropdown")));


dropdown.parent.addEventListener('click', () =>{
    dropdown.toggle();
});