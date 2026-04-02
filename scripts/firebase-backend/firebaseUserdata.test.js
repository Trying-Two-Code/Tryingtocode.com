import { testUserData } from "./firebaseUserdata.js";

let testTestUserData = async() => {
    let userData = await testUserData();

    console.assert(typeof userData.coins === "number");
    console.assert(typeof userData.displayName === "string");
    console.assert(typeof userData.email === "string" || userData.email === null);
    console.assert(typeof userData.projects === "object");
}

export let testAll = async (noConfirm=false) => {
    await testTestUserData();
}

window.testAllFirebaseUserdata = () => {testTestUserData();}