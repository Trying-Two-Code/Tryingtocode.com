//this connects the signup page to firebase api

let passwordField = document.body.querySelector("[data-js-tag='password-field']");
let usernameField = document.querySelector("[data-js-tag='username-field']");

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