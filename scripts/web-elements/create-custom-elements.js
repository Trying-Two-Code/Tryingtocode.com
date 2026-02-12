class TTCCreateProject extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        this.exampleAttribute = this.getAttribute("ex");

        this.innerHTML = `
<div class="create-align" id="create-project-container">
    <div class="create" id="create-page-holder">
        <!--button class="main-font" id="change-setting">change setting</button-->

        <div class="user-create-project main-font">

            <div class="create-main">
                <textarea class="main-font code-lines create-title" name="title" id="create-title" placeholder="title"></textarea>
                <textarea class="code-lines create-mission main-font" placeholder="mission" id="create-mission"></textarea>
                <div class="create-code-container">
                    <ttc-typeable-code id="create-code" name="defualt code" class="main-font code-lines create-code" placeholder="defualt code" language="python"></ttc-typeable-code>
                </div>
            </div>

            <button class="advanced--toggle nice-button" id="user-create-project--advanced-toggle"><img draggable="false" class="advanced--toggle--image" src="../components/art/advanced settings - 1.png" alt="advanced settings"></button>
            <div class="user-create-project--toggled-element">

                <button class="language-select nice-button" id="language-select-toggle"><img draggable="false" src="../components/art/language logo - python.png" alt="select language" class="language-select-toggle--image"></button>
                <div name="language-select-elements" class="language-select-elements" id="language-select-toggled-elements">
                    <li name="language-select--image-element-python" class="language-select--image-element" id="python-element"><img draggable="false" src="../components/art/language logo - python.png" alt="" class="language-select--image-element--image"></li>
                    <li name="language-select--image-element-javascript" class="language-select--image-element unsupported" id="javascript-element"><img draggable="false" src="../components/art/language logo - javascript.png" alt="" class="language-select--image-element--image"></li>
                    <li name="language-select--image-element-html" class="language-select--image-element unsupported" id="html-element"><img draggable="false" src="../components/art/language logo - html.png" alt="" class="language-select--image-element--image"></li>
                    <li name="language-select--image-element-c" class="language-select--image-element unsupported" id="c-element"><img draggable="false" src="../components/art/language logo - c.png" alt="" class="language-select--image-element--image"></li>
                </div>
                

                <!--select name="language" class="user-create-project--language-select advanced--language-select" id="user-create-project--language-select">
                    <option value="py">python <img draggable="false" src="../components/art/language logo - python.png" alt=""></img></option> 
                    <option value="js">javascript <img draggable="false" src="../components/art/language logo - javascript.png" alt=""></img></option>
                    <option value="htm">html <img draggable="false" src="../components/art/language logo - html.png" alt=""></img></option>
                    <option value="c">c <img draggable="false" src="../components/art/language logo - c.png" alt=""></img></option>
                </select-->
                <div class="usercode-measure">
                    <textarea class="main-font code-lines usercode-measure--textarea" name="" id="measures--output-includes" placeholder="output includes"></textarea>
                    <textarea class="main-font code-lines usercode-measure--textarea" name="" id="measures--code-includes" placeholder="code includes"></textarea>
                    <textarea class="main-font code-lines usercode-measure--textarea" name="" id="measures--output-discludes" placeholder="output discludes"></textarea>
                    <textarea class="main-font code-lines usercode-measure--textarea" name="" id="measures--code-discludes" placeholder="code discludes"></textarea>
                </div>

                <input type="password" id="password" type="text" placeholder="User - Do Not Change" class="code-lines main-font" required minlength="4">
            </div>
        </div>
        
        <button class="submit-button nice-button" id="submit-button"><img draggable="false" class="submit-button--image" src="../components/art/submit - 1.png" alt="submit"></button>
        <p id="submit-button-error" class="error-message">must contain -title- and -mission-</p>
        
        <div id="create-output">
            <ttc-create-project-output id="create-output--element"></ttc-create-project-output>
        </div>
    </div>
    <div class="test">
        <div id="project-parent" class="project-parent"></div>
    </div>
</div>
        `;
        
        let create_project_set = new Event("create_project_set");
        window.dispatchEvent(create_project_set);
    }
}

customElements.define("ttc-create-project", TTCCreateProject);


class TTCCreateProjectOutput extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        console.log("render only when told to, not when created -- maybe?");
        //this.render();
    }
    render() {
        this.innerHTML = "<p>working!</p>";
    }
}

customElements.define("ttc-create-project-output", TTCCreateProjectOutput);