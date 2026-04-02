//this script is a very simple script to be run before anything else
//it grabs local settings, and puts them in window for use by other scripts

window.TTC = window.TTC || {};
let navigator = window.navigator;
let defualtLanguage = navigator.language;

let initSettingsObject = () => {
    //new user, needs new settings
    let startObject = { 
        font: "pixel1", 
        theme: "pixel-1", 
        xp: 0,
        language: "english",
        codeLanguage: "python"
    };
    let startSettings = JSON.stringify(startObject);
    localStorage.setItem("user_settings", startSettings);
}

let getSettingsObject = () => {
    let settings = localStorage.getItem("user_settings");

    if(settings === null) { 
        //in case user just got here
        initSettingsObject(); 
        settings = localStorage.getItem("user_settings");
    }

    let settingsObject = JSON.parse(settings);
    return settingsObject;
}

let getLocalSetting = (settingsName) => {
    let settingsObject = getSettingsObject();
    if (!(settingsName in settingsObject)) { return null; }
    let getSetting = settingsObject[settingsName];
    return getSetting;
}

let changeLocalSetting = (setting, value) => {
    //get from local storage
    let settingsObject = getSettingsObject();

    settingsObject[setting] = value;

    //send to local storage
    let updatedSettings = JSON.stringify(settingsObject);
    localStorage.setItem("user_settings", updatedSettings);
}

let updateThemeFromLocal = () => {
    let theme = getLocalSetting("theme") ?? "pixel-1";

    window.TTC.theme = theme;
}

updateThemeFromLocal();

let updateImageExtensionFromLocal = () => {
    let imageExtension = getLocalSetting("image-extension") ?? ".png";

    window.TTC.imageExtension = imageExtension;
}

updateImageExtensionFromLocal();

let updateXPFromLocal = () => {
    let xp = getLocalSetting("xp") ?? "0";
    xp = Math.round(xp);

    window.TTC.xp = xp;
}

updateXPFromLocal();

let updateVariableFromLocal = ({variableName = "", defualtValue = null, shouldTypesBeSame = true, canBeNullish = false, setLocalStorage = false} = {}) => {
    let variableValue = getLocalSetting(variableName);
    console.log(`setting ${variableName} to ${defualtValue} or ${variableValue}`);

    let areTypesTheSame = typeof variableValue !== typeof defualtValue;
    if(shouldTypesBeSame && !areTypesTheSame){
        window.TTC[variableName] = defualtValue;
        console.error("the default value type was not the same as the variable type!!");
        return defualtValue;
    }

    variableValue = canBeNullish ? variableValue : (variableValue ?? defualtValue);

    canBeNullish && console.assert(variableName != null);
    setLocalStorage && changeLocalSetting(variableName, variableValue);
    
    console.log(`choice: ${variableValue}`);

    window.TTC[variableName] = variableValue;


    return variableName;
}

updateVariableFromLocal({ 
    variableName: "language", 
    defualtValue: "english", 
    shouldTypesBeSame: true,
    canBeNullish: false,
    setLocalStorage: true
});

updateVariableFromLocal({
    variableName: "codeLanguage",
    defualtValue: "python",
    shouldTypesBeSame: true,
    canBeNullish: false,
    setLocalStorage: true
});