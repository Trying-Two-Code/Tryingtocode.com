import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app-check.js";
import "./firebaseUserdata.js";


const firebaseConfig = {
  apiKey: "AIzaSyABP5ADKcI2zC2ZdQ3pSUkuc1wmwBIbcwo",
  authDomain: "trying-to-code-eff09.firebaseapp.com",
  projectId: "trying-to-code-eff09",
  storageBucket: "trying-to-code-eff09.firebasestorage.app",
  messagingSenderId: "1085828579973",
  appId: "1:1085828579973:web:c4acd444e1d9469d5a1fec",
  measurementId: "G-7TREL4ZC4F"
};

const app = initializeApp(firebaseConfig);
window.app = app;

import { getAuth, signInAnonymously, createUserWithEmailAndPassword,  
    signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-performance.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";


const auth = getAuth(app);
window.auth = auth;

let setAnon = false;

setPersistence(auth, browserLocalPersistence).then(() => {
    if(setAnon){
        anonSign();
    }
}).catch((error) => {
    console.error(error);
    //if there is no user, and there has been a problem setting persistance, this may solve that.
    if(setAnon){
        try{
            anonSign().then(() => {
                setPersistence(auth, browserLocalPersistence);
            });
        } catch (error) {
            console.error("attempted to set persistance with a new anon user. Error: ", error);
        }
    }
});

const db = getFirestore(app);
window.db = db;

try {
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider("6LdQ-WUsAAAAAOpmabw66DZ63svdPZTj9c6YJyPm"),
        isTokenAutoRefreshEnabled: true
    });
}
catch (error) {
    console.error("app check not working: ", error);
    console.error("common fixes: 1. go to proper tryingtocode.com domain 2. sign in 3. if still not working, contact support");
}


//console.log("db: ", window.db);

const analytics = getAnalytics(app);

logEvent(analytics, 'page loaded');
window.logEvent = (log, data={}) => {
    console.log("loging", log, data); 
    logEvent(analytics, log, data);
};

let setWindowUser = (toThis) => {
    if(toThis == null) {console.error("toThis invalid: ", toThis); return null;}

    window.user = toThis;

    let user_set = new Event("user_set");
    window.dispatchEvent(user_set);
    /*console.error("remove in production");
    console.log(window.user.uid);*/
}

let authStateChangedFunction = async (user) => {
    if (user || auth.currentUser) {
        if(!user) { user = auth.currentUser; } 
        try{
            await initUserData(user);
            userMade(user);
        } catch (error) {
            console.error(error);
        }
    } else {
        setAnon = true;
        console.log("User signed out? Or error with user.");
        //anonSign();
    }
}

export let signUserOut = async () => { 
    signOut(auth).then(async () => {
        await anonSign();
        console.log("made user anon");
    }).catch((error) => {
        console.error(error);
    });
}

let startAuth = async (user) => {
    await auth.authStateReady();
    await authStateChangedFunction(user);
}

startAuth();

onAuthStateChanged(auth, (user) => {
    if(user) {
        authStateChangedFunction(user);
    }
    else{
        console.error("no user!");
    }
});

export let createEmail =  async(email, password) => {
    console.log("trying to sign up with ", email, password);
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        let user = userCredential.user;
        alert("creating account...");
        return user;
    }).catch((error) => {
        console.error(error);
        if(password.length < 6){
            console.log("must be over 5 characters");
        }
    });
}

let signIn = async (email, password) => {
    try {
        console.log("trying to sign in with ", email, password);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // return the actual user
    } catch (error) {
        console.error(error);
        throw error; // propagate error to caller
    }
}

export let signInUp = async (email, password) => {
    try{
        let user = await signIn(email, password);
        return user;
    }
    catch (error){
        console.log(error.code);
        if(error.code === "auth/user-not-found" || error.code == "auth/invalid-credential"){
            const new_user = await createEmail(email, password);
            return new_user;
        }else {
            // Some other error (wrong password, network, etc.)
            console.error(error);
            throw error;
        }
    }
}

