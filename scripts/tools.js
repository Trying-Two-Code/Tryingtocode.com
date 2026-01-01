//used for things such as sign in toggle button, and sidebar toggle
export class toggle{
    constructor(toggleButton, effectedElement, toggleClass, transitionedElement=null, animatedElement=null){
        this.toggleButton = toggleButton;
        this.effectedElement = effectedElement;
    }

    toggleButton(button, toggleClass){
        button.addEventListener("click", () => {
            this.toggle(this.parent)

            let off = this.parent.classList.contains("slow-hide")

            if(hiding){

                const toggleEventListener = () => { 
                    this.parent.classList.toggle("gone"); 
                    console.log("should be gone");
                    this.parent.removeEventListener('transitionend', toggleEventListener);
                }

                this.parent.addEventListener('transitionend', toggleEventListener); 
            }else{
                this.parent.classList.toggle("gone"); 
            }
        });
    }
}

//An element that is collapsable from a toggle button, and toggles elements
export class Collapsable{
    constructor(parent, elements, images=[]){
        this.hidden = true;
        this.parent = parent;
        this.elements = elements;
        this.images = images;
        console.log(this.parent);
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