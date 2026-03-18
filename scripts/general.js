//for use in ALL HTML FILES
//import { SimpleToggle } from "./tools.js";
//import { Toggle } from "./tools.js";
//import "./init-settings.js"

/*let dropdown = new Collapsable( document.getElementById("dropdown-button"), 
                                Array.from(document.getElementsByClassName("dropdown")), 
                                ['components/art/yellow - toggle arrow down.png', 
                                    'components/art/yellow - toggle arrow up.png']
                                );
*/

let loading = document.querySelector(".loader-sprite");
if(typeof loading !== "undefined" && loading != null){
    loading.style.setProperty("--theme", `url("../components/visuals/icons/load-animation/${window.theme}.png")`);
}

/*let dropdownButton = document.getElementById("dropdown-button");
let dropdownElements = Array.from(document.getElementsByClassName("dropdown"));
let art = ['components/art/yellow - toggle arrow down.png', 
           'components/art/yellow - toggle arrow up.png'];

let dropdown = new Toggle(dropdownButton, dropdownElements, "hide");

let parentImage = dropdownButton.querySelector('img')

let parentFunction = () => {
    let frame = dropdown.isOff(dropdown.effectedElements[0]) ? 1 : 0;
    parentImage.src = art[frame];
}

dropdown.addEvent(parentFunction);
*/