const htmlGen =  
`
<div id="sign-in" class="pixel-font center">
    <form action="">
        <h1>sign in</h1>
        <div class="input-box">
            <input id="username" type="text" placeholder="Username (required)" required>
        </div>
        <div class="input-box">
            <input id="password" type="text" placeholder="Password">
        </div>
    </form>
    <button id="submit-button">submit</button>
</div>
`

export class SignIn{
    constructor(document, parent, HTML=htmlGen){
        let template = document.createElement('template');

        template.innerHTML = HTML.trim();
        this.content = template.content;
        this.projectEl = this.content.firstElementChild;

        parent.appendChild(this.content);

        this.findElements();

        this.toggle();
    }

    findElements(){
        this.user = this.projectEl.querySelector("#username");
        this.password = this.projectEl.querySelector("#password");
        this.submit = this.projectEl.querySelector("#submit-button");
    }

    toggleButton(button){
        button.addEventListener("click", () => {
            this.toggle();
        });
    }

    toggle(){
        console.log("toggle");
        this.projectEl.classList.toggle("gone");
    }
}
