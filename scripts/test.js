//only works easily with node.js -- fix later when needed

const fs = require('fs');

_button = document.getElementsByClassName("submit-bug-button")[0];
_text = document.getElementsByClassName("input-bug")[0];


_button.addEventListener('click', () => {
    text = _text.value;

    fs.writeFile('../known_issues.md', text, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File updated successfully!');
    });
    
});

