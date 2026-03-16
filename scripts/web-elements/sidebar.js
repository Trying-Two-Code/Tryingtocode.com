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

        this.innerHTML = `
<div class="sidebar">  
    <a href="index" title="Home"  class="logo" id="home-icon" draggable="false">
        <img src="components/art/ttc coin icon.png" alt="Coin logo" class="nice-button">
    </a>
    <button data-js-tag='dropdown-button' class="toggle-dropdown" draggable="false">
        <img class="toggle-dropdown--img nice-button" src="components/art/yellow - toggle arrow up.png" alt="" id="toggle-button">
    </button>
    <div class="dropdown">
        <ul class="dropdown--list">
            <li class="dropdown--element"><a href="index" title="Home">
                <img class="dropdown--image nice-button" src="components/art/clean icon - 9.png" alt="Home" draggable="false">
            </a></li>
            <li class="dropdown--element"><a href="learn" title="Learn">
                <img class="dropdown--image nice-button dark-glow" src="components/art/clean icon - 10.png" alt="Learn" draggable="false">
            </a></li>
            <li class="dropdown--element"><a href="create.html" title="Create">
                <img class="dropdown--image nice-button dark-glow rotate-45" src="components/art/clean icon - hammer.png" alt="Create" draggable="false">
            </a></li>
            <li class="dropdown--element"><a href="signin.html" title="Create">
                SI
            </a></li>
        </ul>
    </div>
    <h2 class="main-font" data-js-tag='sidebar-coin-counter'>404</h2>
</div>
    `;
        this.findElements();
        this.setupFunctionality();
        this.initCoinNumber();
    }

    findElements(){
        this.coinCounter = this.querySelector("[data-js-tag='sidebar-coin-counter']");
        this.dropdownButton = this.querySelector("[data-js-tag='dropdown-button']");
        this.dropdownElements = Array.from(this.getElementsByClassName("dropdown"));
        this.toggleArt = ['components/art/yellow - toggle arrow down.png', 
                          'components/art/yellow - toggle arrow up.png'];
    }

    setupFunctionality(){
        this.mainDropdown = new Toggle(this.dropdownButton, this.dropdownElements, "hide");
        this.imageButton = new ImageButton(this.dropdownButton, this.toggleArt, 1);
        this.imageButton.changeOnClick();
        //this.mainDropdown.
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
        console.log("update");
        let currentCoins = updatedNumber;

        if (this.coinCounter != null){
            this.coinCounter.innerHTML = startString + currentCoins;
        }
    }
}

customElements.define("ttc-sidebar", TTCSidebar);