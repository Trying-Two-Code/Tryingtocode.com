//this connects the signup page to firebase api
import { signUp } from "../../scripts/firebase-backend/firebase.js";
import { makeSpaceship } from "./spaceship.js";
import { makeSpikes } from "./spikes.js";
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
let spaceshipCheckbox = document.querySelector("[data-js-tag='spaceship-input-information']");
let spikesCheckbox = document.querySelector("[data-js-tag='spikes-input-information']");
let usertypeDropdown = document.querySelector("[data-js-tag='signup-input-acc-type']");
let weirdNamesElement = document.querySelector("[data-js-tag='weird-names']");
let weirdShapeContainer = document.querySelector("[data-js-tag='weird-shapes-container']");
let weirdShapeSelect = weirdShapeContainer.querySelector("[data-js-tag='weird-shapes-side-selection']");
let weirdShapeImage = weirdShapeContainer.querySelector("[data-js-tag='weird-shapes-image']");
let allFormElements = [passwordField, usernameField, submitButton, signMeUpCheckbox, frameRateElement, 
    swapElementButton, genderInputInformation, spikesCheckbox, usertypeDropdown, weirdNamesElement];

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

    let submitNoGood = !isDoggyGood || !usertypeDropdownWasPressed || !spikesToggled || !spaceshipsToggled ||
    !stopShowingProgressToggled || !genderToggled || weirdShapeSelectAwnser;

    if(submitNoGood){
        window.alert("please complete all steps");
        if(randInt(0, 10) === 9){
            window.alert("all data will be deleted for security reasons");
            window.alert("just kidding.");
        }
        resetAllThings();
        return false;
    }

    return true
}

let genderToggled = false;
genderInputInformation.addEventListener("click", () => {
    genderToggled = !genderToggled;
})

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
    };
    let hide = (image) => {
        image.classList.add(hideClass);
    };
    let toggle = (element, toggleTo=to) => {
        toggleTo ? show(element) : hide(element);
    };

    toggle(bigDogImage);
    toggle(swapElementButton);
    toggle(genderInputInfoParent);
    toggle(addressField.parentElement);
    toggle(stopShowingProgressElement.parentElement);
    toggle(emailField.parentElement);
    toggle(userSeeErrors);
    toggle(spaceshipCheckbox.parentElement);
    toggle(signMeUpCheckbox.parentElement);
    toggle(spikesCheckbox.parentElement);
    toggle(usertypeDropdown);
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
                                       
let signUpTitle = document.querySelector("[data-js-tag='sign-up-title']")
let makeWeirdNames = () => {
    let switchName = (element, newName, field="innerHTML") => {
        let oldName = element[field];
        element[field] = newName;
        return () => {element[field] = oldName};
    }
    let switchBackTitle = switchName(signUpTitle, "initiate account creation!");
    let switchBackEmail = switchName(emailField, "electric mail service user field", "placeholder");
    let switchBackPassword = switchName(passwordField, "unique identifier certification string", "placeholder");

    let switchBackAll = () => {
        switchBackTitle();
        switchBackEmail();
        switchBackPassword();
    }
    return switchBackAll;
}

let weirdNamesActive = false;
let switchBackWeirdNames;
weirdNamesElement.addEventListener("click", () => {
    weirdNamesActive = !weirdNamesActive;
    if(weirdNamesActive){
        switchBackWeirdNames = makeWeirdNames();
    }else{
        switchBackWeirdNames();
    }
}); 
console.log("YO LOOK HERE NOW JUNE 19: ", weirdNamesElement);
//makeWeirdNames();

let toggleShowingProgress = (to) => {
    const siTextareaInputs = [passwordField, addressField, usernameField];
    const checkboxInputs = [showUnneccessaryInformation, genderInputInformation, signMeUpCheckbox, stopShowingProgressElement, stayLoggedInCheckbox, spaceshipCheckbox, spikesCheckbox];

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
            textarea?.classList.remove("si-input-bad");
        });
        bigDogImage.classList.remove("hidden-progress");
        checkboxInputs.forEach(checkBox => {
            checkBox?.classList.remove("hidden-progress");
        });
    }
    let hideProgress = () => {
        siTextareaInputs.forEach(textarea => {
            textarea?.classList.add("si-input-bad");
        });
        bigDogImage.classList.add("hidden-progress");
        checkboxInputs.forEach(checkBox => {
            console.log(checkBox);
            checkBox?.classList.add("hidden-progress");
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

let makeStopableInterval = (callback, interval=100) => {
    let intervalCallback = setInterval(
        callback, interval 
    );

    let stopInterval = () => {
        clearInterval(intervalCallback)
    }
    return stopInterval;
};

let spikesToggled = false;
let stopMakingSpikes;
spikesCheckbox.addEventListener("click", () => {
    spikesToggled = !spikesToggled;
    if(spikesToggled){
        stopMakingSpikes = makeStopableInterval(makeSpikes, 2000);
    } else{
        stopMakingSpikes();
    }
});

document.addEventListener("click", () => {
    document.body.classList.add("mild-hide");
    setTimeout(() => {
        document.body.classList.remove("mild-hide");
    }, 1);
});

let showACoupleMoreElements = () => {
    if (!window.confirm("are you sure about that choice?")){
        return false;
    }
    weirdNamesElement.parentElement.classList.remove("hide");
    weirdShapeContainer.classList.remove("hide");
}

let usertypeDropdownWasPressed = false;
usertypeDropdown.addEventListener("change", (event) => {
    console.log("user type changed!");
    usertypeDropdownWasPressed = true;
    if(!showACoupleMoreElements()){
        event.preventDefault();
    }
});

let selectWeirdImage = () => {
    const startExtension = "./image/weird-shape/";
    const awnsers = {
        "shape-1.png": "11",
        "shape-2.png": "13",
        "shape-3.png": "14",
        "shape-4.png": "10",
        "shape-5.png": "5"
    }
    const weirdImages = [
        "shape-1.png",
        "shape-2.png",
        "shape-3.png",
        "shape-4.png",
        "shape-5.png"
    ];

    let choice = sampleArray(weirdImages);
    let fullPath = startExtension + choice;
    let awnser = awnsers[choice];

    weirdShapeImage.src = fullPath;

    return awnser;
}

const weirdShapeCountAwnser = selectWeirdImage();
let weirdShapeSelectAwnser = false;
weirdShapeSelect.addEventListener("change", (event) => {
    if(weirdShapeSelect.value === weirdShapeCountAwnser) {
        weirdShapeSelectAwnser = true;
    } else{
        weirdShapeSelectAwnser = false;
    }
});