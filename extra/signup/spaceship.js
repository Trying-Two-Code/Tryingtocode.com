/**
 * 
 */

import { randInt, sampleArray, SpriteImage, timeSince } from "./../../scripts/tools.js";

export class SpaceshipObj{
    static spaceships = [];
    static generalDirection = {x: 1, y: -.01};

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
        this.continuousRendering();

        SpaceshipObj.spaceships.push(this);
        SpaceshipObj.renderAllSpaceships();
    }

    tick(scaler=1){
        this.move();

        this.x_pos += this.x_vel * scaler;
        this.y_pos += this.y_vel * scaler;

        this.RenderImage(this.sprite, 1, 0);
    }

    move(){
        let defualt_slowdown = 1500; //the lower this is, the thicker the air feels
        let drag = 50;

        let dir = SpaceshipObj.generalDirection;
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

    continuousRendering(){
        
    }

    RenderImage(sprite, frames=1, index=0){
        this.spriteImage.RenderImage(sprite, this.x_pos, this.y_pos, frames, index);
        this.detectDestruction();
    }

    detectDestruction(){
        if(this.x_pos > canvas.width){
            this.isRendering = false;
            this.reference = null;
            SpaceshipObj.removeSpaceship(this);
            //SpaceshipObj.clearRect();
        }
    }

    static removeSpaceship(spaceship){
        let spaceships = SpaceshipObj.spaceships;
        let index = spaceships.indexOf(spaceship);
        SpaceshipObj.spaceships.splice(index, 1);
    }

    static alreadyCleared = false;
    static clearRect(){
        if(SpaceshipObj.alreadyCleared){
            throw "can't clear twice per frame...";
        }else{
            SpaceshipObj.alreadyCleared = true;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            window.requestAnimationFrame(() => {
                SpaceshipObj.alreadyCleared = false;
            });
        }
    }

    static isRendering = true;
    static renderAllSpaceships(){
        if(SpaceshipObj.isRendering){
            SpaceshipObj.clearRect();

            let allSpaceships = SpaceshipObj.spaceships;
            let deltaTime = timeSince("spaceshiptick", 1);
            allSpaceships.forEach(spaceship => {
                spaceship.tick(.01 * deltaTime);
            });
            /*SpaceshipObj.spaceships.foreach(spaceship => {
                spaceship.tick();
            });*/

            SpaceshipObj.scaleCTX();
            SpaceshipObj.isRendering = false;
            window.requestAnimationFrame(() => {
                SpaceshipObj.isRendering = true;
                SpaceshipObj.renderAllSpaceships();
            });
        } else{
            return "no rendering twice alloud";
        }
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
let ctx;
let canvas;
export let makeSpaceship = () => {
    canvas = canvas ?? document.getElementById('learn-screen');
    ctx = ctx ?? canvas.getContext('2d');

    let imagestart = "./image/spaceship/spaceship - "
    let spaceshipImageChoices = ["blue.png", "green.png", "red.png"];
    let img = imagestart + sampleArray(spaceshipImageChoices);
    let spaceShip1 = new SpaceshipObj(randInt(-100, -10), randInt(0, 2000), randInt(1, 300), randInt(-5, 5), canvas, ctx, img);
}
//spaceShip1.reference = spaceShip1;
/*
spaceShip1.isRendering = true;
spaceShip1.continuousRendering();*/