//for use in learn.html
import { Display } from "./projects.js";

let d = new Display(document, document.body);

let code = d.content.querySelector('[name="user-code"]');

d.run_button.addEventListener('click', async () => {
    let value = code.value;
    console.log(value);
    await d.displayUserCode(code.value);
});