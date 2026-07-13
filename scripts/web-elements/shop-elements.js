import { changeNumber } from "../coin/coin.js";
import { getUserData, setUserDatapointWithObject } from "../firebase-backend/firebase.js";

class Shop{
    constructor(){
        this.calledFunction = [];
    }

    doubleCoin(forLength){
        let timeRightNow = Date.now();
        forLength = parseInt(forLength, 10);
        //name must equal function name
        this.changeBought("doubleCoin", timeRightNow + forLength);
        console.log(timeRightNow + forLength)
    }

    allowBrightMode(){
        //name must equal function name
        this.changeBought("allowBrightMode", true);
    }

    allowFancyFont(){
        //name must equal function name
        this.changeBought("allowFancyFont", true);
    }

    loseCoins(amm){
        changeNumber(-Math.abs(amm));
    }

    async changeBought(itemKey, itemValue){
        //name must equal function name - because - cntr f:  if(data?.bought?.[this.functionName] !== null){
        let data = await getUserData();
        
        let bought = data.bought;
        bought[itemKey] = itemValue;

        setUserDatapointWithObject({bought: bought, prioritizePayload: true});
    }

    async deleteBought(itemKey, userData = null){
        //name must equal function name - because - cntr f:  if(data?.bought?.[this.functionName] !== null){
        let data = userData || await getUserData();
        
        delete data.bought[itemKey];
        console.log("in delete func: ", data);
        setUserDatapointWithObject({bought: data.bought, prioritizePayload: true});

        return data;
    }

    async detectDeletionTime(itemKey){
        console.log("detecting deletion time of:", itemKey);
        let data = await getUserData();
        
        let detect = (key) => {
            console.log(typeof data?.bought?.[key], ": if it's a number, we'll look into it : ", key);
            if(typeof data?.bought?.[key] === "number"){
                try{
                    let expiryDate = data.bought[key];
                    console.log(expiryDate, Date.now(), expiryDate < Date.now());
                    if(expiryDate < Date.now()){
                        console.log("yes it should be deleted.");
                        return true;
                    } else{
                        console.log("nopee");
                    }
                } catch (error){
                    console.log(error);
                    return false;
                }
            } else{
                return false;
            }
        }

        if(detect(itemKey)){
            console.log("alrighty I'm attempting to delete it.");
            return await this.deleteBought(itemKey, data);
        } else{
            return data;
        }
    }
}

class TTCShopElement extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.init();
    }

    init(){
        this.initMyShop();
        this.render();
        this.findElements();
        this.setElements();
        this.elementFunctionality();
    }

    initMyShop(){
        this.myShop = new Shop();
        this.myShop.myShopElement = this;
        //this.updateCoinAmm();
    }

    render(){
        this.innerHTML = `
        <label data-js-tag="main-label" for="">double coin gain for 10 minutes</label>
        <button data-js-tag="buy-button" class="nice-bg-button nice-button main-font buy-button">
            <p data-js-tag="buy-button--pricetag">30</p>
            <img class="tiny-img" src="./components/visuals/logos/coin/pixel-1.png"></img>
        </button>`
        ;
    }

    findElements(){
        this.buyButton = this.querySelector("[data-js-tag='buy-button']");
        this.pricetag = this.querySelector("[data-js-tag='buy-button--pricetag']");
        this.mainLabel = this.querySelector("[data-js-tag='main-label']");

        this.price = this.getAttribute("data-price");
        this.labelContent = this.getAttribute("data-label");
        this.functionName = this.getAttribute("data-function");
        this.functionInput = this.getAttribute("data-function-input") || null;
        this.buyAmm = this.getAttribute("data-buy-amm");
    }

    setElements(){
        this.pricetag.innerHTML = this.price;
        this.mainLabel.innerHTML = this.labelContent;
    }

    elementFunctionality(){
        this.buyButton.addEventListener('click', () => {
            this.buy();
        });
        
        window.addEventListener("user_set", async () => {
            //this.myShop.deleteBought(this.functionName);
            console.log("USER MADE, now going through with testing.");
            let data = await this.myShop.detectDeletionTime(this.functionName);
            this.detectBought(data);
        });

    }

    async detectBought(userData = null){
        console.log(userData);
        let data = userData || await getUserData();
        console.log(data?.bought?.[this.functionName], this.functionName, data);
        if(data?.bought?.[this.functionName] !== null){
            //I've been bought before!
            console.log(this.functionName, this.buyAmm, "has been bought, and should be hidden if that was one");
            if(this.buyAmm == 1){
                console.log("cmon, hide!");
                this.hide();
                return true;
            }
        }
        return false;
    }

    async updateCoinAmm(){
        let data = await getUserData();
        console.log(data.coins);
        window.requestAnimationFrame(this.updateCoinAmm);
    }

    async buy(){
        if(await this.detectBought()){
            return true;
        }

        let canBuy = async () => {
            let data = await getUserData();
            console.log(data.coins, this.price, data.coins > this.price);
            return data.coins > this.price;
        }

        if(await canBuy()){
            this.myShop[this.functionName](this.functionInput);
            this.myShop.loseCoins(this.price);

            this.hasBought = (this?.hasBought || 0) + 1;
            if(this.hasBought >= this.buyAmm){
                this.hide();
            }
        } else{
            this.showUserError();
            console.error("for some reason, this action was rejected.");
        }
    }

    showUserError(){
        this.buyButton.classList.add("error");

        setTimeout(() => {
            this.buyButton.classList.remove("error");
        }, 1000);
    }

    hide(){
        console.log("so this is me hidding myself.");
        this.parentElement.classList.add("hide");
    }
}

customElements.define("ttc-shop-element", TTCShopElement);