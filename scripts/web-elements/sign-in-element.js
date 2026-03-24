import { Toggle } from '../tools.js';
import { signInUp } from '../firebase-backend/firebase.js';

class TTCSignIn extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        this.hideIconWhenOpen = this.getAttribute("hide-icon-when-open") ?? false;
        this.imageExtension = window.imageExtension;

        this.innerHTML = `
            <div data-js-tag="sign-in-holder" class="sign-in-holder"></div>
                <div class="welcome--sign-in">
                    <a href="#signin" title="Learn">
                        <button class="no-bg-button" data-js-tag="toggle-signinup"><img class="nice-button si-button-image" src="./components/visuals/icons/sign-in/new-user/${window.theme}${this.imageExtension}" alt=""></button>
                    </a>
                    <div data-js-tag="sign-in-elements-holder">
                        <div data-js-tag="sign-in" class="sign-in">
                            <form action="">
                                <h1 class="si-title">Sign in</h1>
                                <div class="input-box si-input-container">
                                    <input data-js-tag="username" type="text" placeholder="Username" class="si-input main-font" required>
                                </div>
                                <div class="input-box si-output-container">
                                    <input type="password" data-js-tag="password" type="text" placeholder="Password" class="si-output main-font" required minlength="4">
                                </div>
                            </form>
                            <div class="si-button-flexbox">
                                <button data-js-tag="exit-button" class="si-exit main-font nice-button no-bg-button">
                                    <img style="width: 30px; height: 30px;" data-js-tag="close-img" src='./components/visuals/icons/project/close/${window.theme}${this.imageExtension}'>
                                </button>
                                <button data-js-tag="submit-button" class="si-submit main-font">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        `;

        this.findElements();
        this.setupElements();
    }

    findElements(){
        this.user = this.querySelector("[data-js-tag='username']");
        this.password = this.querySelector("[data-js-tag='password']");
        this.submit = this.querySelector("[data-js-tag='submit-button']");
        this.exit = this.querySelector("[data-js-tag='exit-button']");

        this.toggler = this.querySelector("[data-js-tag='toggle-signinup'");
        this.toggleThis = this.querySelector("[data-js-tag='sign-in']");
    }

    setupElements(){
        this.mainToggle = new Toggle(this.toggler, [this.toggleThis], "slow-hide", "sign-in");

        this.setupSigninUp();
        this.setupCloseButton();
    }
    
    setupSigninUp(){
        let signInUpEvent = () => {
            try{
                let user = this.user.value;
                let password = this.password.value;
                console.log("attempting signinup event. ", user, password);
                signInUp(user, password);
            } catch (error) {
                console.error(error);
            }
        };
        this.submit.addEventListener("click", () => {
            signInUpEvent();
        });
    }

    setupCloseButton(){
        let closeEvent = () => {
            console.log("it is trying to work");
            this.mainToggle.toggleEvent();
            window.scrollTo({top: 0, behavior: "smooth"});
        };
        this.exit.addEventListener("click", () => {
            closeEvent();
        });
    }
}

customElements.define("ttc-sign-in", TTCSignIn);