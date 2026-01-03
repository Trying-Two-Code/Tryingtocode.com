//used for things such as sign in toggle button, and sidebar toggle
export class Toggle{
    constructor(toggleButton, effectedElements, primaryClass, secondaryClass=null, transitionedElement=null, animatedElement=null){
        console.log("made");
        
        this.effectedElements = ensureArray(effectedElements);
        this.primaryClass = primaryClass;
        this.secondaryClass = secondaryClass;
        this.goneClass = "gone";

        this.transitionedElement = transitionedElement;
        this.animatedElement = animatedElement;
        this.toggleButton = toggleButton;

        this.initializeLogic();
    }

    initializeLogic(){
        this.toggleEventFilled = () => {this.toggleEvent();}
        this.triggerGoneFilled = () => {this.goneEvent();}

        this.addEvent(this.toggleEventFilled);
        this.addEvent(this.triggerGoneFilled);

        this.toggleEvent();
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
        return effectedElement.classList.contains(this.toggleClass);
    }
}

let ensureArray = (variable) => {
  if (Array.isArray(variable)) {
    // Variable is already an array, return it as is
    return variable;
  } else {
    // Variable is not an array, wrap it in one
    return [variable];
  }
}

//An element that is collapsable from a toggle button, and toggles elements
export class SimpleToggle{
    constructor(parent, elements, images=[]){
        this.hidden = true;
        this.parent = parent;
        this.elements = elements;
        this.images = images;
        this.hide();
    }
    hide(){
        this.hidden = true;
        this.elements.forEach(elem => {
            elem.classList.add("hide");
        });
        this.parent.querySelector('img').src = this.images[1];
    }
    show(){
        this.hidden = false;
        this.elements.forEach(elem => {
            elem.classList.remove("hide");
        });
        this.parent.querySelector('img').src = this.images[0];
    }
    toggle(){
        this.hidden ? this.show() : this.hide()
    }
}