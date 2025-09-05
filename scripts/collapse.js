//An element that is collapsable from a toggle button, and toggles elements
export class Collapsable{
    constructor(parent, elements){
        console.log('create collapsable');
        this.hidden = true;
        this.parent = parent;
        this.elements = elements;
        this.hide();
    }
    hide(){
        this.hidden = true;
        this.elements.forEach(elem => {
            elem.classList.add("hide");
        });
    }
    show(){
        this.hidden = false;
        this.elements.forEach(elem => {
            elem.classList.remove("hide");
        });
    }
    toggle(){
        this.hidden ? this.show() : this.hide()
    }
}