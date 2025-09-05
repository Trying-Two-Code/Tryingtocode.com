//An element that is collapsable from a toggle button, and toggles elements
export class Collapsable{
    constructor(parent, elements){
        this.hidden = true;
        this.parent = parent;
        this.elements = elements;
        this.hide();
    }
    hide(){
        this.hidden = true;
        for (elem in this.elements){
            elem.classList.add("hide")
        }
    }
    show(){
        this.hidden = false;
        for (elem in this.elements){
            elem.classList.add("show")
        }
    }
    toggle(){
        this.hidden ? this.show() : this.hide()
    }
}