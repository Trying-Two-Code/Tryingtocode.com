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

//for use in signin and signup .html
import { signInUp } from './firebase-backend/firebase.js';

const signupContainer = document.getElementById("signup-container");
const usernameField = signupContainer.querySelector("[data-js-tag='username-field']");
const emailField = signupContainer.querySelector("[data-js-tag='email-field']");
const passwordField = signupContainer.querySelector("[data-js-tag='password-field']");
const submitButton = signupContainer.querySelector("[data-js-tag='submit-button']");
const errorMessage = signupContainer?.querySelector("[id='user-error']");

let submitInfo = (event, userExists = false) => {
    event.preventDefault();

    let data = {
        password: null,
        username: null,
        email: null
    };
    
    let gatherData = () => {
        data.password = passwordField?.value;
        data.username = usernameField?.value;
        data.email = emailField?.value;
        console.log(data);
    };

    let validateData = () => {
        //false = not valid
        //set user exists depending on values: 
        // (if all are good, then assume user doesn't exist)
        // (if only username and password then assume user does)

        let checkValidity = (ofString) => {
            if(ofString == null) { return false; }
            if(ofString.length < 6){ return false; }
            return true;
        }

        let passwordValid = checkValidity(data.password);
        let emailValid = checkValidity(data.email);
        let usernameValid = checkValidity(data.username);

        if(!passwordValid){
            //nothing should work if password doesn't
            throw "password invalid";
        }

        if(!usernameValid && !emailValid){
            //no username or email? That don't work at all.
            throw "username & email invalid";
        }

        if(!emailValid){
            //if email no work, then user exists
            userExists = true;
            return true;
        }

        //everything has been successfully sent? So user don't exist.
        userExists = false;
        return true;
    };

    let showUserError = () => {

        errorMessage.value = `please input: ${errors}`;
    }

    let sendData = () => {
        let errorMessage = signInUp(data.email, data.password, data.username);
        console.log(`error messege is: ${errorMessage}`);
        if(errorMessage != null && errorMessage !== true){
            
        }
    }

    gatherData();
    try{
        validateData();
        sendData();
    } catch (error){
        console.error(error);
    }
};

submitButton.addEventListener("click", (event) => {submitInfo(event);});

let detectSignedIn = () => {
    if(window.user.uid != null){
        
    }
}

window.addEventListener("user_set", () => {
    console.log("I'm already set?: ", window.user.uid);
    detectSignedIn();
});