function isString(variable) {
  return typeof variable === 'string';
}

export let normalizeText = (text) => { /* make text similar to allow flexible player input */
    let normalizedText;
    if(text != null && isString(text)){
        normalizedText = text.toLowerCase().replaceAll(" ", "").replaceAll("'", `"`).replaceAll("\t", "");
    }
    return normalizedText;
}

export let checkInclusion = (parts, whole) => {
    const BLANK = '*';

    let expectsValue = whole !== BLANK && whole !== "";
    if((expectsValue && parts == undefined)) {return false;}
    if(whole === BLANK){ return null; }

    if(whole === '**') { /* any */ 
        if (parts == ""){
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
                pass = true;
                skips.push(part);
                break;
            }
        }
        if(pass == false){ break;}
    }
    return pass;
}

export let isCorrectCode = async (code, json, output) => {
    //let tree = await getTree(code);

    let expectedOutput = [json['output-includes'], json['output-discludes']];
    let expectedCode = [json['code-includes'], json['code-discludes']];

    //console.log(code, tree);

    let OutpuIncluded = checkInclusion(output, expectedOutput[0], expectedOutput[1]);
    let OutpuDiscluded = !checkInclusion(output, expectedOutput[1], expectedOutput[0]);
    let CodeIncluded = checkInclusion(code, expectedCode[0], expectedCode[1]);
    let CodeDiscluded = !checkInclusion(code, expectedCode[1], expectedCode[0]);

    let result = true;
    [OutpuIncluded, OutpuDiscluded, CodeIncluded, CodeDiscluded].forEach(element => {
        console.log(element);
        if(element === false){
            result = false;
        }
    });

    return result;
}