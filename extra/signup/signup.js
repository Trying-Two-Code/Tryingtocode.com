//this connects the signup page to firebase api
import { signUp } from "../../scripts/firebase-backend/firebase.js";
import { makeSpaceship } from "./spaceship.js";
import { sampleArray, randInt, timeSince } from "../../scripts/tools.js";

let passwordField = document.body.querySelector("[data-js-tag='password-field']");
let usernameField = document.querySelector("[data-js-tag='username-field']");
let emailField = document.querySelector("[data-js-tag='email-field']");
let addressField = document.querySelector("[data-js-tag='address-field']");
let userSeeErrors = document.querySelector("[data-js-tag='user-see-errors']");
let submitButton = document.querySelector("[data-js-tag='submit-button']");
let signMeUpCheckbox = document.querySelector("[data-js-tag='log-me-in']");
let frameRateElement = document.querySelector("[data-js-tag='fps-counter']");
let showUnneccessaryInformation = document.querySelector("[data-js-tag='show-unnecessary-information']");
let bigDogImage = document.querySelector("[data-js-tag='big-dog-image']");
let swapElementButton = document.querySelector("[data-js-tag='swap-elements']");
let genderInputInformation = document.querySelector("[data-js-tag='gender-input-information']");
let genderInputInfoParent = genderInputInformation.parentElement;
let stopShowingProgressElement = document.querySelector("[data-js-tag='dont-show-progress']");
let stayLoggedInCheckbox = document.querySelector("[data-js-tag='stay-logged-in']");
let spaceshipCheckbox = document.querySelector("[data-js-tag='spaceship-input-information']")
let allFormElements = [passwordField, usernameField, submitButton, signMeUpCheckbox, frameRateElement, swapElementButton, genderInputInformation];

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

addressField.addEventListener("beforeinput", (input) => {
    addressField.checkValidity();
    stopGrossInputs(input);
});

let enlarge = (element) => {
    element.classList.add("enlarge");

    let dislarge = () => {
        element.removeEventListener("mouseout", dislarge);
        element.classList.remove("enlarge");
    }

    element.addEventListener("mouseout", dislarge);
}

let horriblePassword = false;

passwordField.addEventListener("mouseover", (input) => {
    if(horriblePassword){
        enlarge(swapElementButton);
    }
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
        window.alert("please pet the puppy");
        resetAllThings();
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
        let reSubmit = confirm("for added security, would you like to re-submit all information?");
        if(reSubmit){
            resetAllThings();
            event.preventDefault();
        }
    } else{
        event.preventDefault();
        resetAllThings();
        prompt(`The secret password is not: ${userAwnser}. \nIt is: ${properAwnser}`);
    }
    if(randInt(0, 3) === 0){
        properAwnser = sampleArray(possibleAwnsers);
    }

    if(event.defaultPrevented){
        console.log("oof");
    } else{
        gatherAndSignup();
        event.preventDefault();
    }
});

swapElementButton.addEventListener("click", (event) => {
    swapRandomElements(allFormElements);
    event.preventDefault();
});

let resetAllThings = () => {
    passwordField.value = "";
    usernameField.value = "";
    signMeUpCheckbox.checked = false;

    let destroyUnneccessaryInfo = () => {
        showUnneccessaryInformation.checked = false;
        toggleUnnecessary();
        destroyFPS();
        unnecessaryInformationToggled = !unnecessaryInformationToggled;
    }

    destroyUnneccessaryInfo();
};

