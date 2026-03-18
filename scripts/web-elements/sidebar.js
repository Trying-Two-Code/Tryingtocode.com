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
        this.theme = window.theme ?? "pixel-1";
        this.iconPath = "components/visuals/icons/sidebar";
        this.innerHTML = `
<div>  
    <div data-js-tag="toggle-this-part-of-sidebar" class="sidebar">
        <a href="index" title="Home"  class="logo" id="home-icon" draggable="false">
            <img src="components/visuals/logos/coin/${this.theme}.png" alt="Coin logo" class="nice-button">
        </a>
        <button data-js-tag='dropdown-button' class="toggle-dropdown" draggable="false">
            <img class="toggle-dropdown--img nice-button" src="${this.iconPath}/toggle-arrow/${this.theme}/frame-2.png" alt="" id="toggle-button">
        </button>
        <div class="dropdown">
            <ul class="dropdown--list">
                <li class="dropdown--element"><a href="index" title="Home">
                    <img class="dropdown--image nice-button" src="${this.iconPath}/home/${this.theme}.png" alt="Home" draggable="false">
                </a></li>
                <li class="dropdown--element"><a href="learn" title="Learn">
                    <img class="dropdown--image nice-button dark-glow" src="${this.iconPath}/learn/${this.theme}.png" alt="Learn" draggable="false">
                </a></li>
                <li class="dropdown--element"><a href="create.html" title="Create">
                    <img class="dropdown--image nice-button dark-glow rotate-45" src="${this.iconPath}/create/${this.theme}.png" alt="Create" draggable="false">
                </a></li>
                <li class="dropdown--element"><a href="signin.html" title="Create">
                    <img class="dropdown--image nice-button dark-glow rotate-45" src="${this.iconPath}/sign-in/${this.theme}.png" alt="Create" draggable="false">
                </a></li>
            </ul>
        </div>
        <h2 class="main-font" data-js-tag='sidebar-coin-counter'>404</h2>
    </div>
    <div class="toggle-sidebar" data-js-tag="toggle-sidebar">
        <button class="nice-button no-bg-button" data-js-tag="togle-sidebar-button">
            <img src="${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-1.png" draggable="false"></img>
        </button>
    </div>
</div>
    `;
        this.findElements();
        this.setupFunctionality();
        this.initCoinNumber();
        if(typeof window.applySettings !== "undefined"){ window.applySettings(); }
    }

    findElements(){
        this.coinCounter = this.querySelector("[data-js-tag='sidebar-coin-counter']");
        this.dropdownButton = this.querySelector("[data-js-tag='dropdown-button']");
        this.dropdownElements = Array.from(this.getElementsByClassName("dropdown"));
        this.toggleArt = ['components/art/yellow - toggle arrow down.png', 
                          'components/art/yellow - toggle arrow up.png'];

        this.toggleThisPartOfSidebar = this.querySelector("[data-js-tag='toggle-this-part-of-sidebar']")
        this.toggleSidebarContainer = this.querySelector("[data-js-tag='toggle-sidebar']");
        this.toggleSidebarButton = this.toggleSidebarContainer.querySelector("[data-js-tag='togle-sidebar-button']");
        this.toggleSidebarArt = [
            `${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-1.png`,
            `${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-2.png` 
        ]
    }

    setupFunctionality(){
        this.mainDropdown = new Toggle(this.dropdownButton, this.dropdownElements, "hide");
        this.imageButton = new ImageButton(this.dropdownButton, this.toggleArt, 1);
        this.imageButton.changeOnClick();
        //this.mainDropdown.

        this.toggleSidebar = new Toggle(this.toggleSidebarButton, [this.toggleThisPartOfSidebar], "hide", undefined, undefined, undefined, false);
        this.toggleSidebarImageButton = new ImageButton(this.toggleSidebarButton, this.toggleSidebarArt, 1);
        this.toggleSidebarImageButton.changeOnClick();
        //this.toggleSidebar.show();
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
        console.log("changing number: ", localCoin, this.coinCounter, this.coinCounter.value);
    }

    updateDisplayNumber(updatedNumber, startString) {
        if(typeof updatedNumber !== "number" || typeof startString !== "string") { console.error("incorrect datatype sent to display number!"); }
        console.log("update");
        let currentCoins = updatedNumber;

        if (this.coinCounter != null){
            this.coinCounter.innerHTML = startString + currentCoins;
        }
    }
}

customElements.define("ttc-sidebar", TTCSidebar);