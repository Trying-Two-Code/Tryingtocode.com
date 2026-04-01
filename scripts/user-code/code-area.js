
//output and input area for user code
export class CodeArea{
    constructor(document, parent, project=null, lineAmm=1, language="python"){
        this.language = language;
        this.AREAHTML = 
        `
        <ttc-complex-typeable-code closeable="true" hintable="true" runnable="true" language="${this.language}" class="show-when-mini"></ttc-complex-typeable-code>
        `;
        let codeAreaHTML = this.AREAHTML;

        this.document = document;
        this.parent = parent; 
        this.codeAreaHTML = codeAreaHTML;
        this.lineAmm = lineAmm;
        this.project = project;

        this.setAttributes();
    }

    setAttributes(){
        let template = document.createElement('template');
        template.innerHTML = this.codeAreaHTML.trim();

        this.content = template.content;
        this.projectEl = this.content.firstElementChild;

        this.parent.appendChild(this.content);

        this.typeableCodeElement = this.projectEl;//this.projectEl.querySelector("ttc-complex-typeable-code");
        this.typeableCodeElement.language = "python";
        this.typeableCodeElement.complexRender();
        this.typeableCodeElement.project = this.project;

        this.textarea = this.projectEl.querySelector('textarea[name=user-code]');
        this.prettyCode = this.projectEl.querySelector('code[name=pretty-code]');
        this.prettyPre = this.projectEl.querySelector('pre[name=pretty-pre]');
        this.lineNumbers =  this.projectEl.querySelector(".line-numbers");
    }
}
