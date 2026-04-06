window.inYoutubePopup = false;

document.addEventListener("visibilitychange", () => {
  console.log( document.hidden, window.inYoutubePopup );  
});

window.addEventListener('focus', () => {
 console.log("window is active!" );
});

window.addEventListener('blur', () => {
  console.warn("window is not active!" );
});

function checkDocumentFocus() {
  if (document.hasFocus()) {
    log.textContent = "This document has focus.";
    body.style.background = "white";
  } else {
    log.textContent = "This document does not have focus.";
    body.style.background = "gray";
  }
}