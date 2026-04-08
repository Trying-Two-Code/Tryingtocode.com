//this connects the signup page to firebase api

let passwordField = document.body.querySelector("[data-js-tag='password-field']");
let usernameField = document.querySelector("[data-js-tag='username-field']");

passwordField.addEventListener("input", (input) => {
    passwordField.checkValidity();
    console.log(passwordField.checkValidity);
    console.log(input);
})