export async function initUserData(user){
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0;
    }

    let userEmpty = userSnap.exists() && !isEmptyObject(userSnap.data());

    if (userEmpty) {
        const updatedSnap = await getDoc(userRef);
        
        setUserDatapointWithObject(updatedSnap.data());
    } else{
        const updatedDoc = await setDoc(userRef, {
            email: user.email || defaultValues.email,
            displayName: user.displayName || defaultValues.displayName,
            coins: user.coins || defaultValues.coins,
            projects: user.projects || defaultValues.projects
        });
        console.log("now coins: ", updatedDoc);
    }
}

export let deleteUserData = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {});
}

const defaultValues = {
    email: null,
    displayName: "guest",
    coins: 0,
    projects: {}
};

export let setUserDatapointWithObject = async ( payload = {email: null, displayName: null, coins: null, projects: null, prioritizePayload: false} ) => {
    if(window?.user == null) { return false; }
    let newData = {};

    let currentData = await getUserData(window.user);
    let payloadKeys = Object.keys(payload);

    let changeData = (key, toData) => {
        newData[key] = toData;
    }

    let detectChangeData = (key) => {
        const payloadDatapoint = payload[key];

        if(!payload.prioritizePayload && key in currentData){
            const currentDatapoint = currentData[key];
            changeData(key, currentDatapoint);
        } else {
            changeData(key, payloadDatapoint);
        }
    }

    for (let payloadValue = 0; payloadValue < payloadKeys.length; payloadValue++) {
        const key = payloadKeys[payloadValue];

        detectChangeData(key);
    }

    const userRef = doc(db, "users", window.user.uid);

    updateDoc(userRef, newData);

    const updatedSnap = await getDoc(userRef);
    return updatedSnap;
}


export let setUserDatapoint = async (email=null, displayName=null, coins=null, projects=null) => {

    //This sets the user data to the defualt values above **unless they are nothing** (projects is weird though)
    
    if (!window.user) return console.warn("No user yet");

    console.trace("I am setting email! To: ", email);
    
    const userRef = doc(db, "users", window.user.uid);
    const updatedSnap = await getDoc(userRef);
    const data = updatedSnap.data() || {};

    //all the normal value merges

    let getNonEmptyValue = (defualt, ...values) => {
        let isEmpty = value => { return (value == null || value == defualt); }

        for (let i = 0; i < values.length; i++) {
            const element = values[i];
            if(!isEmpty(element)){
                //PASS ELEMENT HERE
                return element;
            }
        }

        return null;
    }

    let updatePayload = {};

    let setEmail = getNonEmptyValue(defaultValues["email"], email, data.email, null);
    let setDisplayName = getNonEmptyValue(defaultValues["displayName"], displayName, data.displayName, null);
    let setCoins = getNonEmptyValue(defaultValues["coins"], coins, data.coins, null);

    if(setEmail != null) {updatePayload.email = setEmail;}
    if(setDisplayName != null) {updatePayload.displayName = setDisplayName;}
    if(setCoins != null) {updatePayload.coins = setCoins;}

    //project merge

    let mergeProjects = () => {
        const OLD_PROJECTS = data.projects;
        let saveProjectList = mergeObjects(OLD_PROJECTS, projects);
        return saveProjectList;
    }

    let setProjects = mergeProjects();

    if(!isObjectEmpty(setProjects)) {
        updatePayload.projects = setProjects;
        let localPayload = JSON.stringify(setProjects)
        localStorage.setItem("projects", localPayload);
        console.log(window.currentDisplay);
    }

    //setting proper
    await updateDoc(userRef, updatePayload);

    if(projects == null) return;

    /*console.log("the payload got: ", updatePayload);

    console.log("the reason it is bad? ", projects, setProjects, isObjectEmpty(setProjects));*/

    let newData = await getUserData();
    return newData;
    //console.log(d);
    
}

