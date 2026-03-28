//to make a button go through a series of images when pressed
export class ImageButton {
    constructor(button, images, currentImage=0){
        this.button = button;
        this.buttonImage = button.children[0];
        this.images = images;
        this.currentImage = currentImage;
        this.initializeButtonLogic();
    }

    initializeButtonLogic(){
        // nothing yet.
    }

    changeImage(toImage=null){
        if(toImage) {
            this.buttonImage.src = toImage; 
        }
        else {
            this.currentImage = ((this.currentImage + 1) % this.images.length);
            this.buttonImage.src = this.images[this.currentImage];
        }
    }

    changeOnClick(){
        this.button.addEventListener("click", () => {
            this.changeImage();
        });
    }
}

//used for things such as sign in toggle button, and sidebar toggle
//mildly more complicated than SimpleToggle
export class Toggle{
    constructor(toggleButton, effectedElements, primaryClass, secondaryClass=null, transitionedElement=null, animatedElement=null, startToggled=true){
        this.effectedElements = ensureArray(effectedElements);
        this.primaryClass = primaryClass;
        this.secondaryClass = secondaryClass;
        this.goneClass = "gone";

        this.transitionedElement = transitionedElement;
        this.animatedElement = animatedElement;
        this.toggleButton = toggleButton;

        this.startToggled = startToggled;

        this.initializeLogic();
    }

    initializeLogic(){
        this.toggleEventFilled = () => {this.toggleEvent();}
        this.triggerGoneFilled = () => {this.goneEvent();}

        this.addEvent(this.toggleEventFilled);
        this.addEvent(this.triggerGoneFilled);

        if(this.startToggled){
            this.toggleEvent();
        }
    }

    addEvent(event, button=this.toggleButton){
        button.addEventListener("click", event);
    }

    toggleEvent(primaryClass=this.primaryClass, secondaryClass=this.secondaryClass){
        this.effectedElements.forEach(effectedElement => {
            let secondaryValue = effectedElement.classList.contains(primaryClass);

            effectedElement.classList.toggle(primaryClass);
            effectedElement.classList.toggle(secondaryClass, secondaryValue);
        });
    }

    goneEvent(){
        let stopEvent = (this.transitionedElement == null) && (this.animatedElement == null);

        if(stopEvent){
            this.toggleButton.removeEventListener("click", this.goneEvent);
            return;
        }

        let goneClass = this.goneClass;

        this.effectedElements.forEach(effectedElement => {
            this.goneToggleEvent(effectedElement);
        });
    }

    goneToggleEvent(effectedElement=null){
        let isOff = this.isOff(effectedElement);
        
        if(isOff){
            let addTempListener = (typeend, effectedElement=null) => {
                if(effectedElement == null) {console.log("null element");return;}
                
                const goneListener = () => {
                    effectedElement.classList.toggle(goneClass);
                    effectedElement.removeEventListener(typeend, toggleEventListener);
                }
                effectedElement.addEventListener(typeend, toggleEventListener);
            }
        }
        if(!isOff){
            let effectedElements = [this.transitionedElement, this.animatedElement];
            effectedElements.forEach(element => {
                element.classList.toggle(goneClass);
            });
        }
    }

    isOff(effectedElement){
        return effectedElement.classList.contains(this.primaryClass);
    }
}

//ai code, refactor later:
let ensureArray = (variable) => {
  if (Array.isArray(variable)) {
    //Variable is already an array, return it as is
    return variable;
  } else {
    //Variable is not an array, wrap it in one
    return [variable];
  }
}

//An element that is collapsable from a toggle button, and toggles elements
//keep simple, if you feel like refactoring, maybe just use a different class
export class SimpleToggle{
    constructor(parent, elements, images=[]){
        this.hidden = true;
        this.parent = parent;
        this.elements = elements;
        this.images = images;
        this.hideClassName = "hide";
        this.setupFunctionality();
    }
    setupFunctionality(){
        if(typeof this.parent.querySelector('img') !== "undefined"){
            this.parentImage = this.parent.querySelector('img');
        }
        this.hide();
        this.hasImages = (typeof this.images !== "undefined") && (this.images.length !== 0);
    }
    hide(){
        if(this.elements.length == 0){
            console.error("no elements to hide");
            return;
        }

        this.hidden = true;
        this.elements.forEach(elem => {
            elem.classList.add(this.hideClassName);
        });
        
        if(this.hasImages){
            this.parentImage.src = this.images[1];
        }
    }
    show(){
        if(this.elements.length == 0){
            console.error("no elements to show");
            return;
        }

        this.hidden = false;
        this.elements.forEach(elem => {
            elem.classList.remove(this.hideClassName);
        });
        if(this.hasImages){
            this.parentImage.src = this.images[0];
        }
    }
    toggle(){
        this.hidden ? this.show() : this.hide();
    }
    setupToggle(){
        let toggle = () => {this.toggle();};
        this.parent.addEventListener('click', toggle);
    }
}

//renders images properly, scaling to the canvas
export class SpriteImage{
    constructor(ctx, image, sprite){
        this.ctx = ctx;
        this.image = image;
        this.sprite = sprite;

        this.ogDemensions = this.getScreenDimensions();
    }

    getScreenDimensions() {
        return [this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight];
        return [window.screen.availWidth, window.screen.availHeight];
    }

    RenderImage(sprite, position_x=0, position_y=0, frames=1, index=0){
        this.ctx.imageSmoothingEnabled = false;

        this.image.src = this.sprite;

        this.spriteWidth = this.image.width / frames;
        this.spriteHeight = this.image.height;
        this.frameOffset = this.spriteWidth * index;

        let destination = [position_x - window.scrollX, position_y - window.scrollY];
        let size = 50;
        let scaledWidth = (this.getScreenDimensions()[0] / this.ogDemensions[0]) * size; 
        let scaledHeight = (this.getScreenDimensions()[1] / this.ogDemensions[1]) * size; 

        this.ctx.drawImage(
            this.image,
            this.frameOffset, 0,                    // source x, y
            this.spriteWidth, this.spriteHeight,    // source width, height
            destination[0], destination[1],         // destination x, y
            scaledWidth, scaledHeight               // destination width, height
        );
    }
}

let timeSinceEvents = {};
export let timeSince = (eventName="something", valueWhenNeverDoneBefore=null) => {
    if(typeof eventName !== "string") { return "ERR_NAME, only strings allowed as event names"; }

    let date = new Date();
    let timeNow = date.getTime();
    let lastTimeOfEvent = timeSinceEvents[eventName];

    let setEventTime = () => { timeSinceEvents[eventName] = timeNow; }

    if(typeof lastTimeOfEvent !== "undefined") {
        let timeSinceChosenEvent = timeNow - lastTimeOfEvent;
        setEventTime();
        return timeSinceChosenEvent;
    } else {
        setEventTime();
        return valueWhenNeverDoneBefore;
    }
}

export let print = (text) => {console.log(text);}