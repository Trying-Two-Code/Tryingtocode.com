import "https://cdn.jsdelivr.net/npm/pyodide@0.28.2/pyodide.min.js";

let pyodide = await loadPyodide();
let sharedPyArray;
let interruptBuffer;

let runPython = async (python) => {
    let NAMESPACE = pyodide.globals.get("dict")(); 

    pyodide.setStdin({stdin: () => {
        getInput();
    }});

    let output = '';
    const decoder = new TextDecoder();
    pyodide.setStdout({
        write: (buf) => {
            const str = decoder.decode(buf);
            output += str;
            
            console.log("got stuff here though");
            return buf.length;
        }
    });
    try{
        let run = await pyodide.runPythonAsync(python, { globals: NAMESPACE });
        return [true, output];
    } catch (error){
        console.error("yo the code ran wrong bro:", false, error);
        let cleanError = cleanUpError(error);

        postMessage({ cmd: "error", error: [false, cleanError]});
        return [false, cleanError];
    }

    return [false, "unkown error, please contact@tryingtocode.com"];
}

let awaitPyrun = async (message) => {
    let result = await runPython(message.data.python);
    console.log(result[0]);
    let successful = result[0];
    if(successful){
        postMessage({ cmd: "success", output: result });
    }
}

let initializeArrayBuffer = message => {
    console.log(message);
    console.log(message.array);
    sharedPyArray = message.array;
    interruptBuffer = message.interruptArray;
    console.log(sharedPyArray);
}


const onmessage = async (message) => {
    console.log("YO, got something");
    if(message.data.cmd === "awaitPyrun"){
        awaitPyrun(message);
    }
    if(message.data.cmd === "initArrayBuffer") {
        initializeArrayBuffer(message);
    }
}

self.onmessage = onmessage;


const getInput = async (promptText = "", currentDisplay=null) => {
    Atomics.set()
    Atomics.wait(interruptBuffer, 0, 1);
}

let cleanUpError = (error) => {
    console.log("Error running py code: ", error);

    if (error instanceof Error && typeof error.message === "string") {
        const lines = error.message.split('\n');
        let relevantLines = [];

        for (let i = lines.length - 1; i >= 0; i--) {
            let line = lines[i].trim();
            if (!line) continue;

            if (line.startsWith('File "/lib/python')) continue;

            const match = line.match(/line (\d+)/);
            if (match) {
                const originalLine = parseInt(match[1], 10);
                const adjustedLine = originalLine - 3;
                line = line.replace(`line ${originalLine}`, `line ${adjustedLine}`);
            }

            line = line.replace(/<exec>/g, "<python>");

            relevantLines.unshift(line);

            // Stop after capturing the main exception line and one line of context
            if (/^\w+Error:/.test(line) || /^\w+Warning:/.test(line)) break;
        }

        relevantLines.unshift("ERROR! Think carefully, here is a clue:\n\n");
        console.log(relevantLines);
        return relevantLines.join('\n');
    }
}