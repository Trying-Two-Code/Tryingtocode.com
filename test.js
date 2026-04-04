//this should run all tests if you call window.TTC.testAllFunctions in the F11 console

import { testAll as testFirebaseAll } from "./scripts/firebase-backend/firebase.test.js";
import { testAll as testFirebaseUserdataAll } from "./scripts/firebase-backend/firebaseUserdata.test.js";


let testAll = async (noConfirm=false) => {
    await testFirebaseAll(noConfirm);
    await testFirebaseUserdataAll(noConfirm);
}

console.log("setting.");

window.TTC.testAllFunctions = () => {testAll();};