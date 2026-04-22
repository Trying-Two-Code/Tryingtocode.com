import { initUserData, deleteUserData, setUserDatapoint, getUserData, mergeObjects, setUserDatapointWithObject, signUp, deleteCurrentUser } from "./firebase.js"

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
    console.log("email is havin issues: ", oldData.email);
    console.log("set datapoint: ", await setUserDatapointWithObject({
        email: oldData.email,
        displayName: oldData.displayName,
        coins: oldData.coins,
        projects: oldData.projects,
        prioritizePayload: true
    }));
    let userData = await getUserData();
    console.assert(userData.coins === oldData.coins);
    console.assert(userData.displayName === oldData.displayName);
    console.assert(userData.email === oldData.email);
    console.assert((userData.projects === null && oldData.projects === null) || 
    userData.projects[Object.keys(userData.projects)[0]] === oldData.projects[Object.keys(oldData.projects)[0]]);
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

const exampleUser = {
    email: "example@gmail.com",
    username: "example_user",
    password: "password123",
    setWindowUser: false
};

let testSignIn = async () => {

};

let testDeleteUser = async (testuser) => {
    console.log("wait! User is not properly defined yet.");
    await deleteCurrentUser(testuser)
};

let testSignUp = async () => {
    //depends on the user being deleted first
    await signUp(exampleUser);
};

export let testAll = async (noConfirm=false) => {
    const oldData = await getUserData();
    console.log("OLD DATA HERE: ", oldData);

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
        console.log("OLD DATA HERE 2: ", oldData);
        await testBringBackData(oldData);
    }

    console.error("look over this test code:");
    let shouldTestSignUp = noConfirm ? confirm("test sign in+up and delete+remake default user?") : true;
    if(shouldTestSignUp){
        console.log("testing deletion...");
        let oldUser;
        if(window.auth.currentUser || window.user){
            oldUser = window.auth.currentUser || window.user;
        }
        const TEST_USER = await testSignIn();
        await testDeleteUser(TEST_USER);
        await testSignUp();
        if(oldUser){
            await testSignIn(oldUser);
        }
    }

    await testMergeObject();
};