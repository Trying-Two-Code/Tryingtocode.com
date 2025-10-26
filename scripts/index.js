//for use in index.html
import { SignIn as SI } from "./signin.js";
import { signInUp } from '../firebase.js';
import { getCoin } from "./coin.js";

let signInParent = document.getElementById("sign-in-holder");
let signIn = new SI(document, signInParent)
let toggleSigninup = document.getElementById("toggle-signinup");

signIn.toggleButton(toggleSigninup);
signIn.submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(signIn.password.value != null){
        signInUp(signIn.user.value, signIn.password.value);
    }
});

getCoin(0);

let go_learn = document.getElementById("go-learn");
go_learn.addEventListener("click", () => {
    window.location.href = "learn.html";
});