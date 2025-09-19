

export class CoinObj{
    constructor(go_to=null, x_pos=0, y_pos=0, x_vel=0, y_vel=0, canvas=null, originalCanvasWidth=1, originalCanvasHeight=1){
        this.go_to = go_to;

        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.x_vel = x_vel;
        this.y_vel = y_vel;

        this.dead = 0;

        this.canvas = canvas;
        this.originalCanvasWidth = originalCanvasWidth;
        this.originalCanvasHeight = originalCanvasHeight;
    }

    tick(speed=1){
        this.gravitate(this.go_to, 10);

        this.x_pos += this.x_vel * speed;
        this.y_pos += this.y_vel * speed; 
    }

    gravitate(go_to, drag=1, min_dist=5){
        const gt_rect = go_to.getBoundingClientRect();
        const absolute_gt = domToCanvas(this.canvas, getAbsolutePosition(go_to));

        let x_dist = absolute_gt[0] - this.x_pos;
        let y_dist = absolute_gt[1] - this.y_pos;

        let normalized_vector = normalizeVector(x_dist, y_dist);

        this.x_vel += normalized_vector[0] / drag;
        this.y_vel += normalized_vector[1] / drag;
        this.x_vel /= (1 + (drag / 2000));
        this.y_vel /= (1 + (drag / 2000));

        if(distance(this.x_pos, this.y_pos, absolute_gt[0], absolute_gt[1]) > min_dist && this.dead !== 0){
            this.DestroyGive(1);
        } else if(this.dead === 0 && distance(this.x_pos, this.y_pos, absolute_gt[0], absolute_gt[1]) < min_dist){
            this.dead = false;
        }
    }

    DestroyGive(amm){
        this.dead = true;
    }

    RenderImage(ctx, sprite, frames=1, index=0){
        let image = new Image();
        image.src = sprite;

        let spriteWidth = image.width / frames;
        let spriteHeight = image.height;
        let frameOffset = spriteWidth * index;
        let sizeMultiplier = .25;

        
        ctx.drawImage(
            image,
            frameOffset, 0,                  // source x, y
            spriteWidth, spriteHeight,       // source width, height
            this.x_pos * (this.canvas.width / this.originalCanvasWidth), this.y_pos * (this.canvas.width / this.originalCanvasWidth),          // destination x, y
            spriteWidth * sizeMultiplier * (this.canvas.width / this.originalCanvasWidth), spriteHeight * sizeMultiplier * (this.canvas.height / this.originalCanvasHeight)       // destination width, height
        );
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
        x: (dom[0] - rect.left) * scaleX,
        y: (dom[1] - rect.top) * scaleY
    };
}
function normalizeNumbers(num1, num2) {
    const min_value = Math.min(num1, num2);
    const max_value = Math.max(num1, num2);
  
    if (max_value === min_value) {
      // If both numbers are the same, they normalize to 0 (or 0.5 if you prefer a midpoint)
      // For normalization to [0,1], if min === max, all values become 0.
      return [0, 0];
    }
  
    const normalized_num1 = (num1 - min_value) / (max_value - min_value);
    const normalized_num2 = (num2 - min_value) / (max_value - min_value);
  
    return [normalized_num1, normalized_num2];
}