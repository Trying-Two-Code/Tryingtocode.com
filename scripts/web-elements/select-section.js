class TTCSectionButton extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.init();
    }
    init(){
        let name = this.innerHTML;
        console.log(name, " is name");
        this.innerHTML = `
        <button class="main-font">
            ${name}
        </button>
        `;
    }
}

customElements.define("ttc-section-button", TTCSectionButton);