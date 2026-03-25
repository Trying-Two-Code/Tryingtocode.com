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
    return player;
}

let done = false;
let onPlayerStateChange = (event) => {
    console.log(event.target);
}
let onPlayerReady = (event) => {
    let video = findVideo(event.target.ttcId);
    video.playerReady();
    //let video = findVideo(event.target.)
}
let stopVideo = () => {
    player.stopVideo();
}


//stuff for outside access:
class youtubeVideo{
    constructor(VId){
        this.id = VId;
    }
    setupVideo(){
        this.playVideo();
    }
    playVideo(){
        //starts a new video
        let player = startVideo(this.id);
        player.ttcId = this.id;
        this.player = player;
    }
    playerReady(){
        //called by player when it is ready to rumble
        console.log("IT IS WORKING!", this.id);
        this.player.playVideo();
    }
    stopVideo(){
        //hides and destroys video
        this.player.stopVideo();
    }
    pauseVideo(){
        //stops video from playing
    }
    unpauseVideo(){
        //starts up a paused video where user left of
    }
}

let videos = []
window.startVideo = (VId=videoId) => { 
    newVideo = new youtubeVideo(VId);
    newVideo.setupVideo();
    videos.push(newVideo);
    console.log(videos);
}
let findVideo = (VId=videoId) => {
    for (let index = 0; index < videos.length; index++) {
        const checkVideo = videos[index];
        console.log(checkVideo.id, VId);
        if(checkVideo.id == VId){
            return checkVideo;
        }
    }
    return null;
}
window.stopVideo = (VId=videoId) => {
    let video = findVideo(VId);
    video.stopVideo();
}