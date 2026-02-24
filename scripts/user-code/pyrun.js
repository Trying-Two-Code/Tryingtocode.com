window.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/';

let sharedPyArray;
let atomicSpace;
let interuptByte;

if(crossOriginIsolated) {
    sharedPyArray = new SharedArrayBuffer(1024);
    atomicSpace = new Int8Array(sharedPyArray);
    interuptByte = atomicSpace[0];
} else {
    sharedPyArray = new ArrayBuffer(1024);
    atomicSpace = new Int8Array(sharedPyArray);
    interuptByte = atomicSpace[0];
    console.error("please change to cross origin isolated in order to run code.");
}

const worker = new Worker(new URL('./pyrun-worker.js', import.meta.url), {type: "module"});
worker.onerror = (error) => {
    console.error(error);
}

worker.postMessage({cmd: "initArrayBuffer", array: sharedPyArray});

const encoder = new TextEncoder();
const decoder = new TextDecoder();



let awaitRunPython = async (python) => {

    //run
    var data = new Promise((resolve, reject) => {
        worker.postMessage({ cmd: "awaitPyrun", python: python });
        let output = "";

        worker.onmessage = async (message) => {

            if (message.data.cmd === "input") {
                Atomics.store(atomicSpace, 0, 0); // tell worker to wait
                await getInput(message.data.promptText || "");
                Atomics.notify(atomicSpace, 0, 1); // tell worker to GET TO WORKKKKK!
                return;
            }

            if(message.data.cmd === "stdout") {
                output += message.data.text;
                return;
            }

            if(message.data.cmd === "error"){
                resolve(message.data.error);
            }

            if(message.data.cmd === "success"){
                resolve(message.data.output);
            }

            resolve(output);
        } 

        worker.onerror = (error) => reject([false, error]);
    });

    //get result
    var result = await data;

    //async processing
    if(typeof result.cmd !== "undefined"){
        if(result.cmd == "input"){
            playerInput = await getInput();
            worker.postMessage({cmd: "passInput", playerInput: playerInput});
            result = null;
        }
    }

    //allow inputn
    if(typeof currentDisplay !== "undefined"){
        if (currentDisplay !== null) {
            
            //pyodide.globals.set("input", getInputFilled);
        }
    }

    return result;
    let NAMESPACE = pyodide.globals.get("dict")(); 
    return await pyodide.runPythonAsync(python, { globals: NAMESPACE });
}

const sendInputToWorker = async (input) => {
    const encoder = new TextEncoder();
    encoder.encodeInto(input, inputData);
    Atomics.store(inputReady, 0, 1);
    console.log("workers notified: ", Atomics.notify(inputReady, 0));
}

const getInput = async (promptText = "", currentDisplay=window.currentDisplay) => {
    if(currentDisplay.output) {
        currentDisplay.output.value += promptText;
        currentDisplay.output.value += "\n";
    }

    console.log(currentDisplay);
    console.log("gonna get input");

    let input = await currentDisplay.getInput();
    
    await sendInputToWorker(input);

    interruptBuffer[0];
    return input;
}


export async function runUserCode(code){
    try{
        let tree = await printTree(code);
        var isAsync = checkAsync(tree);
        console.log("isAsync, ", isAsync);
    } catch{
        var isAsync = false;
    }
    
    if(isAsync){
        code = makeAsync(code);
    }
    
    let pyrunOutput = await awaitRunPython(code);
    console.log("GO HERE", pyrunOutput);
    return pyrunOutput;
} 


let printTree = async (code) => {
    let tree = await getTree(code);
    checkAsync(tree);
    console.log(tree);
    return tree;
}
/*
async function simplePyRun(code){
    let output = [];
    for (let line of code.split("\n")){
        output.push(await awaitRunPython(line));
    }
    return output;
}
*/

let checkBody = (body, functionName) => {
    let elements = [];
    body.forEach(key => {
        const element = key;
        if(element?.value?.func?.id == functionName){
            elements.push(element);
        }
        if(element?.body != undefined){
            let bodyElements = checkBody(element.body, functionName);
            if(bodyElements != undefined){
                bodyElements.forEach(subElement => {
                elements.push(subElement);
            });
            }
        }
    });
    if(elements.length > 0){return elements;}
}

function isUndefinedArray(list) {
  return (
    Array.isArray(list)  &&
    list.length == 1     &&
    list[0] == undefined
  )
}

let checkElementFor = (element, functionName="print") => {
    let elements = [];

    const body = element?.body;
    if(body != null){
        elements.push(checkBody(body, functionName));
    }

    const functions = element?.func;
    
    if(!isUndefinedArray(elements)){console.log("RETURNED!"); return elements;}
}

let checkAsync = (tree) => {
    const asyncElems = checkElementFor(tree, "input");
    return !isUndefinedArray(asyncElems) && asyncElems != undefined;
}

let makeAsync = (code) => {
    let indentedCode = '';
    code.split("\n").forEach(line => {
        if(line != null){
            indentedCode += ` ${line}\n`;
        }
    });
    const wrapper = `
import asyncio
async def _SUPERMAIN():
${indentedCode} pass
asyncio.run(_SUPERMAIN())
`   ;

    return wrapper;
}




/*
async function pyRun(code){
    try{
        //I need to await jsInput if an input is required before continuing:
        let output = '';
        pyodide.setStdout({batched: (str) => {output += str.endsWith("\n") ? str : str + "\n";}});

        await awaitRunPython(code);
        console.log("it was no error.");
        return [true, output];

    }
    catch (error){
        try{
            console.log("it was no error.");
            return [true, await simplePyRun(code)];
        }
        catch (simpleError){
            console.log("Error running py code: ", error);

            if (error instanceof Error && typeof error.message === "string") {
                const lines = error.message.split('\n');
                const relevantLines = [];

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
                return [false, relevantLines.join('\n')];
        }}
        return [false, "Unknown error - Look around in your code for clues"];
    }
    console.log("the impossible just happened!!!?")
    return false;
}
*/


export async function getTree(code){
    let tree = await awaitRunPython(
`
import ast, json

def ast_to_dict(node):
    if isinstance(node, ast.AST):
        result = {"type": type(node).__name__}
        for field in node._fields:
            result[field] = ast_to_dict(getattr(node, field))
        return result
    elif isinstance(node, list):
        return [ast_to_dict(n) for n in node]
    else:
        return node

tree = ast_to_dict(ast.parse("""${code}"""))
json.dumps(tree)
` 
    );
    tree = JSON.parse(tree);
    return tree;
}