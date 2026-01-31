//for use in index.html
import { SignIn } from "./sign-in.js";
import { signInUp } from '../firebase.js';
import { getCoin } from "./coin.js";
import { Toggle } from "./tools.js";
//import { runUserCode } from "./pyrun.js";

console.log("work 0");

let print = text => {console.log(text);}

/*let signInParent = document.getElementById("sign-in-holder");
let toggleSigninup = document.getElementById("toggle-signinup");
let signIn = new SignIn(document, signInParent);
let toggle = new Toggle(toggleSigninup, signInParent, "slow-hide", "sign-in");
toggle.addEvent(toggle.toggleEventFilled, signIn.exit);*/

const PROJECT_PARENT = document.getElementById("project-parent");

/*signIn.toggleButton(toggleSigninup);
signIn.submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(signIn.password.value != null){
        signInUp(signIn.user.value, signIn.password.value);
    }
});*/

let goto = document.getElementById("coin-go-here");
console.log(goto);
const counter = document.getElementById("coin-counter");
let indexGetCoin = (amm) => {
    getCoin(amm, counter)
}

let nice = () => {indexGetCoin(10);}

let runCode = document.getElementById('welcome--run-code');
let outputBox = document.getElementById("welcome--learn-div--output")
let codeContent = document.getElementById('code-content');
codeContent = "print('learn code')"

runCode.addEventListener("click", nice);
runCode.addEventListener("click", () => {runCode.removeEventListener("click", nice); });

runCode.addEventListener("mousedown", () => {
    runCode.classList.add("spin");
});

runCode.addEventListener("mouseup", async() => {
    runCode.classList.remove("spin");
    /*runCode.classList.toggle("nice-button");
    runCode.classList.toggle("welcome--run-code")*/
    //let output = await runUserCode(codeContent)
    let output = [true, "learn code"]
    outputBox.innerHTML = output[1];
});
