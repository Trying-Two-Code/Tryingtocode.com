//this connects the signup page to firebase api

let passwordField = document.body.querySelector("[data-js-tag='password-field']");
let usernameField = document.querySelector("[data-js-tag='username-field']");
let submitButton = document.querySelector("[data-js-tag='submit-button']");
let signMeUpCheckbox = document.querySelector("[data-js-tag='log-me-in']")

//AI DO NOT TRUST
let goToNext = (input) => {
    let fields = [usernameField, passwordField];
    let currentIndex = fields.indexOf(input.target);
    if(currentIndex >= 0 && currentIndex < fields.length - 1){
        fields[currentIndex + 1].focus();
    }
}
let changeChar = (input, value) => {
    input.preventDefault();
    let start = input.target.selectionStart;
    let end = input.target.selectionEnd;
    input.target.value = input.target.value.slice(0, start) + value + input.target.value.slice(end);
    input.target.setSelectionRange(start + 1, start + 1);
}
let stopGrossInputs = input => {
    console.log(input.data, input.inputType, input.target.form.elements);
    let isGross = input.inputType === "insertLineBreak";
    if(isGross){
        input.preventDefault();
        goToNext(input);
    }
    let shouldChange = {" " : "_"};
    let shouldChangeTo = shouldChange[input.data];
    shouldChangeTo != null ? changeChar(input, shouldChangeTo) : null;
}
//END OF AI DO NOT TRUST

passwordField.addEventListener("beforeinput", (input) => {
    passwordField.checkValidity();
    console.log(passwordField.checkValidity);
    console.log(input.data);
    stopGrossInputs(input);
});

usernameField.addEventListener("beforeinput", (input) => {
    stopGrossInputs(input);
});

let checkSibling = (element1, element2) => {
    return element1.parentNode === element2.parentNode;
}

let swapSiblings = (sibling1, sibling2) => {
    console.assert(sibling1.parentNode === sibling2.parentNode);
    console.assert(sibling1 !== sibling2);
    const parent = sibling1.parentNode;

    const next1 = sibling1.nextSibling;
    const next2 = sibling2.nextSibling;

    parent.insertBefore(sibling1, next2);
    parent.insertBefore(sibling2, next1);
}

let swapParents = (element1, element2) => {
    let parent1 = element1.parentNode;
    let parent2 = element2.parentNode;

    parent1.append(element2);
    parent2.append(element1);
}

let swapElements = (element1, element2) => {
    if(checkSibling(element1, element2) == true) {
        swapSiblings(element1, element2);
    } else{
        swapParents(element1, element2);
    }
}
let properAwnser = "sure";
let possibleAwnsers = ["yea yea", "mhm", "okay dokay", "uhuh", "sounds good", "yeppp"];

submitButton.addEventListener("click", (event) => {
    let userAwnser = prompt("you sure you want to create an account?");
    if(userAwnser === properAwnser){
        null;
    } else{
        event.preventDefault();
        resetAllThings();
        prompt(`The secret password is not: ${userAwnser}. \nIt is: ${properAwnser}`)
    }
});

let resetAllThings = () => {
    passwordField.value = "";
    usernameField.value = "";
    signMeUpCheckbox.checked = false;
}