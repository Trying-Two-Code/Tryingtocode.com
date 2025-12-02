import { getTree } from "./pyrun.js";


const BLANK = '*';

export let normalizeText = (text) => { /* make text similar to allow flexible player input */
    return text.toLowerCase().replaceAll(" ", "").replaceAll("'", `"`);
}

/*

"output-includes": "",
"output-discludes": "*",
"code-includes": "*",
"code-discludes": "*",
"failure-shows": "*"

*/

export let checkInclusion = (parts, whole, oppositeParts='*') => {
    if((whole !== BLANK && whole !== "") && parts == undefined) {return false;}
    if(whole === BLANK){ return null; }

    if(whole === '**') { /* any */ 
        if (parts == ""){
            console.log('this is true if it has nothing');
            return null;
        }
        return false;
    }

    const partsSplit = '\n';

    let pass;

    const allParts = parts.split(partsSplit);
    let skips = [];
    skips.length = 0;
    const splitWhole = whole.split("&&&");

    for (let index = 0; index < splitWhole.length; index++) {
        const element = splitWhole[index];
        pass = false;
        console.log(skips, parts);
        for(let part = 0; part < allParts.length; part++){
            if (skips.includes(part)){
                continue;
            }
            let currentPart = allParts[part];
            if(
                normalizeText(currentPart).includes(normalizeText(element)) && 
                currentPart != ""
            )
            {
                console.log(skips, currentPart);
                pass = true;
                skips.push(part);
                break;
            }
        }
        if(pass == false){ break;}
    }
    console.log("passed ", pass);
    return pass;
}

export let isCorrectCode = async (code, json, output) => {
    console.log("the error could be here. Here are a ton of paramaters to be looking at:", code, json, output);
    let tree = await getTree(code);

    let O = [json['output-includes'], json['output-discludes']];
    let C = [json['code-includes'], json['code-discludes']];

    console.log(code, tree);

    let OI = checkInclusion(output, O[0], O[1]);
    let OD = !checkInclusion(output, O[1], O[0]);
    let CI = checkInclusion(code, C[0], C[1]);
    let CD = !checkInclusion(code, C[1], C[0]);
    
    //console.log(OI, ' OI ', OD, ' OD ', CI, ' CI ', CD, 'CD');

    let result = true;
    [OI, OD, CI, CD].forEach(element => {
        console.log(element);
        if(element === false){
            result = false;
        }
    });

    return result;
}