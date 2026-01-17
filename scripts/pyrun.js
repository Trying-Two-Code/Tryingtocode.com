window.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/';

let pyodide = await loadPyodide();
pyodide.globals.set("input", getInput);

let awaitRunPython = async (python) => {
    // Create a fresh namespace
    let NAMESPACE = pyodide.globals.get("dict")(); 
    return await pyodide.runPythonAsync(python, { globals: NAMESPACE })
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
    return pyRun(code);
} 


let printTree = async (code) => {
    let tree = await getTree(code);
    checkAsync(tree);
    console.log(tree);
    return tree;
}

async function simplePyRun(code){
    let output = [];
    for (let line of code.split("\n")){
        output.push(await awaitRunPython(line));
    }
    return output;
}

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



async function pyRun(code){
    try{
        //I need to await jsInput if an input is required before continuing:

        let output = '';
        pyodide.setStdout({batched: (str) => {output += str.endsWith("\n") ? str : str + "\n";}});

        await awaitRunPython(code);

        return [true, output];

    }
    catch (error){
        try{
            return [true, await simplePyRun(code)];
        }
        catch (simpleError){
            console.log("Error running py code: ", error);

            if (error instanceof Error && typeof error.message === "string") {
                const lines = error.message.split('\n');
                const relevantLines = [];

                // Go through lines from bottom up
                for (let i = lines.length - 1; i >= 0; i--) {
                    let line = lines[i].trim();
                    if (!line) continue;

                    // Skip internal Pyodide files except <exec>
                    if (line.startsWith('File "/lib/python')) continue;

                    // Adjust line numbers for wrapper
                    const match = line.match(/line (\d+)/);
                    if (match) {
                        const originalLine = parseInt(match[1], 10);
                        const adjustedLine = originalLine - 3; // wrapper lines
                        line = line.replace(`line ${originalLine}`, `line ${adjustedLine}`);
                    }

                    // Replace <exec> with <python>
                    line = line.replace(/<exec>/g, "<python>");

                    relevantLines.unshift(line);

                    // Stop after capturing the main exception line and one line of context
                    if (/^\w+Error:/.test(line) || /^\w+Warning:/.test(line)) break;
                }

                relevantLines.unshift("ERROR! Think carefully, here is a clue:\n\n");
                return [true, relevantLines.join('\n')];
        }}
        return [true, "Unknown error - Look around in your code for clues"];
    }
    console.log("the impossible just happened!!!?")
    return false;
}

async function getInput(promptText = ""){

    if(window.currentDisplay.output) {
        window.currentDisplay.output.value += promptText;
        window.currentDisplay.output.value += "\n";
    }

    console.log(window.currentDisplay);
    console.log("gonna get input");

    let inp = await window.currentDisplay.getInput();
    return inp;
}

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

async function serverRun(code){
    //new code here
}