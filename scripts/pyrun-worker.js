import "https://cdn.jsdelivr.net/npm/pyodide@0.28.2/pyodide.min.js";

let pyodide = await loadPyodide();
let syncInt, dataBuffer;

let runPython = async (python) => {
    let NAMESPACE = pyodide.globals.get("dict")(); 


    pyodide.setStdin({stdin: () => {
        postMessage({ cmd: "input" });

        Atomics.wait(syncInt, 0, 0);

        //done waiting \/

        const decoder = new TextDecoder();
        const input = decoder.decode(dataBuffer).replace(/\0/g, ''); 
        Atomics.store(syncInt, 0, 0); 

        return input;
    }
    });

    let output = '';
    pyodide.setStdout({batched: (str) => {output += str.endsWith("\n") ? str : str + "\n";}});
    await pyodide.runPythonAsync(python, { globals: NAMESPACE });

    return output;
}

const onmessage = async (message) => {
    console.log("doing anything! ", message);

    if (message.data.cmd === "setInterruptBuffer") {
        pyodide.setInterruptBuffer(message.data.interruptBuffer);
        return;
    }
    if(message.data.cmd === 'awaitPyrun' ){
        let result = await runPython(message.data.python);
        console.log(result);
        postMessage(result);
    }
    if (message.data.cmd === "initInputBuffer") {
        syncInt = new Int32Array(message.data.sharedBuffer, 0, 1);
        dataBuffer = new Uint8Array(message.data.sharedBuffer, 4);
    }
}

self.onmessage = onmessage;


const getInput = async (promptText = "", currentDisplay=null) => {
    
    postMessage({cmd: "input", promptText: promptText});

    return "player gave this for susssrrrrrreeee!!!";
    if(currentDisplay.output) {
        currentDisplay.output.value += promptText;
        currentDisplay.output.value += "\n";
    }

    console.log(currentDisplay);
    console.log("gonna get input");

    let inp = await currentDisplay.getInput();
    return inp;
}

