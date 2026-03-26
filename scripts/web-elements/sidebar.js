import { getCoin, changeNumber} from "../coin/coin.js";
import { Toggle, ImageButton } from "../tools.js";

/**
 * this script initialises the sidebar, the ui element at the left hand of basically every page
 */

class TTCSidebar extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        this.startClosed = this.getAttribute("start-closed") ?? false;

        this.theme = window.theme ?? "pixel-1";
        this.imageExtension = window.imageExtension ?? ".png"; 
        this.iconPath = "components/visuals/icons/sidebar";
        this.innerHTML = `
    <div data-js-tag="toggle-this-part-of-sidebar" class="sidebar">
        <div class="sidebar-element">
            <a href="index" title="Home" class="logo side" id="home-icon" draggable="false">
                <img src="components/visuals/logos/coin/${this.theme}${this.imageExtension}" alt="Coin logo" class="nice-button">
            </a>
            <button data-js-tag='dropdown-button' class="toggle-dropdown" draggable="false">
                <img class="toggle-dropdown--img nice-button" src="${this.iconPath}/toggle-arrow/${this.theme}/frame-2${this.imageExtension}" alt="" id="toggle-button">
            </button>
            <div class="dropdown">
                <ul class="dropdown--list">
                    <li class="dropdown--element"><a href="index" title="Home">
                        <img class="dropdown--image nice-button" src="${this.iconPath}/home/${this.theme}${this.imageExtension}" alt="Home" draggable="false">
                    </a></li>
                    <li class="dropdown--element"><a href="learn" title="Learn">
                        <img class="dropdown--image nice-button dark-glow" src="${this.iconPath}/learn/${this.theme}${this.imageExtension}" alt="Learn" draggable="false">
                    </a></li>
                    <!--li class="dropdown--element"><a href="create.html" title="Create">
                        <img class="dropdown--image nice-button dark-glow rotate-45" src="${this.iconPath}/create/${this.theme}${this.imageExtension}" alt="Create" draggable="false">
                    </a></li>
                    <li class="dropdown--element"><a href="signin.html" title="Create">
                        <img class="dropdown--image nice-button dark-glow rotate-45" src="${this.iconPath}/sign-in/${this.theme}${this.imageExtension}" alt="Create" draggable="false">
                    </a></li-->
                </ul>
            </div>
            <h2 class="main-font" data-js-tag='sidebar-coin-counter'>404</h2>
            <div class="toggle-sidebar bottom-sidebar" data-js-tag="toggle-sidebar">
                <button class="nice-button no-bg-button" data-js-tag="togle-sidebar-button">
                    <img class="dropdown--image" src="${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-1${this.imageExtension}" draggable="false"></img>
                </button>
            </div>
        </div>
    </div>
    `;
        this.findElements();
        this.setupFunctionality();
        if(typeof window.applySettings !== "undefined"){ window.applySettings(); }
    }

    findElements(){
        this.coinCounter = this.querySelector("[data-js-tag='sidebar-coin-counter']");
        this.dropdownButton = this.querySelector("[data-js-tag='dropdown-button']");
        this.dropdownElements = Array.from(this.getElementsByClassName("dropdown"));
        this.toggleArt = [`${this.iconPath}/toggle-arrow/${this.theme}/frame-1${this.imageExtension}`, 
                          `${this.iconPath}/toggle-arrow/${this.theme}/frame-2${this.imageExtension}`];

        this.toggleThisPartOfSidebar = this.querySelector("[data-js-tag='toggle-this-part-of-sidebar']")
        this.toggleSidebarContainer = this.querySelector("[data-js-tag='toggle-sidebar']");
        this.toggleSidebarButton = this.toggleSidebarContainer.querySelector("[data-js-tag='togle-sidebar-button']");
        this.toggleSidebarArt = [
            `${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-1${this.imageExtension}`,
            `${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-2${this.imageExtension}` 
        ]
    }

    setupFunctionality(){
        this.mainDropdown = new Toggle(this.dropdownButton, this.dropdownElements, "hide");
        this.imageButton = new ImageButton(this.dropdownButton, this.toggleArt, 1);
        this.imageButton.changeOnClick();
        //this.mainDropdown.

        this.toggleSidebar = new Toggle(this.toggleSidebarButton, [this.toggleThisPartOfSidebar], "hide", undefined, undefined, undefined, this.startClosed);
        this.toggleSidebarImageButton = new ImageButton(this.toggleSidebarButton, this.toggleSidebarArt, 1);
        this.toggleSidebarImageButton.changeOnClick();
        //this.toggleSidebar.show();
        this.initCoinNumber();
        this.initHiddenSidebar();
    }

    initCoinNumber(){
        //could be incorrect, however it is the fast to recieve localy stored coin number
        let localCoin = localStorage.getItem("coin");
        let stringIsNumber = (string) => {
            let numberFromString = Math.round(string);
            if(typeof numberFromString === "number" && !isNaN(numberFromString)){
                return true;
            } else{
                return false;
            }
        }
        if(!stringIsNumber(localCoin)) {
            localStorage.setItem("coin", 0);
            localCoin = 0;
        }
        this.coinCounter.innerHTML = localCoin;
    }

    initHiddenSidebar(){
        this.hiddenSidebarHTML = `
            <div></div>
        `;
    }

    updateDisplayNumber(updatedNumber, startString) {
        if(typeof updatedNumber !== "number" || typeof startString !== "string") { console.error("incorrect datatype sent to display number!"); }
        let currentCoins = updatedNumber;

        if (this.coinCounter != null){
            this.coinCounter.innerHTML = startString + currentCoins;
        }
    }
}

customElements.define("ttc-sidebar", TTCSidebar);


class TTCHidenSidebar extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        
    }
}