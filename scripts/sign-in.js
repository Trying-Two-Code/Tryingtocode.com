//signin.js:
//import { Toggle } from "./tools";

const htmlGen =  
`
<div id="sign-in" class="pixel-font center si-container">
    <form action="">
        <h1 class="si-title">sign in</h1>
        <div class="input-box si-input-container">
            <input id="username" type="text" placeholder="Username (required)" class="si-input" required>
        </div>
        <div class="input-box si-output-container">
            <input id="password" type="text" placeholder="Password" class="si-output">
        </div>
    </form>
    <div class="si-button-flexbox">
        <button id="exit-button" class="si-exit">Exit</button>
        <button id="submit-button" class="si-submit">submit</button>
    </div>
</div>
`

export class SignIn{
    constructor(document, parent, toggle, HTML=htmlGen){
        let template = document.createElement('template');

        template.innerHTML = HTML.trim();
        this.content = template.content;
        this.projectEl = this.content.firstElementChild;

        parent.appendChild(this.content);

        this.findElements();

        this.toggle = toggle;
        this.toggle.transitionedElement = this.parent;
        /*this.toggleButton(this.exit);
        this.toggle();*/
    }

    findElements(){
        this.user = this.projectEl.querySelector("#username");
        this.password = this.projectEl.querySelector("#password");
        this.submit = this.projectEl.querySelector("#submit-button");
        this.exit = this.projectEl.querySelector("#exit-button");
    }

    /*toggleButton(button){
        button.addEventListener("click", () => {
            this.toggle(this.projectEl);
        });
    }

    toggle(element=this.projectEl){
        console.log("toggle");
        element.classList.toggle("slow-hide");
        return new Promise((resolve, reject) => {
            (element.style.height == 0);
        }) 
    }*/
}
