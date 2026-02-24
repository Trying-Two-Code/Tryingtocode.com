import {TTCComplexTypeableCode} from "../typeable-code.js";
import { isCorrectCode } from "../../user-code/check-code.js";
import { getJSONOfCurrentCreateProject } from "../../create.js";

class TTCCreateProjectOutput extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        console.log("render only when told to, not when created -- maybe?");
        //this.render();
    }
    render() {
        const language = this.getAttribute("language") ?? "python";
        const typingDisabled = this.getAttribute("typing-disabled") ?? "true";
        const codeText = this.getAttribute("codeText") ?? "";


        this.innerHTML = `
<div id="learn-project" class="project main-font">
        <div class="column-elements">
            <div>
                <ttc-complex-typeable-code closeable="true" output-height="35px" runnable="true" readonly="false" linkable="true"></ttc-complex-typeable-code>
            </div>
        </div>
    </div>
</div>
        `;
        this.oldLanguage = language;
        this.initValues();
    }

    initValues(){
        this.languageElement = this.querySelector("[name='code-editor--pretty-code']");
        this.typeableCodeElement = this.querySelector("ttc-complex-typeable-code");
        this.typeableCodeElement.complexRender();
        this.code = this.typeableCodeElement.textarea;
        this.projectTitle = this.typeableCodeElement.projectTitle;
        this.mission = this.typeableCodeElement.mission ;
        this.prettyCode = this.typeableCodeElement.prettyCode;
        this.linkUnlink = this.querySelector("[name='link-unlink-toggle']");

        this.typeableCodeElement.project = this;
        this.canRun = true;

        this.textarea = this.typeableCodeElement.textarea;
    }

    updateCode() {
        this.typeableCodeElement.createPrettyCode(this.prettyCode, this.code.value);
    }

    updateValues(){
        debugger;
    }

    changeLanguage(newLanguage) {
        if(this.oldLanguage){
            this.languageElement.classList.remove(this.oldLanguage); 
        } else{
            this.oldLanguage = this.languageElement.classList.forEach((classElement) => {
            if(classElement.contains("language-")){ 
                return classElement;
            }
            return "error";
            });

            if(this.oldLanguage == "error"){ console.error("no old language"); return; }

            this.languageElement.classList.remove(this.oldLanguage); 
        }
        
        this.languageElement.classList.add(`language-${newLanguage}`);
    }

    async evaluateUserCode(output){
        console.log("hello?");

        let decision = (success) => {
            console.log(success, success && success !== null)

            let outputElement = this.typeableCodeElement.outputArea;

            outputElement.classList.toggle("output-mid", (success === null));
            outputElement.classList.toggle("output-correct", success && success !== null);
            outputElement.classList.toggle("output-incorrect", !success && success !== null);
        }
        decision(null);

        let value = this.textarea.value;
        //let output = await this.displayUserCode(value);

        if(!output[0]){
            decision(false);
            return false;
        }

        console.log(this.project);
        let json = getJSONOfCurrentCreateProject(this.project);

        console.log(json);

        let correctCode = isCorrectCode(value, json, output[1]).then((passed) => {
            if(passed) {decision(true);}
            this.playerCorrect(passed);
        });

        console.log(correctCode);
    }
}

customElements.define("ttc-create-project-output", TTCCreateProjectOutput);