const localStorageSettingsString = "user_settings";

const DEFAULT_SETTINGS = {
    "font": "pixel1",
    "xp": "0",
    "theme": "pixel-1"
};

try{
    const TTC_SETTINGS_ELEMENT = document.querySelector("[js-data-tag='settings-holder']").parentElement;
    const FONT_TO_ELEMENT = {
        "pixel1": TTC_SETTINGS_ELEMENT
    };
} catch {
    console.error("Insuffecient elements. You are likely in a non settings page.");
    console.error("If you are in a settings page, please contact@tryingtocode.com");
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

export let themeChange = (toTheme) => {
    editSetting({ theme: toTheme });
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

export let editSetting = (newSettings = { /* supported settings: font, theme, xp  */ }) => {
    let settingsObject = getSettingsObject();
    Object.keys(newSettings).forEach(newSettingsKey => {
        settingsObject[newSettingsKey] = newSettings[newSettingsKey];
    });
    let settingsObjectString = JSON.stringify(settingsObject);
    localStorage.setItem(localStorageSettingsString, settingsObjectString);

    //applySettings();
}

export let incrementSetting = (incrementSetting, byAmmount=1) => {
    let settingsObject = getSettingsObject();
    let currentValue = settingsObject[incrementSetting];
    let newValue = byAmmount;
    if(typeof Math.round(currentValue) === "number"){
        newValue += Math.round(currentValue);
    } else{ console.error("not a number!"); }

    editSetting({ [incrementSetting]: newValue });
}

export let setDefault = (key) => {
    //editSetting( { [key]: DEFAULT_SETTINGS[key] } );
}

export let applySettings = () => {
    let settingsObject = getSettingsObject();
    let fontOptions = {
        "pixel1": "pixel-1",
        "arial1": "arial-1",
        "monospace1": "monospace-1",
        "couriernew1": "courier-new-1",
        "cursive1": "cursive-1"
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
            element.classList.toggle("courier-new-1", settingsObject["font"] == "couriernew1");
            element.classList.toggle("cursive-1", settingsObject["font"] == "cursive1");
        });
    }

    applyFont();
}

requestAnimationFrame(applySettings);
window.applySettings = () => { applySettings(); };

window.addXP = (amm=1) => { incrementSetting("xp", amm); }
window.addXP();

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



let hatePixelartButton = document.getElementById("hate-pixel-art-button");
let likePixelartButton = document.getElementById("like-pixel-art-button");

if(hatePixelartButton != null) { 
    let detectPixelart = () => {
        let isPixelart = getSettingsObject()["font"] == "pixel1";
        hatePixelartButton.classList.toggle("hide", isPixelart);
        likePixelartButton.classList.toggle("hide", !isPixelart);
        return isPixelart;
    }
    let togglePixelart = () => {
        let isPixelart = detectPixelart();
        let newFont = isPixelart ? "arial1" : "pixel1" ;
        fontChange(newFont);
        let newTheme = isPixelart ? "vector-1" : "pixel-1";
        editSetting({ "theme": newTheme });
        let newImageExtension = isPixelart ? ".svg" : ".png";
        editSetting({ "image-extension": newImageExtension });
        window.location.reload();
    }
    hatePixelartButton.addEventListener("click", () => {
        togglePixelart();
    });
    likePixelartButton.addEventListener("click", () => {
        togglePixelart();
    });
    detectPixelart();
    //weird fix, got a bad smell, probably a better way to make this:
    hatePixelartButton.classList.toggle("hide");
    likePixelartButton.classList.toggle("hide");
}

