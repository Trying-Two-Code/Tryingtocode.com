//An element that is collapsable from a toggle button, and toggles elements
export class Collapsable{
    constructor(parent, elements, images=[]){
        this.parent.src = 'components/art/yellow - toggle arrow up.png'
        this.hidden = true;
        this.parent = parent;
        this.elements = elements;
        this.images = images;
        this.parent.src = this.images[0];
        this.hide();
    }
    hide(){
        this.hidden = true;
        this.elements.forEach(elem => {
            elem.classList.add("hide");
        });
        this.parent.src = this.images[0];
    }
    show(){
        this.hidden = false;
        this.elements.forEach(elem => {
            elem.classList.remove("hide");
        });
        this.parent.src = this.images[0];
    }
    toggle(){
        this.hidden ? this.show() : this.hide()
    }
}