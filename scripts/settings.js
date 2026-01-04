console.log("readddy for settings rider sir");

const DEFAULT_SETTINGS = {
    "font": "main-font",
};

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

var isPixel = true;
export let updateSettings = (document) => {
    isPixel = !isPixel;
    document.querySelectorAll('*').forEach(element => {
        element.classList.toggle("main-font", isPixel);
        element.classList.toggle("pixel-alt", !isPixel);
    });
}

let updateSettingsButton = document.getElementById("change-setting");
let filledSettings = () => {updateSettings(document);}
updateSettingsButton.addEventListener("click", filledSettings);
