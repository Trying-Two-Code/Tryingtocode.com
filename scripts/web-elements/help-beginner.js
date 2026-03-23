// A popup that shows up for users who are new to the site, and have taken 
// a long time to finish a project.

class TTCHelpBeginnerPopup extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.init();
    }

    init(){
        this.render();
        this.initValues();
        this.initBehaviour();
    }

    render(){
        this.innerHTML = `
            <div class="nice-popup">
                <dialog data-js-tag="popup-dialog" closedby="closerequest">
                    <p class="main-font">hey yo, this is the inside of the popup!</p>
                </dialog>
            </div>
        `;
    }

    initValues(){
        let queryTag = (jsDataTag) => { return this.querySelector(`[data-js-tag=${jsDataTag}]`);}
        
        this.mainDialogElement = queryTag("popup-dialog");
    }

    initBehaviour(){
        console.log("HELLO?", this.mainDialogElement);
        this.mainDialogElement.showModal();
    }
}

customElements.define("ttc-help-beginner-popup", TTCHelpBeginnerPopup);