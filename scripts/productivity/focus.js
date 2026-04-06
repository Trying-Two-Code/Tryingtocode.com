//this script sends and recieves focus keys

let keyDone = (keyObject) =>  { console.log(`key success: ${keyObject}`); };
let keyFailed = (keyObject) => { console.log(`key failed: ${keyObject}`); };

export let makeFocusKey = ({ 
    keyID="generic", startTime=Date.now(), 
    shouldLast=1000, callback=keyDone, 
    negativeCallback=keyFailed }={}) => {

    const keyObject = { 
        keyID: keyID,
        startTime: startTime,
        shouldLast: shouldLast,
        checked: null,
        callback: callback,
        negativeCallback: negativeCallback
    }

    //Detect if it failed
    negativeCallback(keyObject);

    //Detect if it succeded
    callback(keyObject);


}