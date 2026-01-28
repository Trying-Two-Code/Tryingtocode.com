import { CoinObj } from "./coin-obj.js";
import { getUserData, setUserDatapoint, increaseCoins } from "../firebase.js";

/**
 * This script is meant to tell the canvas to draw coins
 * and to handle when to create coins
 */


let counter = document.getElementById("coin-counter");

let canvas = document.getElementById('render-canvas');

const coinImgSrc = '../components/art/ttc coin icon.png';
let objects = [];

let localCoinCount = parseInt(localStorage.getItem("coin")) || 0;

let getUserCoins = async () => {
    let userData = await getUserData(window.user);

    if(userData == null || userData.coins == null) { return 0; }
    localCoinCount = userData.coins;

    return userData.coins;
}

let printCoins = async () => {
    let coins = await getUserCoins()
    console.log("USER COINS = ", coins);
}
printCoins();

let collectCoin = (coinElement, worth=1) => {
    objects = objects.filter(e => e !== coinElement);
    incrimentDisplayNumber(worth);
}

let drawAll = (sizeX=300, sizeY=300) => {
    let drawOne = element => {
        element.RenderImage(coinImgSrc);
        element.tick(.1);
        element.gravitate(counter);
        let gt_rect = counter.getBoundingClientRect();
        if(element.collectedCoin === true){
            collectCoin(element);
        }
    }

    ctx.clearRect(0, 0, sizeX, sizeY);
    objects.forEach(drawOne);
    window.requestAnimationFrame(drawAll);
}

if(canvas){
    var ctx = canvas.getContext('2d');
    var title = document.getElementById("main-title");

    window.addEventListener('correctCode', (details) => {
        getCoin(details.detail.value, counter, title);
        changeNumber(details.detail.value);
    });

    window.requestAnimationFrame(drawAll);
}

export let getCoin = (amm, go_to, startElementPos, startString = '') => {
    for (let index = 0; index < amm; index++) {
        let clientRect = startElementPos.getBoundingClientRect();
        let coinObj = new CoinObj(
            go_to,
            clientRect.left + window.scrollX,
            clientRect.top + window.scrollY,
            Math.random() * 10,
            Math.random() * 10,
            canvas,
            ctx,
            coinImgSrc
        );
        objects.push(coinObj);
    }
}

let updateDisplayNumber = (updatedNumber, startString) => {
    let currentCoins = updatedNumber;

    if (counter != null){
        counter.innerHTML = startString + currentCoins;
    }
}

let subtractString = (a, b) => {
    let start = a.indexOf(b);
    let end = start + b.length;

    return a.substring(0, start - 1) + a.substring(end);
}

let incrimentDisplayNumber = (amm=1, startString='') => {
    let currentCoins = parseInt(subtractString(counter.innerHTML, startString));
    let newCoins = currentCoins + amm;

    updateDisplayNumber(newCoins, startString);
}

export let changeNumber = (amm, startString='') => {
    let currentNumber = localStorage.getItem("coin");
    let updatedNumber = String(parseInt(currentNumber) + amm);

    let changeNumber = (updatedNumber) => {
        localStorage.setItem('coin', updatedNumber);
        increaseCoins(amm);
        console.log("set user coins");
    }

    changeNumber(updatedNumber);
}

updateDisplayNumber(0, '');

let initDisplay = async () => {
    let coins = await getUserCoins();
    console.log("coins = ", coins);
    updateDisplayNumber(coins, '');
}

window.addEventListener("user_set", async () => {
    await initDisplay();
});