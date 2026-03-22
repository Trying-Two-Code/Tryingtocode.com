class advancedSettings extends HTMLElement{
    constructor(){
        super();
    }

    render() {
        this.path = "../components/visuals/icons/create";

        //note to self: the advanced toggle is referenced in create-custom-elements
        //the reference is then referenced in create.js, which is convoluded.
        this.innerHTML = `
        <button class="advanced--toggle nice-button" data-js-tag="advanced-toggle"><img draggable="false" class="advanced--toggle--image" src="${this.path}/advanced-toggle/${window.theme}/frame-1${window.imageExtension}" alt="advanced settings"></button>
        <div data-js-tag="settings-toggled-element">

            <button class="language-select nice-button" data-js-tag="language-select-toggle"><img title="select language" draggable="false" src="${this.path}/language/python/${window.theme}${window.imageExtension}" alt="select language" class="language-select-toggle--image"></button>
            <div data-js-tag="language-toggled-element" class="language-toggled-elements">
                <li name="language-select--image-element-python" class="language-select--image-element" id="python-element"><img title="python" alt="python" draggable="false" src="${this.path}/language/python/${window.theme}${window.imageExtension}" class="language-select--image-element--image"></li>
                <li name="language-select--image-element-javascript" class="language-select--image-element unsupported" id="javascript-element"><img title="not supported yet" alt="not supported yet" draggable="false" src="${this.path}/language/js/${window.theme}${window.imageExtension}" class="language-select--image-element--image"></li>
                <li name="language-select--image-element-html" class="language-select--image-element unsupported" id="html-element"><img title="not supported yet" alt="not supported yet" draggable="false" src="${this.path}/language/html/${window.theme}${window.imageExtension}" class="language-select--image-element--image"></li>
                <li name="language-select--image-element-c" class="language-select--image-element unsupported" id="c-element"><img title="not supported yet" alt="not supported yet" draggable="false" src="${this.path}/language/c/${window.theme}${window.imageExtension}" class="language-select--image-element--image"></li>
            </div>
            
            <div data-js-tag="user-measure" class="usercode-measure">
                <textarea class="main-font code-lines usercode-measure--textarea" data-js-tag="measure-output-includes" name="measures--output-includes" placeholder="output includes">*</textarea>
                <textarea class="main-font code-lines usercode-measure--textarea" data-js-tag="measure-code-includes" name="measures--code-includes" placeholder="code includes">*</textarea>
                <textarea class="main-font code-lines usercode-measure--textarea" data-js-tag="measure-output-discludes" name="measures--output-discludes" placeholder="output discludes">*</textarea>
                <textarea class="main-font code-lines usercode-measure--textarea" data-js-tag="measure-code-discludes" name="measures--code-discludes" placeholder="code discludes">*</textarea>
            </div>

            <textarea class="main-font code-lines" data-js-tag="hint-section" name="hint-section" placeholder="hint"></textarea>

            <p>do not change these values:</p>
            <input type="password" data-js-tag="owner-section" name="owner-section" type="text" placeholder="Owner" class="code-lines main-font" required minlength="4">
            <input type="number" data-js-tag="priority-section" class="main-font code-lines" name="priority-within-section" placeholder="priority"></input>
        </div>`;

        this.initValues();
    }

    initValues(){
        this.priorityElement = this.querySelector("[data-js-tag='priority-section']");
        window.applySettings();
    }
}

customElements.define("ttc-create-advanced-settings", advancedSettings);