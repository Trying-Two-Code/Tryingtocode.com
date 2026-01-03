

const DEFAULT_SETTINGS = {
    "font": "main-font",
    
};

export let changeSetting = (document) => {
    document.elements.forEach(element => {
        element.style = "";
    });
}