let toggleUnnecessary = (to=true) => {
    const hideClass = "hide";

    let show = (image) => {
        console.assert(image.classList.contains(hideClass));
        image.classList.remove(hideClass);
    }
    let hide = (image) => {
        image.classList.add(hideClass);
    }
    let toggle = (element, toggleTo=to) => {
        toggleTo ? show(element) : hide(element);
    }

    toggle(bigDogImage);
    toggle(swapElementButton);
    toggle(genderInputInfoParent);
    toggle(addressField.parentElement);
    toggle(stopShowingProgressElement.parentElement);
    toggle(emailField.parentElement);
    toggle(userSeeErrors);
    toggle(spaceshipCheckbox.parentElement);
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

let destroyUserSeeErrors;
let setupUserSeeErrors = () => {
    let errorMade = (error) => {
        console.log(`error messege: `, error);
        userSeeErrors.innerHTML = error.message;
    }
    window.addEventListener("error", error => {errorMade(error)});

    destroyUserSeeErrors = () => {
        window.removeEventListener("error", error => {errorMade(error)});
    }
}

let unnecessaryInformationToggled = false;
showUnneccessaryInformation.addEventListener("click", () => {
    unnecessaryInformationToggled = !unnecessaryInformationToggled;

    if(unnecessaryInformationToggled){
        horriblePassword = true;
        setupFPS();
        setupUserSeeErrors();
        toggleUnnecessary(true);
    } else{
        horriblePassword = false;
        destroyUserSeeErrors?.();
        destroyFPS();
        toggleUnnecessary(false);
    }
});

let stopShowingProgressToggled = false;
stopShowingProgressElement.addEventListener("click", () => {
    stopShowingProgressToggled = !stopShowingProgressToggled;

    if(stopShowingProgressToggled){
        let hideAllElementsResult = toggleShowingProgress(false);
        if(hideAllElementsResult === false){
            //it was not actually toggled...
            console.log("It didn't work!");
        }
    } else{
        toggleShowingProgress(true);
    }
});

let isDoggyGood = false;
let doggyDragGood = () => {
    isDoggyGood = true;
    bigDogImage.classList.add("petme-done");
    bigDogImage.classList.remove("petme-not-done");
}

let doggyDragNotGood = () => {
    bigDogImage.classList.remove("petme-done");
    bigDogImage.classList.add("petme-not-done");
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
    } else{
        doggyDragNotGood();
    }
}

/*bigDogImage.addEventListener("mousedown", doggyDragStart);
bigDogImage.addEventListener("mouseup", doggyDragEnd);
bigDogImage.addEventListener("touchstart", doggyDragStart);
bigDogImage.addEventListener("touchend", doggyDragStart);*/
bigDogImage.addEventListener("pointerdown", doggyDragStart);
bigDogImage.addEventListener("pointerup", doggyDragEnd);

let toggleShowingProgress = (to) => {
    const siTextareaInputs = [passwordField, addressField, usernameField];
    const checkboxInputs = [showUnneccessaryInformation, genderInputInformation, signMeUpCheckbox, stopShowingProgressElement, stayLoggedInCheckbox];

    let annoyingConfirm = () => {
        window.alert("are you completely sure you want to show progress?");
        window.alert("surely sure?");
        window.alert("we warned you...");
        window.confirm("oh wait I mean to use this type");
        let confirm = window.confirm("so you are not sure?");

        if(confirm){
            confirm = window.confirm("oh.... ok, should we keep your information?");
            if(!confirm){
                resetAllThings();
            }
            return false;
        }
        return true;
    }

    let showProgress = () => {
        if(!annoyingConfirm()) {return false;}

        siTextareaInputs.forEach(textarea => {
            textarea.classList.remove("si-input-bad");
        });
        bigDogImage.classList.remove("hidden-progress");
        checkboxInputs.forEach(checkBox => {
            checkBox.classList.remove("hidden-progress");
        });
    }
    let hideProgress = () => {
        siTextareaInputs.forEach(textarea => {
            textarea.classList.add("si-input-bad");
        });
        bigDogImage.classList.add("hidden-progress");
        checkboxInputs.forEach(checkBox => {
            checkBox.classList.add("hidden-progress");
        });
    }
    return to ? showProgress() : hideProgress();
}

let gatherAndSignup = () => {
    //you should be able to call this and sign up no hastle.

    let username = usernameField.value || "guest";
    let password = passwordField.value;
    let email = emailField.value;

    console.log(signUp({email: email, password: password, username: username, setWindowUser: true}));
}

let stopMakingSpaceships;
let makeSpaceships = () => {
    let makeSpaceshipInterval = setInterval(
        makeSpaceship, 100
    )

    stopMakingSpaceships = () => {
        clearInterval(makeSpaceshipInterval);
    };
};

let spaceshipsToggled = false;
spaceshipCheckbox.addEventListener("click", () => {
    spaceshipsToggled = !spaceshipsToggled
    if(spaceshipsToggled){
        makeSpaceships();
    } else{
        stopMakingSpaceships();
    }
});