//for use in ALL HTML FILES
//import { SimpleToggle } from "./tools.js";
//import { Toggle } from "./tools.js";
//import "./init-settings.js"

import { getUserData, setUserDatapointWithObject } from "./firebase-backend/firebase.js";
import { getAndSetData, getBought } from "./get-bought.js";
import { getSetting, setLightMode } from "./settings-functions.js";

/*let dropdown = new Collapsable( document.getElementById("dropdown-button"), 
                                Array.from(document.getElementsByClassName("dropdown")), 
                                ['components/art/yellow - toggle arrow down.png', 
                                    'components/art/yellow - toggle arrow up.png']
                                );
*/

let loading = document.querySelector(".loader-sprite");
if(typeof loading !== "undefined" && loading != null){
    loading.style.setProperty("--theme", `url("../components/visuals/icons/load-animation/${window.TTC.theme}.png")`);
}

window.addEventListener("user_set", async () => {

    let brightModeAllowed = await getBought("allowBrightMode", false);
    console.log(window.TTC.colorTheme, getSetting("colorTheme"));
    console.log("this is being set right away!");
    if(brightModeAllowed && window.TTC.colorTheme == "light" || getSetting("colorTheme") == "light"){
        setLightMode();
    }

    brightModeAllowed = await getBought("allowBrightMode");
    let allowFancyFont = await getBought("allowFancyFont", false);
    let doubleCoin = await getBought("doubleCoin", false);
    if(doubleCoin){
        detectDoubleCoinExpires();
    }
    console.log("setting window ttc", doubleCoin, getUserData());
    window.TTC.doubleCoin = doubleCoin;
});

let detectDoubleCoinExpires = async () => {
    let data = await getAndSetData();
        console.log(data.bought.doubleCoin, Date.now(), data, data.bought.doubleCoin < Date.now());
    if(data.bought.doubleCoin < Date.now()){
        console.log("it should be deleting it rn bro.");
        delete data.bought.doubleCoin;
        setUserDatapointWithObject({bought: data.bought, prioritizePayload: true});
        getAndSetData();
    }
    return data;
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


//setInterval(matchScrolls, 100);