//this allows the page to show and control youtube videos with the youtube api
//review https://developers.google.com/youtube/iframe_api_reference

const width = 0;
const height = 0;

let videoId = "5YcsjQ2VrrU";

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

let firstScriptTag = document.getElementsByTagName('script')[0];
console.log(firstScriptTag);
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

console.log(firstScriptTag, tag);

let player;
let playerObject;
window.youtubeReady = false;
var onYouTubeIframeAPIReady = () => {
    console.log("API READY!");
    
    console.log(player);
    window.youtubeReady = true;
    //startVideo();
}

let onPlayerReady = (event) => {
    //event.target.playVideo();
}

let startVideo = (VId = videoId) => {
    playerObject = {
        height: height,
        width: width,
        videoId: VId,
        playerVars: {
            'playsinline': 1,
            'fs': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    };
    player = new YT.Player('youtube-player', playerObject);
    player.playVideo();
}

window.startVideo = (VId=videoId) => { startVideo(VId); }

let done = false;
let onPlayerStateChange = (event) => {
    console.log(event);
    console.log(player.g);
    //player.g.requestFullscreen();
    //player.stopVideo();
}
let stopVideo = () => {
    player.stopVideo();
}