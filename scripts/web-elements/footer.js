class TTCFooter extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }
    render(){
        const copywrite = this.getAttribute("copywrite");
        const legalSRCs = this.getAttribute("legal-src");
        const privacyPolicy = this.getAttribute("privacy-src");
        const mailTo = this.getAttribute("mail-to");

        this.innerHTML = `
            <footer class="footer main-font">
                <div class="row">
                    <div class="column">
                        <p>about</p>
                        <li class="footer--list-element"><a href="about.html" class="footer--link">about page</a></li>
                        <li class="footer--list-element"><a href="mailto:${mailTo}" class="footer--link">${mailTo}</a></li>
                        <li class="footer--list-element"><a href="${legalSRCs}" class="footer--link">Terms of Service</a></li>
                        <li class="footer--list-element"><a href="${privacyPolicy}" class="footer--link">Privacy Policy</a></li>
                    </div>
                    <div class="column">
                        <p>pages</p>
                        <li class="footer--list-element"><a href="learn" class="footer--link">learn</a></li>
                        <li class="footer--list-element"><a href="/" class="footer--link">home</a></li>
                        <!--a href="create" class="footer--link">create</a-->
                    </div>
                    <div class="column">
                        <p>help and support</p>
                        <li class="footer--list-element"><a href="https://docs.google.com/forms/d/e/1FAIpQLSd1BB1V3JilTZPJEPQw0S8nTMsf9Vjfb_i_PX2aoeiEIOMEZg/viewform?usp=dialog" class="footer--link">ask for change</a></li>
                        <li class="footer--list-element"><a href="https://youtu.be/dQw4w9WgXcQ" class="footer--link">help</a></li>
                    </div>
                    <div class="column">
                        <p>socials</p>
                        <li class="footer--list-element"><a href="https://youtube.com/@tryingcode" class="footer--link">youtube</a></li>
                        <li class="footer--list-element"><a href="https://x.com/TryingtwoCode" class="footer--link">twitter</a></li>
                        <li class="footer--list-element"><a href="https://www.patreon.com/c/TryingToCode" class="footer--link">patreon</a></li>
                        <li class="footer--list-element"><a href="https://github.com/Trying-Two-Code/Tryingtocode.com" class="footer--link">github</a></li>
                        <li class="footer--list-element"><a href="https://youtu.be/dQw4w9WgXcQ" class="footer--link">facebook</a></li>
                    </div>
                </div>
                <p>&copy; ${new Date().getFullYear()} ${copywrite} - All Rights Reserved</p>
            </footer>
        `;
    }
}

customElements.define("ttc-footer", TTCFooter);