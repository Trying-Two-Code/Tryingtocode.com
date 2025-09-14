//pyrun.js 
//make sure <script src="https://cdn.jsdelivr.net/npm/pyodide@0.28.2/pyodide.min.js"></script> is in html
//this is for running user code, user side
window.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/';

let pyodide = null;
async function initPyodide(){
    pyodide = await loadPyodide();
    
    // register it so Python sees it as "input"
    pyodide.globals.set("input", jsInput);
}
initPyodide();

export function runUserCode(code){
    return pyRun(code);
} 

async function pyRun(code){
    try{
        console.log('run');

        let output = '';
        pyodide.setStdout({batched: (str) => {output += str.endsWith("\n") ? str : str + "\n";}});

        await pyodide.runPythonAsync(code);

        console.log('ran with result: ' + output);
        return output;
    }
    catch (error){
        console.log("Error running py code: ", error);
        return error;
    }
    console.log("the impossible just happened!!!? (uhm talk to a developer rn this is weird)")
    return false;
}

//  this code is for input()
//    \/ TEMPORARY FIX \/

// define a custom input bridge
function jsInput(promptText) {
    return window.prompt(promptText); // simple case
}
