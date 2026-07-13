import { getUserData } from "./firebase-backend/firebase.js";

const coinDisplay = document.getElementById("coin-display");

window.addEventListener("user_made", async () => {
    let coinamm;
    let data = await getUserData();

    coinamm = data.coins;
    
    if(typeof coinamm === "string" || typeof coinamm === "number"){
        coinDisplay.innerHTML = `you have: ${coinamm} <img class="tiny-img" src="./components/visuals/logos/coin/pixel-1.png"></img>`;
    } else{
        coinDisplay.innerHTML = `please contact support: EC01`;
    }
});