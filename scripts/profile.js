let profileHeader = document.querySelector("[data-js-tag='profile-header']");

window.addEventListener("user_set", () => {
    profileHeader.innerHTML = `Hey! You're: ${window.user.email}`;
});

setTimeout(()=>{
    if(profileHeader.innerHTML == "Hey! You're: ..."){
        profileHeader.innerHTML = `error... 45890a23`;
    }
}, 10000)