//for use in index.html
import { SignIn as SI } from "./signin.js";
import { createEmail } from '../firebase.js';

let signInParent = document.getElementById("sign-in-holder");
let signIn = new SI(document, signInParent)

let toggleSigninup = document.getElementById("toggle-signinup");

signIn.toggleButton(toggleSigninup);

signIn.submit.addEventListener("click", (e) => {
    e.preventDefault();
    createEmail(signIn.user.value, signIn.password.value);
});