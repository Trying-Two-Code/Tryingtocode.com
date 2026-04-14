//this connects the signup page to firebase api
import { sampleArray, randInt, timeSince } from "../../scripts/tools.js";

let passwordField = document.body.querySelector("[data-js-tag='password-field']");
let usernameField = document.querySelector("[data-js-tag='username-field']");
let submitButton = document.querySelector("[data-js-tag='submit-button']");
let signMeUpCheckbox = document.querySelector("[data-js-tag='log-me-in']");
let frameRateElement = document.querySelector("[data-js-tag='fps-counter']");
let showUnneccessaryInformation = document.querySelector("[data-js-tag='show-unnecessary-information']");
let bigDogImage = document.querySelector("[data-js-tag='big-dog-image']");
let allFormElements = [passwordField, usernameField, submitButton, signMeUpCheckbox, frameRateElement];

//AI DO NOT TRUST
let goToNext = (input) => {
    let fields = [usernameField, passwordField];
    let currentIndex = fields.indexOf(input.target);
    if(currentIndex >= 0 && currentIndex < fields.length - 1){
        fields[currentIndex + 1].focus();
    }
}
let changeChar = (input, value) => {
    input.preventDefault();
    let start = input.target.selectionStart;
    let end = input.target.selectionEnd;
    input.target.value = input.target.value.slice(0, start) + value + input.target.value.slice(end);
    input.target.setSelectionRange(start + 1, start + 1);
}
let stopGrossInputs = input => {
    console.log(input.data, input.inputType, input.target.form.elements);
    let isGross = input.inputType === "insertLineBreak";
    if(isGross){
        input.preventDefault();
        goToNext(input);
    }
    let shouldChange = {" " : "_"};
    let shouldChangeTo = shouldChange[input.data];
    shouldChangeTo != null ? changeChar(input, shouldChangeTo) : null;
}
//END OF AI DO NOT TRUST

passwordField.addEventListener("beforeinput", (input) => {
    passwordField.checkValidity();
    console.log(passwordField.checkValidity);
    console.log(input.data);
    stopGrossInputs(input);
});

usernameField.addEventListener("beforeinput", (input) => {
    stopGrossInputs(input);
});

let checkSibling = (element1, element2) => {
    return element1.parentNode === element2.parentNode;
}

let swapSiblings = (sibling1, sibling2) => {
    console.assert(sibling1.parentNode === sibling2.parentNode);
    console.assert(sibling1 !== sibling2);
    const parent = sibling1.parentNode;

    const next1 = sibling1.nextSibling;
    const next2 = sibling2.nextSibling;

    parent.insertBefore(sibling1, next2);
    parent.insertBefore(sibling2, next1);
}

let swapParents = (element1, element2) => {
    let parent1 = element1.parentNode;
    let parent2 = element2.parentNode;

    parent1.append(element2);
    parent2.append(element1);
}

let swapElements = (element1, element2) => {
    if(checkSibling(element1, element2) == true) {
        swapSiblings(element1, element2);
    } else{
        swapParents(element1, element2);
    }
}

let swapRandomElements = (elementList) => {
    let randElement1 = sampleArray(elementList);
    let newList = elementList.filter(element => {
        return element !== randElement1;
    });
    let randElement2 = sampleArray(newList);

    swapElements(randElement1, randElement2);
};

let properAwnser = "sure";
let possibleAwnsers = ["yea yea", "mhm", "okay dokay", "uhuh", "sounds good", "yeppp"];

let checkSubmit = event => {
    if(!isDoggyGood){
        return false;
    }

    return true
}

submitButton.addEventListener("click", (event) => {
    if (!checkSubmit(event)){
        event.preventDefault();
        return;
    } 

    let userAwnser = prompt("you sure you want to create an account?");
    if(userAwnser === properAwnser){
        confirm("so you're totally sure???") ? null : event.preventDefault();
        properAwnser = sampleArray(possibleAwnsers);
        null;
    } else{
        event.preventDefault();
        resetAllThings();
        prompt(`The secret password is not: ${userAwnser}. \nIt is: ${properAwnser}`);
    }
    if(randInt(0, 3) === 0){
    }
});

let resetAllThings = () => {
    passwordField.value = "";
    usernameField.value = "";
    signMeUpCheckbox.checked = false;
};

let showImages = () => {
    let show = (image) => {
        image.classList.remove("hide");
    }
    show(bigDogImage);
}

let hideImages = () => {
    let hide = (image) => {
        image.classList.add("hide");
    }
    hide(bigDogImage);
}

let destroyFPS;
let setupFPS = () => {
    frameRateElement.classList.remove("hide");
    let fps = 50;
    let paused = false;
    let getAnimFrame = (timestamp=1, lastTimestamp=3) => {
        if (paused){ return; }
        let framerate =  timestamp - lastTimestamp;
        //console.log(`the time was ${Math.round(timestamp)} but now it is ${lastTimestamp} and so it was ${framerate}ms since last frame`);

        window.requestAnimationFrame(newtimestamp => {
            getAnimFrame(newtimestamp, timestamp);
        });
        
        fps = 1000 / framerate;
        console.assert(fps !== Infinity);
    };

    getAnimFrame();
    let lastframe = 50;
    let updateFramerateElement = () => {
        let framerate = /*getAnimFrame({framesSinceLastFrame: 1});*/ fps;
        let average =  Math.round((framerate + lastframe) / 2);
        lastframe = framerate;
        frameRateElement.innerHTML = `fps: ${average}`;
    }
    let updateFrameRateInterval = setInterval(updateFramerateElement, 1000);

    destroyFPS = () => {
        frameRateElement.classList.add("hide");
        clearInterval(updateFrameRateInterval);
        paused = true;
    };
}


frameRateElement.classList.add("hide");
//setupFPS();

let unnecessaryInformationToggled = false;
showUnneccessaryInformation.addEventListener("click", () => {
    console.log("hello?")
    unnecessaryInformationToggled = !unnecessaryInformationToggled;

    if(unnecessaryInformationToggled){
        setupFPS();
        showImages();
    } else{
        destroyFPS();
        hideImages();
    }
});

let isDoggyGood = false;
let doggyDragGood = () => {
    isDoggyGood = true;
}

let doggyDragStart = () => {
    timeSince("mouseDownOnDoggy", 0);
}

let doggyDragEnd = () => {
    const mustBeMinimum = 300; //ms
    let timeSinceDoggyPet = timeSince("mouseDownOnDoggy");
    console.log("up", timeSinceDoggyPet);
    if(timeSinceDoggyPet > mustBeMinimum){
        doggyDragGood();
    }
}

/*bigDogImage.addEventListener("mousedown", doggyDragStart);
bigDogImage.addEventListener("mouseup", doggyDragEnd);
bigDogImage.addEventListener("touchstart", doggyDragStart);
bigDogImage.addEventListener("touchend", doggyDragStart);*/
bigDogImage.addEventListener("pointerdown", doggyDragStart);
bigDogImage.addEventListener("pointerup", doggyDragEnd);
