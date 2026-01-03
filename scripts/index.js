//for use in index.html
import { SignIn } from "./signin.js";
import { signInUp } from '../firebase.js';
import { getCoin } from "./coin.js";
import { Toggle } from "./tools.js";

console.log("work 0");

let signInParent = document.getElementById("sign-in-holder");
let toggleSigninup = document.getElementById("toggle-signinup");
let signIn = new SignIn(document, signInParent);
let toggle = new Toggle(toggleSigninup, signInParent, "slow-hide", "sign-in");
toggle.addEvent(toggle.toggleEventFilled, signIn.exit);

/*signIn.toggleButton(toggleSigninup);*/
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