export let increaseCoins = async (byAmmount=5) => {
    if (!window.user) return console.warn("No user yet");

    logEvent(analytics, "coins given");

    const userRef = doc(db, "users", window.user.uid);

    let updatePayload = { coins: increment(byAmmount) };
    console.log('PAYLOAD: ', updatePayload);

    /*let incrementLocalCoins = (amm) => {
        let currentCoins = localStorage.getItem("coin");
        currentCoins = Math.round(currentCoins);
        localStorage.setItem('coin', currentCoins + amm);
    }
    try{
        incrementLocalCoins(byAmmount);
    } catch (error){
        console.log(error);
    }*/

    await updateDoc(userRef, updatePayload);
}

const isObjectEmpty = (obj) => {
    return obj == null || (Object.keys(obj).length === 0 && obj.constructor === Object);
};

export let mergeObjects = (object1, object2) => { //object2 gets priority over object1
    let theChosenOneAhhhh = (isObjectEmpty(object1) ? object2 : object1);

    if(isObjectEmpty(object1) || isObjectEmpty(object2)) { return theChosenOneAhhhh; } //return one if the other is null

    let merged = {};

    let mergeObj = (obj, merge) => {
        let projKeys = Object.keys(obj);
        for (const key of projKeys) {
            //projectList1 for loop
            const element = obj[key];
            merge[key] = element;
        }
        return merge;
    }

    if(object1 != null){
        merged = mergeObj(object1, merged);
    }
    if(object2 != null){
        merged = mergeObj(object2, merged);
    }

    return merged;
}

export let getUserData = async (user=window.user) => {
    if(user == null || user?.uid == null){
        console.error("cannot get user data; no user yet!"); 
        return null;
    }

    const userRef = doc(db, "users", user.uid);
    const updatedSnap = await getDoc(userRef);
    
    return updatedSnap.exists() ? updatedSnap.data() : null;
}

var updateProjects = []

let userMade = (user) => {
    setWindowUser(user);
    let user_made = new Event("user_made");
    window.dispatchEvent(user_made);

    let code;
    const userRef = doc(db, "users", user.uid);

    getDoc(userRef).then((userSnap) => {
        code = userSnap.get("projects");

        updateProjects.forEach(updateProject => {
            //console.log("stuff and things: ", updateProject[0], updateProject[1], code[updateProject[1]]);
            updateProject[0](code[updateProject[1]]);
        });
        updateProjects = [];
    });

    printProjects();
}   

let firstBlankProject = true;

export let setupProject = (projectDisplay, projectTitle) => {
    let setProjCode = (code, projectDisplay) => {
        if(code != null) {
            projectDisplay.reward = 0;
            projectDisplay.completedIcon.classList.remove("hide");
        }
        if(code == null && firstBlankProject == true){
            console.log("open me please ", projectTitle);
            firstBlankProject = false;
            projectDisplay.openProject(0);
        }
    }

    let setProjCodeFilled = (code) => {
        setProjCode(code, projectDisplay);
    }    

    updateProjects.push([setProjCodeFilled, projectTitle]);
}

let anonSign = async () => {
    if(typeof window.user !== "undefined") { console.error("user already exists, why you doing this?"); throw "uh oh, don't do that"; }

    await signInAnonymously(auth).then((userCredential) => {
        console.log("Signed in anonymously, ");
        console.warn("id passed in is: ", userCredential);

        let user = auth.currentUser;
        //user = userCredential.user;
        let uid = user.uid;

        console.log("user is: " + uid);
        setWindowUser(user);
        return user;
    })
    .catch((error) => {
        console.error(error);
    });

    return;
}


let printProjects = async () => {
    
    if (!window.user || !window.user.uid) {
        console.log("printProjects blocked: User not ready.");
        return;
    }

    const projectRef = doc(db, "projects", window.user.uid);
    try {
        let projDoc = await getDoc(projectRef);
    } catch (error) {
        console.error(error);
    }
}

const perf = getPerformance(app);