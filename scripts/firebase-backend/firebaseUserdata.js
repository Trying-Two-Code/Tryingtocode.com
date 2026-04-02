import { getUserData, setUserDatapoint, setUserDatapointWithObject } from "./firebase.js"

export let testUserData = async (noConfirm) => {

    let userData = await getUserData(window.user);
    let newUserData = structuredClone(userData);
    let testConfirm = true;
    
    let testAndGiveDefault = ({ datapoint = "coins", expectedType = "string", defaultValue = 0 }={}) => {
        let dataNotNull = datapoint in userData;
        let returnCurrentValue = false;
        let currentValue = null;

        if(dataNotNull){
            currentValue = userData[datapoint];
            let dataFitsExpectedType = typeof currentValue === expectedType;
            dataFitsExpectedType = dataFitsExpectedType || currentValue === null;
            returnCurrentValue = dataFitsExpectedType; // I realise that dataFitsExpectedType is useless, but it is readable I think.
        }

        if(!returnCurrentValue) {
            testConfirm = confirm("your data may be corrupted, we can try to fix it, but you may lose some information. Proceed?");
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
            defaultValue: null
        },
        {
            datapoint: "displayName",
            expectedType: "string",
            defaultValue: null
        }
    ];

    testValues.forEach(testValue => {
        if(testConfirm){
            let newUserDatapoint = testAndGiveDefault(testValue);
            newUserData[testValue.datapoint] = newUserDatapoint;
        }
    });

    return newUserData;
}

window.addEventListener("user_made", async () => {
    console.log("user made!");
    let newUserData = await testUserData();
    let result = await setUserDatapointWithObject(newUserData);
    newUserData = await getUserData(window.user);
    console.log(newUserData);

    console.log(userData);

});

