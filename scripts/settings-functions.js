console.log("readddy for settings rider sir");

const localStorageSettingsString = "user_settings";

const DEFAULT_SETTINGS = {
    "font": "pixel1",
};

    console.error("change element here:");
try{
    const TTC_SETTINGS_ELEMENT = document.querySelector("[js-data-tag='settings-holder']").parentElement;
    const FONT_TO_ELEMENT = {
        "pixel1": TTC_SETTINGS_ELEMENT
    };
} catch {
    console.log("Insuffecient elements. You are likely in a non settings page.");
    console.log("If you are in a settings page, please contact@tryingtocode.com");
}


//FIX THIS LATER!
let playerSettings = {
    "font": "main-font"
};
//Should be, storing settings with firebase or something

export let changeSetting = (setting, value) => {
    Object.keys(playerSettings).forEach(playerSetting => {
        if(playerSetting == setting){
            playerSettings[setting] = value;
        }
    })
}

export let fontChange = (toFont) => {
    console.log(toFont);
    editSetting({ font: toFont });
    /*
    document.querySelectorAll('*').forEach(element => {
        if(toFont == "pixel1"){
            element.classList.toggle("main-font", true);
            element.classList.toggle("pixel-alt", false);
        }
        if(toFont == "arial1"){
            element.classList.toggle("main-font", false);
            element.classList.toggle("pixel-alt", true);
        }

    });
    */
}


export let getSettingsObject = () => {
    let storedSettings = localStorage.getItem(localStorageSettingsString);
    let storedSettingsObject = JSON.parse(storedSettings);
    return storedSettingsObject;
}

let initSettingsObject = () => {
    let settingsObject = getSettingsObject();
    if(settingsObject == null){
        localStorage.setItem(localStorageSettingsString, JSON.stringify(DEFAULT_SETTINGS));
    }
}

initSettingsObject();

export let editSetting = (newSettings = { /* supported settings: font, theme */ }) => {
    let settingsObject = getSettingsObject();
    console.log(newSettings, settingsObject);
    Object.keys(newSettings).forEach(newSettingsKey => {
        settingsObject[newSettingsKey] = newSettings[newSettingsKey];
    });
    let settingsObjectString = JSON.stringify(settingsObject);
    localStorage.setItem(localStorageSettingsString, settingsObjectString);

    applySettings();
}

export let setDefault = (key) => {
    //editSetting( { [key]: DEFAULT_SETTINGS[key] } );
}

export let applySettings = () => {
    let settingsObject = getSettingsObject();
    let fontOptions = {
        "pixel1": "pixel-1",
        "arial1": "arial-1",
        "monospace1": "monospace-1"
    }

    let applyFont = () => {
        let fontElements = document.getElementsByClassName("main-font");
        fontElements = Array.from(fontElements);
        //document.querySelectorAll('*').forEach(element => {
        fontElements.forEach(element => {
            if(!element.classList.contains("main-font")){ return; }

            let oneFontSelected = false;
            let fontKeys = Object.keys(fontOptions);

            let setFont = (fontValue, toggle) => {
                element.classList.toggle(fontValue, toggle);
                if(toggle) { oneFontSelected = true; }
            }

            for (let fontIndex = 0; fontIndex < fontKeys.length; fontIndex++) {
                let fontKey = fontKeys[fontIndex];
                let fontValue = fontOptions[fontKey];

                let isKey = settingsObject["font"] == fontValue;
                if (isKey){
                    setFont(fontValue, true);
                }
                else{
                    setFont(fontValue, false);
                }
            }
            
            if(!oneFontSelected) {
                setDefault("font");
            }

            element.classList.toggle("pixel-1", settingsObject["font"] == "pixel1");
            element.classList.toggle("arial-1", settingsObject["font"] == "arial1");
            element.classList.toggle("monospace-1", settingsObject["font"] == "monospace1");
        });
    }

    applyFont();
}

console.log("settings initialised.");
requestAnimationFrame(applySettings);
window.applySettings = () => { applySettings(); };

/*var isPixel = true;
export let updateSettings = (document) => {
    isPixel = !isPixel;
    document.querySelectorAll('*').forEach(element => {
        element.classList.toggle("main-font", isPixel);
        element.classList.toggle("pixel-alt", !isPixel);
    });
}*/

//make below \/\/

/**
export let updateSettings = (setting) =>

let updateSettingsButton = document.getElementById("change-setting");
let filledSettings = () => {updateSettings(playerSettings[0]);}
updateSettingsButton.addEventListener("click", filledSettings);
 */

