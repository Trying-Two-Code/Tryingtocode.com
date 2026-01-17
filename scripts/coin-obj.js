/**
 * CoinObj class
 * This hosts coin object logic
 * including gravitation towards an object
 * detection of being to close to gravitation object
 * 
 * 
 */

import { SpriteImage } from "./tools.js";

console.log("work");

export class CoinObj{
    constructor(go_to=null, x_pos=0, y_pos=0, x_vel=0, y_vel=0, canvas=null, ctx=null, sprite=null){
        this.go_to = go_to;

        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.x_vel = x_vel;
        this.y_vel = y_vel;

        this.dead = 0;

        this.canvas = canvas;
        if (canvas) {
            this.originalCanvasWidth = canvas.width;
            this.originalCanvasHeight = canvas.height;
        }
        this.image = new Image();
        this.spriteImage = new SpriteImage(ctx, this.image, sprite);
    }

    tick(speed=1){
        const min_dist = 11;
        this.gravitate(this.go_to, min_dist);
        this.DetectGive(min_dist);

        this.x_pos += this.x_vel * speed;
        this.y_pos += this.y_vel * speed;
    }

    gravitate(go_to, drag=2){
        this.absolute_gt = domToCanvas(this.canvas, getAbsolutePosition(go_to)); //position

        let x_dist = this.absolute_gt.x - this.x_pos;
        let y_dist = this.absolute_gt.y - this.y_pos;

        let normalized_vector = normalizeVector(x_dist, y_dist);

        this.x_vel += normalized_vector[0] / drag;
        this.y_vel += normalized_vector[1] / drag;
        this.x_vel /= (1 + (drag / 2000));
        this.y_vel /= (1 + (drag / 2000));
    }

    DetectGive(min_dist){ //check if the coin is close enough to give the user
        let closeEnough = distance(this.x_pos, this.y_pos, this.absolute_gt.x, this.absolute_gt.y) < min_dist
        let x_axis_close = (this.x_pos - this.absolute_gt.x) < 0
        if(this.dead !== 0 && (!closeEnough)){
            this.DestroyGive(1);
        } else if(this.dead === 0 && (closeEnough || x_axis_close)){
            this.dead = false;
        }
    }

    DestroyGive(amm){
        this.dead = true;
    }

    RenderImage(sprite, frames=1, index=0){
        this.spriteImage.RenderImage(sprite, this.x_pos, this.y_pos, frames, index);
    }
}

function getAbsolutePosition(el) {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
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