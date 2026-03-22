import { SimpleToggle, Toggle } from '../tools.js';
import { fontChange } from '../settings-functions.js';

class TTCSettings extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        this.hideIconWhenOpen = this.getAttribute("hide-icon-when-open") ?? false;
        this.theme = window.theme;
        this.iconPath = "../../components/visuals/icons";
        this.imageExtension = window.imageExtension;

        this.innerHTML = `
            <div data-js-tag="settings-toggle">
                <button class="nice-button no-bg-button" data-js-tag="settings-toggle-button">
                    <img class="si-button-image" src="${this.iconPath}/settings/cog/${this.theme}${this.imageExtension}" alt="settings">
                </button>
            </div>
            <div data-js-tag="settings-holder">
                <div class="">
                    <button data-js-tag='toggle-font-button' class="nice-button no-bg-button main-font">dropdown font</button>
                    <div data-js-tag="font-choice">
                        <button class="nice-button no-bg-button pixel-1" data-font="pixel1">default pixel font</button>
                        <button class="nice-button no-bg-button arial-1" data-font="arial1">default arial font</button>
                        <button class="nice-button no-bg-button courier-new-1" data-font="couriernew1">default courier font</button>
                        <button class="nice-button no-bg-button cursive-1" data-font="cursive1">default cursive font</button>
                    </div>

                    <br></br>

                    <button class="nice-button no-bg-button main-font">focus for 30 minutes</button>

                    <br><br>

                    <button data-js-tag='toggle-theme-button' class="nice-button no-bg-button main-font">dropdown theme</button>
                    <div data-js-tag="theme-choice">
                        <button class="nice-button no-bg-button main-font">default coin theme</button>
                        <button class="nice-button no-bg-button main-font">comming soon...</button>
                    </div>

                    <br></br>

                    <button data-js-tag="exit-button" class="si-exit main-font nice-button no-bg-button">
                        <img style="width: 30px; height: 30px;" data-js-tag="close-img" src="${this.iconPath}/project/close/${this.theme}${this.imageExtension}" draggable="false"></img>
                    </button>
                </div>
            </div>
        `;

        this.findElements();
        this.setupElements();
    }

    findElements(){
        this.toggleElement = this.querySelector("[data-js-tag='settings-toggle']");
        this.holderElement = this.querySelector("[data-js-tag='settings-holder']");
        this.holderElementChild = this.holderElement.children[0];
        
        this.toggleButton = this.toggleElement.querySelector("[data-js-tag='settings-toggle-button']");

        this.fontToggleButton = this.holderElement.querySelector("[data-js-tag='toggle-font-button'");
        this.fontChoices = this.holderElement.querySelector("[data-js-tag='font-choice']");
        this.themeToggleButton = this.holderElement.querySelector("[data-js-tag='toggle-theme-button'");
        this.themeChoices = this.holderElement.querySelector("[data-js-tag='theme-choice']");

        this.exitButton = this.querySelector("[data-js-tag='exit-button']");
    }

    setupElements(){
        console.log(this.toggleButton);
        //this.mainToggle = new SimpleToggle(this.toggleButton, [this.holderElement]);
        this.mainToggle = new Toggle(this.toggleButton, [this.holderElementChild], "slow-hide", "settings");
        //make it use slow hide rather than hide class
        //this.mainToggle.setupToggle();

        this.fontToggle = new SimpleToggle(this.fontToggleButton, [this.fontChoices]);
        this.fontToggle.setupToggle();

        this.themeToggle = new SimpleToggle(this.themeToggleButton, [this.themeChoices]);
        this.themeToggle.setupToggle();

        this.exitButton.addEventListener("click", () => {
            this.mainToggle.toggleEvent();
        });

        this.setupFontSetting();
    }


    setupFontSetting(){
        this.toggleButtons = this.fontChoices.childNodes;
        this.toggleButtons.forEach(toggleButton => {
            toggleButton.addEventListener("click", () => {fontChange(toggleButton.getAttribute("data-font"));});
        });
    }
}

customElements.define("ttc-settings", TTCSettings);