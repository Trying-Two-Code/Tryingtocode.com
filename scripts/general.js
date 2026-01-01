//for use in ALL HTML FILES
import { Collapsable } from "./tools.js";


let dropdown = new Collapsable( document.getElementById("dropdown-button"), 
                                Array.from(document.getElementsByClassName("dropdown")), 
                                ['components/art/yellow - toggle arrow down.png', 
                                    'components/art/yellow - toggle arrow up.png']
                                );

dropdown.parent.addEventListener('click', () =>{
    dropdown.toggle();
});