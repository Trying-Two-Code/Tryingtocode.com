//for use in ALL HTML FILES

console.log("general");

import { Collapsable } from "collapse.js";


let dropdown = new Collapsable(document.getElementById("dropdown-button"), Array.from(document.getElementsByClassName("dropdown")));

dropdown.parent.addEventListener('click', () =>{
    dropdown.toggle();
});