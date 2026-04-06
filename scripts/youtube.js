//this allows the page to show and control youtube videos with the youtube api
//review https://developers.google.com/youtube/iframe_api_reference

console.log("for some reason, the page isn't cross origin isolated, that means we can have more functionality: ");

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

if(crossOriginIsolated){
    console.log("youtube don't work normal if cross origin isolated.");
    console.log("well it does, just it don't work reallll nice.");

    

    let defaultDimensions = {height: 200, width: 300};
    let youtubePlayerParent;
    console.log(youtubePlayerParent);

    let startVideo = (VId = videoId, dimensions = defaultDimensions) => {
        playerObject = {
            height: dimensions.height,
            width: dimensions.width,
            videoId: VId,
            playerVars: {
                'playsinline': 1,
                'fs': 1,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0
            }
        };
        player = document.createElement("ttc-simple-video");
        player.init(playerObject);

        //firstScriptTag.appendChild(player);
        youtubePlayerParent = youtubePlayerParent || document.getElementById("youtube-player");
        youtubePlayerParent.appendChild(player);
    
        return player;
    }

    class SimpleVideo extends HTMLElement{
        constructor(){
            super();
        }
        init(playerObject){
            this.playerObject = playerObject;
            this.initLooks();
            this.findElements();
            this.createIframeProperties(
                this.playerObject.videoId,
                {height: this.playerObject.height, width: this.playerObject.width}
            );
            this.linkToYoutube();
        }
        initLooks(){

            this.innerHTML = `
            <div class="column-container">
                <button class="nice-button no-bg-button main-font">
                    <img alt="x" src="./components/visuals/icons/project/close/${window.TTC.theme}${window.TTC.imageExtension}"></img>
                </button>
                <button class="nice-button no-bg-button main-font">
                    <a data-js-tag="link-to-youtube">
                        <img width="24px" height="24px" alt="go to source ->" src="./components/visuals/icons/popup/help-beginner/goto/${window.TTC.theme}${window.TTC.imageExtension}"></img>
                    </a>
                </button>
            </div>
            <iframe></iframe>`;


        }

        findElements(){
            this.iframe = this.querySelector("iframe");
            this.youtubeLink = this.querySelector(`[data-js-tag="link-to-youtube"]`);
        }


        createIframeProperties(VId, dimensions){
            this.source = `https://www.youtube.com/embed/${VId}`;

            this.iframe.width = dimensions.width;
            this.iframe.height = dimensions.height;
            this.iframe.src = this.source;
            this.iframe.title = "Youtube Video Player";
            this.iframe.setAttribute("frameborder", "0");
            this.iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ;
            this.iframe.referrerpolicy = "strict-origin";
            //this.iframe.sandbox = "allow-scripts";
            this.iframe.allowFullscreen = true;
            this.iframe.loading = "lazy";
            this.iframe.setAttribute("credentialless", "");

            this.isLoaded = false;
            this.iframe.onerror = () => { console.log("error"); this.errorLoading(); };
            this.iframe.onload = () => { this.loaded(); };
            this.detectError();

        }

        linkToYoutube(){
            this.youtubeLink.href = this.source;
            this.youtubeLink.target = "_blank";
        }

        checkIframeEnd(){
            this.iframe.on
        }

        errorLoading(){
            console.log("Use Youtube Page Instead!");
            this.innerHTML = `
            <a href=${this.source} target="_blank" data-js-tag="link-to-youtube">
                <p class="main-font">Click here to go to video on seperate tab.</p>
            </a>
            `;
            this.youtubeLink = this.querySelector(`[data-js-tag="link-to-youtube"]`);
            this.linkToYoutube();
            const width = 480;
            const height = 270;
            const left = window.screenX + window.innerWidth - width - 20;
            const top = window.screenY + 20;
            window.open(
                `${this.source}?autoplay=1`,
                'PiPWindow',
                `width=${width},height=${height},top=${top},left=${left},alwaysOnTop=yes,toolbar=no,menubar=no,scrollbars=no,resizable=no`
            );
        }

        loaded(){
            this.isLoaded = true;
            console.log("yahoo! No I mean yipee not the browser.");
            // made by chatgpt, do not trust, only for debugging purposes.
            try {
                // if blocked by COEP, this will fail or be unusable
                const win = iframe.contentWindow;
                if (!win || window.crossOriginIsolated) {
                    console.warn("iframe likely blocked by COEP / crossOriginIsolated");
                } else {
                    console.log("iframe loaded normally");
                }
            } catch (e) {
                console.warn("iframe access failed (COEP block)", e);
            }
            // end of chatgpt
        }

        detectError(){
            //if it hasn't loaded in - detectInTime - seconds, then just give up.
            const detectInTime = 4;

            let detect = () => {
                if(!this.isLoaded){
                    this.errorLoading();
                }
            }

            this.errorTimeout = setTimeout(() => {
                detect();
            }, detectInTime * 1000);
        }
    }
    customElements.define("ttc-simple-video", SimpleVideo);

    let videos = [];

    window.startVideo = (VId=videoId) => { 
        console.log(VId);
        newVideo = startVideo(VId);
        videos.push(newVideo);
        console.log(videos);
    };
    let findVideo = (VId=videoId) => {
        for (let index = 0; index < videos.length; index++) {
            const checkVideo = videos[index];
            console.log(checkVideo.id, VId);
            if(checkVideo.id == VId){
                return checkVideo;
            }
        }
        return null;
    };
    window.stopVideo = (VId=videoId) => {
        let video = findVideo(VId);
        video.stopVideo();
    };

} else{
    var onYouTubeIframeAPIReady = () => {
        console.log("API READY!");
        
        console.log(player);
        window.youtubeReady = true;
        //startVideo();
    }


    let startVideo = (VId = videoId, dimensions = {height: 200, width: 300}) => {
        console.log(dimensions.height, dimensions.width);
        playerObject = {
            height: dimensions.height,
            width: dimensions.width,
            videoId: VId,
            playerVars: {
                'playsinline': 1,
                'fs': 1,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0
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
        let video = findVideo(event.target.ttcId);
        video.playerStateChange(event);
    }
    let onPlayerReady = (event) => {
        let video = findVideo(event.target.ttcId);
        video.playerReady();
    }
    let stopVideo = () => {
        player.stopVideo();
    }


    //stuff for outside access:
    class youtubeVideo{
        constructor(VId){
            this.id = VId;
            this.ratio = 16 / 9;
            this.dimensions = {height: 200, width: 200 * this.ratio};
        }
        setupVideo(){
            this.playVideo();
            console.log("playing video now.");
        }
        playVideo(d){
            //starts a new video
            let player = startVideo(this.id, this.dimensions);
            player.ttcId = this.id;
            this.player = player;
        }
        playerReady(){
            //called by player when it is ready to rumble
            this.player.playVideo(this.dimensions);
        }
        playerStateChange(event){
            if(event.data === 0){
                this.videoEnded();
            }
        }
        videoEnded(){
            this.stopVideo();
        }
        stopVideo(){
            //hides and destroys video
            this.player.stopVideo();
            this.player.destroy();
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
        console.log(VId);
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
}
