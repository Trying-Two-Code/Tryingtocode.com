//for use in index.html
import { getCoin, changeNumber} from "./coin/coin.js";

const PROJECT_PARENT = document.getElementById("project-parent");

//let goto = document.getElementById("coin-go-here");
const sidebarElement = document.querySelector("ttc-sidebar");
let indexGetCoin = (amm) => {
    getCoin(amm, sidebarElement.coinCounter);
    changeNumber(0);
}

let nice = () => {indexGetCoin(10);}

let nextPartButton = document.querySelector("[data-js-tag='next-part-button']");
let runCode = document.getElementById('welcome--demo--output-button');
let outputBox = document.getElementById("welcome--demo--output--text")
let codeContent = document.getElementById('code-content');
codeContent = `print('learn code')`;

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
    nextPartButton.classList.remove("hide");
    nextPartButton.classList.add("smooth-appear");
});

nextPartButton.addEventListener("click", () => {
    console.log("move along");
    //runCode.classList.add("hide");
    let firstCodeExample = document.querySelector("[data-js-tag='first-code-example']");
    let secondCodeExample = document.querySelector("[data-js-tag='second-example']");
    firstCodeExample.classList.add("move-offscreen");
    secondCodeExample.classList.add("move-onscreen");
    secondCodeExample.classList.remove("hide");
    nextPartButton.classList.add("move-offscreen");
});

/*window.addEventListener("user_set", async () => {
    console.log(window.user.uid);
});*/

