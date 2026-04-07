import { getUserData, setUserDatapoint, setUserDatapointWithObject } from "./firebase.js"

export let testUserData = async (noConfirm) => {

    let userData = await getUserData(window.user);
    let newUserData = structuredClone(userData);
    let testConfirm = true;
    
    let testAndGiveDefault = ({ datapoint = "coins", expectedType = "string", defaultValue = 0, canBeNull = false }={}) => {
        let dataNotUndefined = datapoint in userData;
        let returnCurrentValue = false;
        let currentValue = null;

        if(dataNotUndefined){
            currentValue = userData[datapoint];
            let dataFitsExpectedType = typeof currentValue === expectedType;
            dataFitsExpectedType = dataFitsExpectedType || currentValue === null;
            returnCurrentValue = dataFitsExpectedType; // I realise that dataFitsExpectedType is useless, but it is readable I think.
        }

        let bypassNull = canBeNull && dataNotUndefined && userData[datapoint] == null;

        if(!returnCurrentValue && !bypassNull) {
            testConfirm = confirm(`your data for -${datapoint}- may be corrupted, we can try to fix it, but you may lose some information. Proceed?`);
            if(!testConfirm){ return currentValue; }
        }

        return returnCurrentValue ? currentValue : defaultValue;
    }

    let testValues = [
        {
            datapoint: "coins",
            expectedType: "number",
            defaultValue: 0
        },
        {
            datapoint: "projects",
            expectedType: "object",
            defaultValue: {}
        },
        {
            datapoint: "email",
            expectedType: "string",
            defaultValue: null,
            canBeNull: true
        },
        {
            datapoint: "displayName",
            expectedType: "string",
            defaultValue: null,
            canBeNull: true
        }
    ];

    testValues.forEach(testValue => {
        console.log(`testing value: ${testValue.datapoint}`);
        if(testConfirm){
            let newUserDatapoint = testAndGiveDefault(testValue);
            newUserData[testValue.datapoint] = newUserDatapoint;
        }
    });

    return newUserData;
}

export let deleteAllUserData = () => {
    
}

let startEvent = async () => {
    window.removeEventListener("user_made", startEvent);
    let newUserData = await getUserData(window.user);

    newUserData = await testUserData();
    newUserData.prioritizePayload = true;
    let result = await setUserDatapointWithObject(newUserData);
    
    newUserData = await getUserData(window.user);
}

window.addEventListener("user_made", startEvent);

