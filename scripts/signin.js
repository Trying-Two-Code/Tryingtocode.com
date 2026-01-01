const htmlGen =  
`
<div id="sign-in">
    <form action="">
        <h1 class="si-title">Sign in</h1>
        <div class="input-box si-input-container">
            <input id="username" type="text" placeholder="Username" class="si-input main-font" required>
        </div>
        <div class="input-box si-output-container">
            <input type="password" id="password" type="text" placeholder="Password" class="si-output main-font" required minlength="4">
        </div>
    </form>
    <div class="si-button-flexbox">
        <button id="exit-button" class="si-exit main-font">
            <img style="width: 30px; height: 30px;" id="close-img" src='./components/art/close button 1.png'>
        </button>
        <button id="submit-button" class="si-submit main-font">Submit</button>
    </div>
</div>
`

export class SignIn{
    constructor(document, parent, HTML=htmlGen){
        let template = document.createElement('template');

        template.innerHTML = HTML.trim();
        this.content = template.content;
        this.projectEl = this.content.firstElementChild;

        this.parent = parent;
        parent.appendChild(this.content);

        this.findElements();

        this.parent.classList.toggle("gone");
        this.toggleButton(this.exit);
        this.toggle();
    }

    findElements(){
        this.user = this.projectEl.querySelector("#username");
        this.password = this.projectEl.querySelector("#password");
        this.submit = this.projectEl.querySelector("#submit-button");
        this.exit = this.projectEl.querySelector("#exit-button");
    }

    toggleButton(button){
        button.addEventListener("click", () => {
            this.toggle(this.parent)

            let hiding = this.parent.classList.contains("slow-hide")

            if(hiding){

                const toggleEventListener = () => { 
                    this.parent.classList.toggle("gone"); 
                    console.log("should be gone");
                    this.parent.removeEventListener('transitionend', toggleEventListener);
                }

                this.parent.addEventListener('transitionend', toggleEventListener); 
            }else{
                this.parent.classList.toggle("gone"); 
            }


        });
    }

    toggle(element=this.parent){
        console.log("toggle");
        element.classList.toggle("slow-hide");
        return new Promise((resolve, reject) => {
            (element.style.height == 0);
        }) 
    }
}
