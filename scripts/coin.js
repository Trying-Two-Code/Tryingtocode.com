import { CoinObj } from "./coin-obj.js";
import { setUserDatapoint } from "../firebase.js";

/**
 * This script is meant to tell the canvas to draw coins
 * and to handle when to create coins
 */

let userCoins = localStorage.getItem("coin") || "0";
localStorage.setItem("coin", userCoins);

let counter = document.getElementById("coin-counter");

let canvas = document.getElementById('render-canvas');

const coinImgSrc = '../components/art/ttc coin icon.png';
let objects = [];

let draw = (sizeX=30, sizeY=300) => {
    ctx.clearRect(0, 0, sizeX, sizeY);
    objects.forEach(element => {
        element.RenderImage(coinImgSrc);
        element.tick(.1);
        element.gravitate(counter);
        let gt_rect = counter.getBoundingClientRect();
        if(element.dead === true){
            objects = objects.filter(e => e !== element);
            changeNumber(1);
        }
    });
    window.requestAnimationFrame(draw);
}

if(canvas){
    var ctx = canvas.getContext('2d');
    var title = document.getElementById("main-title");
    window.addEventListener('correctCode', (details) => {
        console.log(details);
        getCoin(details.detail.value, counter, title);
    });
    window.requestAnimationFrame(draw);
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

export let changeNumber = (amm, startString='') => {
    let currentCoins = String(parseInt(localStorage.getItem("coin")) + amm);
    localStorage.setItem("coin", currentCoins);
    if (counter != null){
        counter.innerHTML = startString + currentCoins;
    }
    if(window.user){
        setUserDatapoint(null, null, currentCoins, null);
        console.error("Save user coin to server");
    }
}

changeNumber(0);