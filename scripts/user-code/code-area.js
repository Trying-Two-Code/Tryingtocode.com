
//output and input area for user code
export class CodeArea{
    constructor(document, parent, project=null, lineAmm=1, language="python"){
        this.language = language;
        this.AREAHTML = 
        `
        <ttc-complex-typeable-code closeable="true" hintable="true" runnable="true" language="${this.language}"></ttc-complex-typeable-code>
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

        return;



        let matchScrollFilled = () => {this.matchScroll(this.prettyPre, this.textarea);}
        this.textarea.addEventListener('scroll', matchScrollFilled);
    }

    setupTextarea(){

        return;
        this.textarea.addEventListener('input', () => this.updateLineNumbers());

        this.textarea.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.textarea.scrollTop;
        });
        
        this.updateLineNumbers();
    }

    updateLineNumbers(){

        return;
        const lines = this.textarea.value.split('\n').length;
        this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
        this.lastLineCount = lines;
    }

    matchScroll(result_element, element){

        return;
        // Get and set x and y
        result_element.scrollTop = element.scrollTop;
        result_element.scrollLeft = element.scrollLeft;
    }

    createPrettyCode(prettyCodeElement, content){

        return;
        prettyCodeElement.textContent = content;
        Prism.highlightElement(prettyCodeElement);
    }

    getCurrentLine(){

        return;
        const text = this.textarea.value;
        const newLineSplit = text.split("\n");

        const end = this.textarea.selectionEnd;

        let upToSelection = text.substring(0, end)
        let subjectiveLineAmmount = upToSelection.split("\n").length; //the ammount of new lines before selection

        let currentLine = newLineSplit[subjectiveLineAmmount - 1];

        return currentLine;
    }

    createText(value){

        return;
        this.textarea.value = value;
        for (let index = 0; index < this.lineAmm - 1; index++) {
            this.textarea.value += "\n";
        }

        this.createPrettyCode(this.prettyCode, this.textarea.value);

        return this.textarea.value.split("\n").length;
    }
}
