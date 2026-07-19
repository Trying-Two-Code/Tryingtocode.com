class smallCounter extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.init();
    }

    init(){
        this.render();
        this.findElements();
        this.initFunctionality();
    }

    render(){
        this.innerHTML = `
            <div data-js-tag="counter-container" class="nice-coin-popup">
                <p data-js-tag="counter-content" class="main-font coin-display" id="coin-display">
                    you have: 10 <img data-js-tag="counter-image" class="tiny-img" src="./components/visuals/logos/coin/${window.TTC.theme}${window.TTC.imageExtension}"></img>
                </p>
            </div>
        `;
    }

    findElements(){
        this.container = this.querySelector("[data-js-tag='counter-container']");
        this.content = this.querySelector("[data-js-tag='counter-content']");
        this.image = this.querySelector("[data-js-tag='counter-image']")
    }

    initFunctionality(){
        window.TTC.events.addEventListener("showSmallCoinCounter", (details) => {
            console.log("I am small coin counter. These are my details.", details);
            this.showFor(details.detail.seconds);

            this.showCurrentCoins();
        });
        this.hide();
    }

    showCurrentCoins(){
        const localData = localStorage.getItem("userdatainfirebase");
        let coins = JSON.parse(localData).coins;
        this.content.innerHTML = `you have: ${coins} <img data-js-tag="counter-image" class="tiny-img" src="./components/visuals/logos/coin/${window.TTC.theme}${window.TTC.imageExtension}"></img>`;
    }

    showFor(seconds){
        this.show();

        setTimeout(()=>{this.hide();}, seconds * 1000);
    }

    show(){
        this.container.classList.remove("slow-hide");
        this.container.classList.add("slow-show");
    }

    hide(){
        this.container.classList.add("slow-hide");
        this.container.classList.remove("slow-show");
    }
}

customElements.define("ttc-small-counter", smallCounter);