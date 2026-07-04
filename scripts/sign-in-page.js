//for use in ALL HTML FILES
//import { SimpleToggle } from "./tools.js";
/*import { SignIn } from "./sign-in.js";
import { Toggle } from "./tools.js";
import { signInUp } from './firebase-backend/firebase.js';

const PROJECT_PARENT = document.getElementById("project-parent");

let signInParent = document.getElementById("sign-in-holder");
let toggleSigninup = document.getElementById("toggle-signinup");

let signInElement = new SignIn(signInParent);
let toggle = new Toggle(toggleSigninup, signInParent, "slow-hide", "sign-in");
toggle.addEvent(toggle.toggleEventFilled, signInElement.exit);

let checkProperValues = ({user = null, password = null} = {}) => {
    if(user == null || user.length <= 2) { 
        return false; 
    }
    if(password == null || password.length <= 5) {
        return false;
    }
    return true;
}
signInElement.submit.addEventListener("click", (e) => {
    e.preventDefault();
    let password = signInElement.password.value;
    let user = signInElement.user.value;
    let properValues = checkProperValues({user: user, password: password});
    if(properValues){
        console.log("attempting sign in with: ", user, password);
        signInUp(user, password);
    }
});*/

//for use in index.html
/*import { SignIn } from "./sign-in.js";
import { signInUp } from './firebase-backend/firebase.js';
import { Toggle } from "./tools.js";*/
//import { runUserCode } from "./pyrun.js";
/*
let signInParent = document.getElementById("sign-in-holder");
let toggleSigninup = document.getElementById("toggle-signinup");
let signIn = new SignIn(signInParent);
let toggle = new Toggle(toggleSigninup, signInParent, "slow-hide", "sign-in");
toggle.addEvent(toggle.toggleEventFilled, signIn.exit);

const PROJECT_PARENT = document.getElementById("project-parent");

//signIn.toggleButton(toggleSigninup);
signIn.submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(signIn.password.value != null){
        signInUp(signIn.user.value, signIn.password.value);
    }
});

*/

const signupContainer = document.getElementById("signup-container");
const usernameField = document.querySelector()