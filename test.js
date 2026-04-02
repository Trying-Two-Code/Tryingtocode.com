//this should run all tests if you call window.TTC.testAllFunctions in the F11 console

import { testAll as testFirebaseAll } from "./scripts/firebase-backend/firebase.test.js";


let testAll = async (noConfirm=false) => {
    await testFirebaseAll(noConfirm);
}

console.log("setting.");

window.TTC.testAllFunctions = () => {testAll();};