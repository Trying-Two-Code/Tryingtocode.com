import { CoinObj } from "./coinObj.js";

let userCoins = localStorage.getItem("coin") || "0";
localStorage.setItem("coin", userCoins);

let counter = document.getElementById("coin-counter");

changeNumber(0)

let canvas = document.getElementById('render-canvas');
let ctx;

const coinImgSrc = '../components/art/ttc coin icon.png';
let objects = [];

let title;
if(canvas){
    ctx = canvas.getContext('2d');
    title = document.getElementById("main-title");
    window.addEventListener('correctCode', (details) => {
        getCoin(details.detail.value, counter, title);
    });
    window.requestAnimationFrame(draw);
}

function draw(sizeX=30, sizeY=300) {
    ctx.clearRect(0, 0, sizeX, sizeY);
    objects.forEach(element => {
        element.RenderImage(ctx, coinImgSrc);
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

export function getCoin(amm, go_to, startElementPos, startString = ''){
    for (let index = 0; index < amm; index++) {
        let coinObj = new CoinObj(
            go_to, 
            startElementPos.getBoundingClientRect().left + window.scrollX, 
            startElementPos.getBoundingClientRect().top + window.scrollY, 
            Math.random() * 10, 
            Math.random() * 10, 
            canvas
        );
        objects.push(coinObj);
    }
}

export function changeNumber(amm, startString=''){
    let currentCoins = String(parseInt(localStorage.getItem("coin")) + amm);
    localStorage.setItem("coin", currentCoins);
    if (counter != null){
        counter.innerHTML = startString + currentCoins;
    }
}