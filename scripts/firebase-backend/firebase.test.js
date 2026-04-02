import { initUserData, deleteUserData, setUserDatapoint, getUserData, mergeObjects } from "./firebase.js"

let testDataDelete = async () => {
    console.log(await deleteUserData(window.user));
    console.assert(await initUserData(window.user) === undefined);
}

let testAlterData = async () => {
    console.log("set datapoint: ", await setUserDatapoint(
        "value 123",
        "value 123",
        "value 123",
        "value 123"
    ));
    let userData = await getUserData();
    console.assert(userData.coins === "value 123");
    console.assert(userData.displayName === "value 123");
    console.assert(userData.email === "value 123");
    console.assert(userData.projects === "value 123");
    console.log(userData);
}

let testBringBackData = async (oldData) => {
    console.log(oldData);
    console.log("set datapoint: ", await setUserDatapoint(
        oldData.email,
        oldData.displayName,
        oldData.coins,
        oldData.projects
    ));
    let userData = await getUserData();
    console.assert(userData.coins === oldData.coins);
    console.assert(userData.displayName === oldData.displayName);
    console.assert(userData.email === oldData.email);
    console.assert(userData.projects === oldData.projects);
    console.log(userData);
}

let testMergeObject = async () => {
    let mo = mergeObjects({data1: "value1", data3: "value3"}, {data1: "val interesting", data2: "value2"});
    let JSONMO = JSON.stringify(mo);
    let expectedmo = {data1: 'val interesting', data3: 'value3', data2: 'value2'};
    let JSONEXPECTEDMO = JSON.stringify(expectedmo);
    console.assert(JSONMO === JSONEXPECTEDMO);
    console.log(JSONMO, JSONEXPECTEDMO);
}

export let testAll = async (noConfirm=false) => {
    const oldData = await getUserData();

    let deleteData = noConfirm ? confirm("delete user data?") : true;
    if(deleteData || noConfirm){
        await testDataDelete();
    } else{
        console.log("user data: ", await initUserData(window.user));
    }

    let alterData = noConfirm ? confirm("alter user data?") : true;
    if(alterData || noConfirm){
        await testAlterData();
    }

    let bringBackData = noConfirm ? confirm("bring back old data?") : true;
    if(bringBackData){
        await testBringBackData(oldData);
    }

    await testMergeObject();
}