//for use in index.html
import { getCoin, changeNumber} from "./coin/coin.js";
import { changeURL, timeSince } from "./tools.js";

/*const PROJECT_PARENT = document.getElementById("project-parent");

//let goto = document.getElementById("coin-go-here");
const sidebarElement = document.querySelector("ttc-sidebar");
let indexGetCoin = (amm) => {
    getCoin(amm, sidebarElement.coinCounter);
    changeNumber(0);
}

let nice = () => {indexGetCoin(10);}; //make name better

let nextPartButton = document.querySelector("[data-js-tag='next-part-button']");
let runCode = document.getElementById('welcome--demo--output-button');
let outputBox = document.getElementById("welcome--demo--output--text")
let codeContent = document.getElementById('code-content');
codeContent = `print('learn code')`;

runCode.addEventListener("click", nice, {once: true});
//runCode.addEventListener("click", () => {runCode.removeEventListener("click", nice); });

runCode.addEventListener("mousedown", () => {
    runCode.classList.add("spin");
});

runCode.addEventListener("mouseup", async() => {
    runCode.classList.remove("spin");
    /*runCode.classList.toggle("nice-button");
    runCode.classList.toggle("welcome--run-code")
    //let output = await runUserCode(codeContent)
    let output = [true, "learn code"];
    outputBox.innerHTML = output[1];
    nextPartButton.classList.remove("hide");
    nextPartButton.classList.add("smooth-appear");
    
    if(window.innerHeight > window.innerWidth){
        let firstCodeExample = document.querySelector("[data-js-tag='first-code-example']");
        firstCodeExample.classList.add("move-offscreen");
    };
});

nextPartButton.addEventListener("click", () => {
    console.log("move along");
    //runCode.classList.add("hide");
    let firstCodeExample = document.querySelector("[data-js-tag='first-code-example']");
    let secondCodeExample = document.querySelector("[data-js-tag='second-example']");
    firstCodeExample.classList.add("move-offscreen");
    secondCodeExample.classList.add("move-onscreen");
    secondCodeExample.classList.remove("hide");
    nextPartButton.classList.add("move-offscreen");
});

/*window.addEventListener("user_set", async () => {
    console.log(window.user.uid);
});*/

let heroLoadTime = 0;
const tooSlowLoadTime = 10000;

let setupHeroAnim = async () => {
    const heroImg = document.getElementById("hero-anim")
    const heroImgParent = heroImg.parentElement;
    let heroImgSrcStart = `./components/visuals/icons/index/hero/${window.TTC.theme}/sign-up--hero2-`;
    const frames = ["1", "2", "3", "4", "5"];
    let onframe = 0;
    const extension = window.TTC.imageExtension;
    let images = [];

    for (let index = 0; index < frames.length; index++) {
        const heroframe = frames[index];
        let newHeroImage = new Image();
        newHeroImage.src = heroImgSrcStart + heroframe + extension;
        newHeroImage.alt = "heroimage";

        await newHeroImage.decode();

        heroLoadTime = document.timeline.currentTime;
        console.log("hero load time = ", heroLoadTime);
        if(heroLoadTime > tooSlowLoadTime){
            console.log("too slow");
            return "too slow";
        }

        heroImgParent.appendChild(newHeroImage);
        images.push(newHeroImage);

        newHeroImage.classList.add("hide");
        newHeroImage.classList.add("hero-img");

        newHeroImage.draggable = false;
    }

    let oldHeroImage;
    

    let replaceHeroImage = (oldimage, newimage) => {
        oldimage?.classList.add("hide");
        newimage.classList.remove("hide");
    }

    let animateHero = () => {
        
        let heroframetime = timeSince("heroframemade", 1000);
        let image = images[Math.round(onframe)];
        onframe = ((onframe + (heroframetime / 150)) % (frames.length - 1)) ;
        /*
        heroImg.src = heroImgSrcStart + frames[Math.round(onframe)] + extension;
        
        */
        replaceHeroImage(oldHeroImage, image);
        oldHeroImage = image;

        window.requestAnimationFrame(animateHero);
    }

    animateHero();
    heroImg.classList.add("hide");
}

setupHeroAnim();


let callToActionButton = document.getElementById("cta-learncode-button");
let callToActionButtonImg = callToActionButton.getElementsByClassName("cta-image")[0];
console.log(callToActionButtonImg);

//NOTE: I am using the load time of the hero to determine if load times are too slow to render coins. This may not be ideal.
callToActionButton.addEventListener("click", async () => {
    /*try{
        console.log(callToActionButtonImg.src);
        callToActionButtonImg.src = "./components/visuals/icons/index/cta/pixel/code-button--golden-green-2.png";
        await callToActionButtonImg.decode();
    } catch(error){console.error(error);}*/

    let goToLearnPage = () => {
        changeURL({keepOtherVariables: false, newDirectory: "/learn", navigate: true});
    };

    if(heroLoadTime > tooSlowLoadTime){
        goToLearnPage();
    } else {
        getCoin(30, document.body);

        setTimeout(goToLearnPage, 3000);
    }
});
