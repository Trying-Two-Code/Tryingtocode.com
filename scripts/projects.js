//for use as a rect for editable projects

//general use

console.log("project");

let htmlGen = `
<button id="dropdown-button">
    <img src="components/art/yellow - toggle arrow up.png" alt="">
</button>
`;

export class Display{
    constructor(document, htmlString=htmlGen){
        console.log('yea display');
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        return template.content.firstElementChild;
    }

}


//learn
