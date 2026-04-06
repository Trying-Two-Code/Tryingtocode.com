import { timeSince } from "../tools.js";

window.youtubePopup = null;

export let timeSinceUserInWindow = 0;
export let userInWindow = true;

document.addEventListener("visibilitychange", () => {
    console.log( document.hidden, window.inYoutubePopup );
});

window.addEventListener('focus', () => {
    console.log("window is active!");
    userInWindow = true;
    updateTimeSinceUserInWindow();
});

window.addEventListener('blur', () => {
    console.warn("window is not active!");
    userInWindow = false;
    updateTimeSinceUserInWindow();
});

export let updateTimeSinceUserInWindow = () => {
    if(userInWindow) {
        timeSince("userInWindow", 0);
        return 0;
    }
    timeSinceUserInWindow += timeSince("userInWindow", 0);
    return timeSinceUserInWindow;
}


window.TTC.events = window.TTC?.events || new EventTarget();
window.TTC.events.addEventListener("newYoutubePopup", (popup) => {
    //I don't think this can possibly work. The hope here is that when the user has (firefox cross origin enabled)
    //and in order to watch a youtube tutorial must use the window.open feature, they will not be counted
    //as away from the application.
  /*  popup.addEventListener("visibilitychange", () => {

    });
    popup.addEventListener('focus', () => {

    });
    popup.addEventListener('blur', () => {

    });*/
});

//document.hasFocus();