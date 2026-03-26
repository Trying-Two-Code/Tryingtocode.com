import { CoinObj } from "./coin-obj.js";
import { getUserData, setUserDatapoint, increaseCoins } from "../firebase-backend/firebase.js";

/**
 * This script is meant to tell the canvas to draw coins
 * and to handle when to create coins
 */


//let counter = document.getElementById("coin-counter");
const sidebarElement = document.querySelector("ttc-sidebar");
console.log("sidebar is ", sidebarElement);
const counter = document.querySelector("[data-js-tag='sidebar-coin-counter']");
console.log("");

let canvas = document.getElementById('learn-screen');

const coinImgSrc = `../components/visuals/sprites/coin/${window.theme}${window.imageExtension}`;
let objects = [];

let localCoinCount = parseInt(localStorage.getItem("coin")) || 0;

let getUserCoins = async () => {
    let userData = await getUserData(window.user);

    if(userData == null || userData.coins == null) { return 0; }
    localCoinCount = userData.coins;

    return userData.coins;
}

let printCoins = async () => {
    let coins = await getUserCoins();
}
printCoins();

let makeCoinJuice = () => {
    let soundTheme = "pixel-1";
    let soundExtension = ".mp3";
    //                       components/sounds/sfx/coin-collect/pixel-1.mp4 404
    //                       components\sounds\sfx\coin-collect\pixel-1.mp3
    let coinSoundSrc = `./../components/sounds/sfx/coin-collect/${soundTheme}${soundExtension}`;
    let coinAudio = new Audio(coinSoundSrc);
    coinAudio.volume = .1;
    coinAudio.play();
}

let collectCoin = (coinElement, worth=1) => {
    objects = objects.filter(e => e !== coinElement);
    makeCoinJuice();
    if (worth > 0) {incrimentDisplayNumber(worth)};
}

let drawAll = (sizeX=300, sizeY=300) => {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    let drawOne = element => {
        let counter = sidebarElement.coinCounter;
        element.RenderImage(coinImgSrc);
        element.tick(.3);
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
        let startElement = window.currentDisplay.output;
        getCoin(details.detail.value, sidebarElement.coinCounter/*, startElement*/);
        changeNumber(details.detail.value);
    });

    window.requestAnimationFrame(drawAll);
}

let center = (clientRect, isVerticle) => {
    return  clientRect.top;
    if(isVerticle) return (- clientRect.top + clientRect.bottom) / 2;
    return (- clientRect.left + clientRect.right) / 2;
}

let mousePos = {x: 0, y: 0};

window.addEventListener('mousemove', (event) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
});

export let getCoin = (amm, go_to, startElementPos=null, startString = '') => {
    let clientRect;
    let gotoX;
    let gotoY;
    if(startElementPos){
        clientRect = startElementPos.getBoundingClientRect();
        gotoX = (center(clientRect, 0) + window.scrollX);
        gotoY = (center(clientRect, 1) + window.scrollY);
    } else {
        gotoX = mousePos.x;
        gotoY = mousePos.y;
    }

    let spreadVelocity = 40;
    let spreadPosition = 0;

    for (let index = 0; index < amm; index++) {
        let xSpread = (Math.random() * spreadPosition) / 10;
        let ySpread = (Math.random() * spreadPosition) / 10;
        let coinObj = new CoinObj(
            go_to,
            gotoX + xSpread,
            gotoY + ySpread,
            Math.random() * spreadVelocity,
            Math.random() * spreadVelocity,
            canvas,
            ctx,
            coinImgSrc
        );
        objects.push(coinObj);
    }
}

let updateDisplayNumber = (updatedNumber, startString) => {
    try{
        sidebarElement.updateDisplayNumber(updatedNumber, startString);
    } catch (error) {
        console.log("no sidebar element yet. ", error);
    }
    /*let currentCoins = updatedNumber;

    if (counter != null){
        counter.innerHTML = startString + currentCoins;
    }*/
}

let subtractString = (a, b) => {
    let start = a.indexOf(b);
    let end = start + b.length;

    return a.substring(0, start - 1) + a.substring(end);
}

let incrimentDisplayNumber = (amm=1, startString='') => {
    let currentCoins = parseInt(subtractString(sidebarElement.coinCounter.innerHTML, startString));
    let newCoins = currentCoins + amm;

    updateDisplayNumber(newCoins, startString);
}

export let changeNumber = (amm, startString='') => {
    let currentNumber = localStorage.getItem("coin");
    let updatedNumber = String(parseInt(currentNumber) + amm);

    let changeNumber = (updatedNumber) => {
        localStorage.setItem('coin', updatedNumber);
        increaseCoins(amm);
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