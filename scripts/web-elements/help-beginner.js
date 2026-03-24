// A popup that shows up for users who are new to the site, and have taken 
// a long time to finish a project.

//backup in case the user misclicks
class TTCSecondaryBeginnerPopup extends HTMLElement{
    constructor(){
        super();
    }

    init(){
        this.render();
        this.initValues();
        this.initBehaviour();
    }

    render(){
        this.innerHTML = `
            <div class="nice-popup">
                <dialog class="popup-dialog" data-js-tag="secondary-popup-dialog" closedby="closerequest">
                    <div class="popup-container">
                        <div class="row-container">
                            <button class="no-bg-button nice-button" data-js-tag="secondary-help-no-button">
                                <img class="popup-images" src="./components/visuals/icons/popup/help-beginner/decline/${window.theme}${window.imageExtension}" draggable="false"></img>
                            </button>
                            <button class="no-bg-button nice-button" data-js-tag="secondary-help-yes-button">
                                <img class="popup-images" src="./components/visuals/icons/popup/help-beginner/affirm/${window.theme}${window.imageExtension}" draggable="false"></img>
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        `;
    }

    initValues(){
        let queryTag = (jsDataTag, queryThis=this) => { return queryThis.querySelector(`[data-js-tag=${jsDataTag}]`);}

        this.mainDialogElement = queryTag("secondary-popup-dialog");
        this.helpNoButton = queryTag("secondary-help-no-button", this.mainDialogElement);
        this.helpYesButton = queryTag("secondary-help-yes-button", this.mainDialogElement);
    }

    initBehaviour(){
        this.mainDialogElement.show();

        this.helpNoButton.addEventListener("click", () => {this.decline();});
        this.helpYesButton.addEventListener("click", () => {this.approve(); });
    }

    decline(){
        this.mainDialogElement.close();
    }

    approve(){
        this.mainHelpBeginnerPopup.approve();
    }
}

customElements.define("ttc-secondary-help-beginner-popup", TTCSecondaryBeginnerPopup);

//main popup
class TTCHelpBeginnerPopup extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.init();
    }

    init(){
        this.detectShow();
        this.render();
        this.initValues();
        this.initBehaviour();
    }

    render(){
        this.innerHTML = `
            <div class="nice-popup">
                <dialog class="popup-dialog" data-js-tag="popup-dialog" closedby="any">
                    <div class="popup-container">
                        <p class="main-font popup-contents">Do you need help?</p>
                        <div class="row-container">
                            <button data-js-tag="help-yes-button" class="nice-button no-bg-button popup-contents main-font">Yes!</button>
                            <button data-js-tag="help-no-button" class="nice-button no-bg-button popup-contents main-font" >Noo!</button>
                        </div>
                    </div>
                </dialog>
            </div>
            <ttc-secondary-help-beginner-popup data-js-tag="secondary-popup"></ttc-secondary-help-beginner-popup>
        `;
    }

    initValues(){
        let queryTag = (jsDataTag, queryThis=this) => { return queryThis.querySelector(`[data-js-tag=${jsDataTag}]`);}
        
        this.mainDialogElement = queryTag("popup-dialog");
        this.helpYesButton = queryTag("help-yes-button", this.mainDialogElement);
        this.helpNoButton =  queryTag("help-no-button",  this.mainDialogElement);

        this.secondaryPopup = queryTag("secondary-popup");
        console.log(this.secondaryPopup); // == null for some reason?

        this.maxXP =        this.getAttribute("max-xp");
        this.showupTime =   this.getAttribute("showup-time");
        this.tutorialName = this.getAttribute("tutorial-name");
    }

    initBehaviour(){
        this.mainDialogElement.addEventListener("close", event => { this.mainDialogClosed(event); });
        this.mainDialogElement.addEventListener("cancel", event => { this.mainDialogClosed(event); });

        this.helpNoButton.addEventListener("click", () => {
            this.decline();
        });
        this.helpYesButton.addEventListener("click", () => {
            this.approve();
        });
    }

    detectShow(){
        let ensureAttribute = (htmlAttribute, jsAttribute) => {
            let hasAttribute = jsAttribute in this;
            if (!hasAttribute){
                this[jsAttribute] = this.getAttribute(htmlAttribute);
            }
        }
        ensureAttribute("max-xp", "maxXP");
        ensureAttribute("showup-time", "showupTime");
        
        let maxXP = parseInt(this.maxXP, 10);
        
        if(maxXP > window.xp){
            let showupTime = parseInt(this.showupTime, 10);
            this.serveToUser(showupTime);
        }
    }

    serveToUser(showupTime){ 
        //ammount of time to wait before showing up
        console.log("wait ", showupTime, " seconds before showing");
        setTimeout(() => {
            this.mainDialogElement.show();
        }, showupTime * 1000);
    }

    mainDialogClosed(event){
        console.log(event.type == "cancel");
        if(event.type === "cancel"){
            //user may have accidentaly left the popup
            //therefore, activate a secondary popup
            this.setupSecondaryDialog();
        }
    }

    setupSecondaryDialog(){
        console.log(this.secondaryPopup);
        this.secondaryPopup.mainHelpBeginnerPopup = this;
        this.secondaryPopup.init();
    }

    decline(){
        this.mainDialogElement.close();
    }

    approve(){
        console.log("go to next step!");
    }
}

customElements.define("ttc-help-beginner-popup", TTCHelpBeginnerPopup);
