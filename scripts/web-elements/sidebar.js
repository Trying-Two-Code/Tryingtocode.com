import { getCoin, changeNumber} from "../coin/coin.js";
import { Toggle, ImageButton } from "../tools.js";
import { editSetting } from "../settings-functions.js";

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

        this.theme = window.TTC.theme ?? "pixel-1";
        this.imageExtension = window.TTC.imageExtension ?? ".png"; 
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
    <div data-js-tag="hidden-sidebar-parent" width=30 height=1000><div>
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

        this.hiddenSidebarParent = this.querySelector("[data-js-tag='hidden-sidebar-parent']");
    }

    setupFunctionality(){
        this.mainDropdown = new Toggle(this.dropdownButton, this.dropdownElements, "hide");
        this.imageButton = new ImageButton(this.dropdownButton, this.toggleArt, 1);
        this.imageButton.changeOnClick();
        //this.mainDropdown.

        this.toggleSidebar = new Toggle(
            this.toggleSidebarButton, 
            [this.toggleThisPartOfSidebar], 
            "sidebar-hidden", undefined, undefined, undefined, 
            this.startClosed
        );
        this.toggleSidebar.addEvent(() => {this.toggleSidebarEvent();});
        console.log(this.toggleSidebar);

        //this.toggleSidebarImageButton = new ImageButton(this.toggleSidebarButton, this.toggleSidebarArt, 1);
        //this.toggleSidebarImageButton.changeOnClick();
        this.initCoinNumber();
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

    toggleSidebarEvent(){
        if(this.toggleSidebar.toggled){
            this.initHiddenSidebar();
        }
    }

    initHiddenSidebar(){
        this.hiddenSidebar = document.createElement("ttc-hidden-sidebar");
        this.hiddenSidebarParent.appendChild(this.hiddenSidebar);
        this.hiddenSidebar.showSidebarEvent = () => { this.showSidebar(); }
        //this.toggleSidebarImageButton.changeOnClick(this.hiddenSidebar.showSidebarButton);
        this.toggleSidebarImageButton.changeImage();
        console.log(this.hiddenSidebar);
    }

    showSidebar(){ //called by hidden sidebar when it is showing up again
        this.toggleSidebar.toggleEvent();
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


class TTCHiddenSidebar extends HTMLElement {
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

        this.hidden();
    }

    render(){
        this.theme = window.TTC.theme ?? "pixel-1";
        this.imageExtension = window.TTC.imageExtension ?? ".png"; 
        this.iconPath = "components/visuals/icons/sidebar";

        this.innerHTML = `
        <div data-js-tag="show-button" class="hidden-sidebar sidebar"></div>
        <button data-js-tag="show-sidebar" class="show-sidebar nice-button main-font hide-bg-button">
            <img class="dropdown--image" src="${this.iconPath}/toggle-sidebar-arrow/${this.theme}/frame-2${this.imageExtension}" draggable="false"></img>
        </button>
        `;
    }

    findElements(){
        let queryTag = (tag) => { return this.querySelector(`[data-js-tag="${tag}"]`); }

        this.showSidebarButton = queryTag("show-sidebar");
        this.showButtonDiv = queryTag("show-button");
    }

    initFunctionality(){
        this.showSidebarButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.totallyGone();
            this.showSidebarEvent();
        });

        //subtle differences between mouseover and mouseenter make this neccissary (I think.)
        //for more information, visit: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event
        this.showButtonDiv.addEventListener("mouseover", (event) => {
            this.shown();
        });
        this.showButtonDiv.addEventListener("mouseenter", (event) => {
            this.moveShownButton({x: event.x, y: event.y});
        });
        this.showButtonDiv.addEventListener("mouseleave", (event) => {
            if(!this.showSidebarButton.matches(":hover")){
                this.hidden();
                this.showButtonDiv.style.pointerEvents = "auto";
            }
        });

        this.showSidebarButton.addEventListener("mouseleave", (event) => {
            this.hidden();
            this.showButtonDiv.style.pointerEvents = "auto";
        });
    }

    totallyGone(){ //can't be shown
        editSetting({"sidebar-hidden": false});
        this.showButtonDiv.classList.add("hide");
    }

    hidden(){ //can be shown, but is invisible
        this.showSidebarButton.classList.add("hide");
    }

    shown(){ //shows a button that allows the user to see the sidebar
        editSetting({"sidebar-hidden": true});
        this.classList.remove("hide");
    }

    moveShownButton(mousePosition={x: 0, y: 0}){
        const Y_OFFSET = -50;
        this.showSidebarButton.classList.remove("hide");
        this.showSidebarButton.style.top = `${mousePosition.y + Y_OFFSET}px`;
    }
}

customElements.define("ttc-hidden-sidebar", TTCHiddenSidebar);