//pyrun.js 
//make sure <script src="https://cdn.jsdelivr.net/npm/pyodide@0.28.2/pyodide.min.js"></script> is in html
//this is for running user code, user side
window.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/';

console.log("run");

let pyodide = null;
async function initPyodide(){
    pyodide = await loadPyodide();
}
initPyodide();

export function runUserCode(code){
    console.log("run")
    return pyRun(code);
} 

async function pyRun(code){
    try{
        let result = await pyodide.runPythonAsync(code);
        console.log(result);
        return result;
    }
    catch (error){
        console.log("Error running py code: ", error);
        return error;
    }
    console.log("the impossible just happened!!!? (uhm talk to a developer rn this is weird)")
    return false;
}

