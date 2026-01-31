class TTCFooter extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
        console.log("rendered successfully.");
    }
    render(){
        const copywrite = this.getAttribute("copywrite");
        const legalSRCs = this.getAttribute("legal-src");
        const mailTo = this.getAttribute("mail-to");

        this.innerHTML = `
            <footer class="footer">
                <div class="row">
                    <div class="column">
                        <p>about</p>
                        <a href="mailto:${mailTo}" class="footer--link">${mailTo}</a>
                        <a href="${legalSRCs}" class="footer--link">legal</a>
                    </div>
                    <div class="column">
                        <p>catagories</p>
                        <a href="learn" class="footer--link">learn</a>
                        <a href="/" class="footer--link">home</a>
                        <!--a href="create" class="footer--link">create</a-->
                    </div>
                    <div class="column">
                        <p>help and support</p>
                        <a href="https://youtu.be/dQw4w9WgXcQ" class="footer--link">help</a>
                    </div>
                    <div class="column">
                        <p>socials</p>
                        <a href="https://youtube.com" class="footer--link">youtube</a>
                        <a href="https://twitter.com" class="footer--link">twitter</a>
                        <!--a href="https://youtu.be/dQw4w9WgXcQ" class="footer--link">facebook</a-->
                    </div>
                </div>
                <p>&copy; ${new Date().getFullYear()} ${copywrite} - All Rights Reserved</p>
            </footer>
        `;
    }
}

customElements.define("ttc-footer", TTCFooter);