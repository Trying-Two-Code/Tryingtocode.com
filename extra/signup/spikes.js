/**
 * 
 */

import { randInt, sampleArray, SpriteImage, timeSince } from "./../../scripts/tools.js";
import { SpaceshipObj } from "./spaceship.js";

export class SpikesObj{

    constructor(x_pos=0, y_pos=0, x_vel=0, y_vel=0, canvas=null, ctx=null, sprite=null){
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.x_vel = x_vel;
        this.y_vel = y_vel;

        this.canvas = canvas;
        if (canvas) {
            this.originalCanvasWidth = canvas.width;
            this.originalCanvasHeight = canvas.height;
        }
        this.image = new Image();
        this.spriteImage = new SpriteImage(ctx, this.image, sprite);

        this.isRendering = true;

        this.addToStatic();
    }

    tick(scaler=1){
        this.move();

        this.x_pos += this.x_vel * scaler;
        this.y_pos += this.y_vel * scaler;

        this.RenderImage(this.sprite, 1, 0);
    }

    move(){
        let defualt_slowdown = 100; //the lower this is, the thicker the air feels
        let drag = 50000;

        let dir = {x: 1, y: 1};
        let normalized_vector = normalizeVector(dir.x, dir.y);

        let applyDrag = (velocity, normalized_vector, slowdown=defualt_slowdown) => {
            let dragged_vector = (normalized_vector / drag);

            let slowdown_factor = (drag / slowdown);
            dragged_vector = dragged_vector / (1 + slowdown_factor);

            return velocity + dragged_vector;
        }

        this.x_vel = applyDrag(this.x_vel, normalized_vector[0]);
        this.y_vel = applyDrag(this.y_vel, normalized_vector[1]);
    }

    RenderImage(sprite, frames=1, index=0){
        this.spriteImage.RenderImage(sprite, this.x_pos, this.y_pos, frames, index);
        this.detectDestruction();
    }

    detectDestruction(){
        if(this.x_pos > canvas.width){
            this.isRendering = false;
            this.reference = null;
        }
    }

    static alreadyCleared = false;
    static clearRect(){
        if(SpikesObj.alreadyCleared || SpaceshipObj.alreadyCleared){
            //console.log('only clear once buddy.');
        }else{
            SpikesObj.alreadyCleared = true;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            window.requestAnimationFrame(() => {
                SpikesObj.alreadyCleared = false;
            });
        }
    }

    addToStatic(){
        SpikesObj.allSpikes.push(this);
        SpikesObj.renderAllSpikes();
    }

    static allSpikes = [];
    static isRendering = true;
    static renderAllSpikes(){
        SpikesObj.clearRect();

        let allSpikes = SpikesObj.allSpikes;
        let deltaTime = timeSince("spiketick", 1);
        allSpikes.forEach(spike => {
            spike.tick(.0001 * deltaTime);
        });

        SpikesObj.scaleCTX();

        if(!SpikesObj.isRendering){ return; }

        SpikesObj.isRendering = false;
        window.requestAnimationFrame(() => {
            SpikesObj.isRendering = true;
            SpikesObj.renderAllSpikes();
        });
    }

    static scaleCTX(){
        let widthSame = ctx.canvas.width === window.innerWidth;
        let heightSame = ctx.canvas.height === window.innerHeight;
        if(!widthSame || !heightSame){
            !widthSame ? ctx.canvas.width = window.innerWidth : null;
            !heightSame ? ctx.canvas.height = window.innerHeight : null;
        }
    }
}

function getAbsolutePosition(el) {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

function normalizeVector(x, y) {
    const length = Math.hypot(x, y); // same as sqrt(x^2 + y^2)
    if (length === 0) return [0, 0];
    return [x / length, y / length];
}

function domToCanvas(canvas, dom) {
    const rect = canvas.getBoundingClientRect();

    // Scale factors: DOM pixels -> canvas pixels
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Translate into canvas space
    return {
        x: (dom.x - rect.left) * scaleX,
        y: (dom.y - rect.top) * scaleY
    };
}

let basicDetectMouseHoverSetupDone = false;
let spikes = [];
let detectMouseHover = (forSpike, canvas=null) => {
    let spike = forSpike;
    spikes.push(spike);


    if(!basicDetectMouseHoverSetupDone){
        if(!canvas){return "can't do basic setup bro"}

        let detectIn = (mousePos, spike) => {
            let isIn = (posIsIn, thisVector) => {
                //ex is posIsIn = 1 in between thisVector = {x1: 3, x2: 7}; NOPE! return false
                return posIsIn >= thisVector.x1 && posIsIn <= thisVector.x2;
            }
            const xVector = {x1: spike.x_pos, x2: spike.x_pos + spike.image.width};
            const yVector = {x1: spike.y_pos, x2: spike.y_pos + spike.image.height};
            if(
                isIn(mousePos.x, xVector) &&
                isIn(mousePos.y, yVector)
            ) {
                return true;
            }
            return false;
        }

        document.addEventListener("mouseover", (event) => {
            const rect = canvas.getBoundingClientRect();

            const mouseX = event.clientX - rect.left; //convert to window co ordinates
            const mouseY = event.clientY - rect.top;

            for (let index = 0; index < spikes.length; index++) {
                const spk = spikes[index];
                let isMouseInSprite = detectIn({x: mouseX, y: mouseY}, spk);
                if(isMouseInSprite){
                    console.log(isMouseInSprite, mouseX, mouseY, spk);
                    location.reload();
                }
            }
        });

        basicDetectMouseHoverSetupDone = true;
    }

}

let ctx;
let canvas;
export let makeSpike = () => {
    canvas = canvas ?? document.getElementById('learn-screen');
    ctx = ctx ?? canvas.getContext('2d');

    let imagestart = "./image/spikes/spikes-"
    let spikeImageChoices = ["1.png", "3.png"];
    let img = imagestart + sampleArray(spikeImageChoices);
    let spike1 = new SpikesObj(randInt(-100, -10), randInt(0, 2000), randInt(1, 300), randInt(-5, 5), canvas, ctx, img);

    detectMouseHover(spike1, canvas);
};

export let makeSpikes = (amm=1) => {
    for (let index = 0; index < amm; index++) {
        makeSpike();
    }
};