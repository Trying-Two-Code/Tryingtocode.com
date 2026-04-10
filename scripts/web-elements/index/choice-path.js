//for all the choices one must make in ./../index.html

let innerHTML = `
<div class="hide welcome--demo">
    <a href="/learn">
        <img class="nice-button" src="./components/visuals/icons/sidebar/learn/pixel-1.png" alt="start learning now">
    </a>
    <br></br>
    <a href="/looking">
        <img class="nice-button" src="./components/visuals/icons/sidebar/learn/pixel-1.png" alt="start learning now">
    </a>
    <!--a href="/learn">is this the place for me?</a-->
</div>
`;

class TTCChoicePath extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        console.log("hello?");
        this.init();
    }
    init(){
        this.makeElement();
    }
    makeElement(){
        this.innerHTML = `
<div class="hide welcome--demo" data-js-tag="main-choice-path-container">
    <!--a href="/learn">
        <img class="nice-button" src="./components/visuals/icons/sidebar/learn/pixel-1.png" alt="start learning now">
    </a>
    <br></br>
    <a href="/looking">
        <img class="nice-button" src="./components/visuals/icons/sidebar/learn/pixel-1.png" alt="start learning now">
    </a-->
</div>
        `;
        this.mainPathContainer = this.querySelector("[data-js-tag='main-choice-path-container']");
        this.makePaths();

        /*this.pathElement = `
<a href="/learn">
    <img class="nice-button" src="./components/visuals/icons/sidebar/learn/pixel-1.png" alt="start learning now">
</a>
<br></br>
        `;*/
    }

    makePaths(){
        const imgSrcStart = "./components/visuals/icons/sidebar";

        let paths = this.getAttribute("data-choices");
        let pathList = paths.split(" ");
        console.log("paths are equal to: ", pathList);

        pathList.forEach(path => {
            let imgSrc = `${imgSrcStart}/${path}/${window.TTC.theme}${window.TTC.imageExtension}`;
            this.makePathElement(path, imgSrc);
        });
    }

    makePathElement(hrefPath, imgSrc){
        console.log(hrefPath, imgSrc);
        let link = document.createElement("a");
        let img = document.createElement("img");
        let br = document.createElement("br");

        this.mainPathContainer.appendChild(link);
        link.appendChild(img);
        this.mainPathContainer.appendChild(br);

        link.href = hrefPath;
        img.src = imgSrc;
        img.alt = "start learning now";
        img.classList.add("nice-button", "normal-img");
    }
}

console.log("setting ttc-choice-path");
customElements.define("ttc-choice-path", TTCChoicePath);