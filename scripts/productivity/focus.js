//this script sends and recieves focus keys

import { updateTimeSinceUserInWindow } from "./user-tracking.js";
import { timeSince } from "../tools.js";
const delay = ms => new Promise(res => setTimeout(res, ms));

const NON_FOCUS_LEEWAY = 5000; // in ms

let keyDone = (keyObject) =>  { console.log(`key success: ${keyObject}`, keyObject); };
let keyFailed = (keyObject) => { console.log(`key failed: ${keyObject}`, keyObject); };

let detectSuccess = async (keyObject) => {
    let detectThreshold = 1000;

    let checkTick = async () => {
        while (true) {
            await delay(detectThreshold);

            detectThreshold -= 1;
            if(detectThreshold <= 0){
                console.error("hmm, that is a bit too many detections, stop it");
                return "error";
            }

            let updateShouldlast = () => {
                keyObject.shouldLast -= timeSince(`shouldLastWentDown_${keyObject.keyID}`, 0);
            }

            let check = () => {
                let timeSince = updateTimeSinceUserInWindow();
                console.log(keyObject, timeSince, keyObject.nonFocusLeeway);
                if(timeSince > keyObject.nonFocusLeeway){
                    return false;
                } else if(timeSince === 0){
                    let isTimeServed = keyObject.shouldLast <= 0;
                    return isTimeServed ? true : "detect";
                }

                return null;
            }

            let result = check();
            keyObject?.checked.push({result: result, shouldLast: keyObject.shouldLast});

            if(result === null) continue;
            if(result === "detect") {
                updateShouldlast(); 
                continue;
            }
            if(result === false || result === true) {
                return result;
            }
        }
    }

    return await checkTick();
}

export let makeFocusKey = async ({ 
    keyID="generic", startTime=Date.now(), 
    shouldLast=1000, nonFocusLeeway=NON_FOCUS_LEEWAY, 
    callback=keyDone, negativeCallback=keyFailed }={}) => {

    const keyObject = { 
        keyID: keyID,
        startTime: startTime,
        shouldLast: shouldLast,
        checked: [],
        nonFocusLeeway: nonFocusLeeway,
        callback: callback,
        negativeCallback: negativeCallback
    };

    let result = await detectSuccess(keyObject);
    if(result == "error"){ throw "seems like you need to do some code refactoring."; }

    result ? callback(keyObject) : negativeCallback(keyObject);
}