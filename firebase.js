import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyABP5ADKcI2zC2ZdQ3pSUkuc1wmwBIbcwo",
  authDomain: "trying-to-code-eff09.firebaseapp.com",
  projectId: "trying-to-code-eff09",
  storageBucket: "trying-to-code-eff09.firebasestorage.app",
  messagingSenderId: "1085828579973",
  appId: "1:1085828579973:web:c4acd444e1d9469d5a1fec",
  measurementId: "G-7TREL4ZC4F"
};

//VALUES

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

//Auth Value

let authStateChangedFunction = async (user) => {
    if (user) {
        console.log("User signed in:", user.uid);
        await deleteStuff(user);
        await initUserData(user);
        window.user = user;
        let user_made = new Event("user_made");
        window.dispatchEvent(user_made);
    } else {
        console.log("User signed out");
        anonSign();
    }
}

let setupAuthChanged = () => {
    onAuthStateChanged(auth, authStateChangedFunction);
}
setupAuthChanged();

var db = null;

function anon(auth){
    signInAnonymously(auth).then((userCredential) => {
        const user = userCredential.user;
    }).catch((error) => console.error(error));
}

export let createEmail =  async(email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // return the actual user
    } catch (error) {
        console.error(error);
        throw error; // propagate error to caller
    }
}

export let signInUp = async (email, password) => {
    try{
        const user = await signIn(email, password);
        return user;
    }
    catch (error){
        if(error.code === "auth/user-not-found"){
            const new_user = await createEmail(email, password);
            return new_user
        }else {
            // Some other error (wrong password, network, etc.)
            console.error(error);
            throw error;
        }
    }
}


export async function initUserData(user){
    if(db == null){
        db = getFirestore(app);
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0;
    }

    if (userSnap.exists() && !isEmptyObject(userSnap.data())) {
        const updatedSnap = await getDoc(userRef);
        console.log("now coins: ", userSnap.data());
        setUserDatapoint(updatedSnap.data());
    } else{
        const updatedDoc = await setDoc(userRef, {
            email: user.email || defualtValues.email,
            displayName: user.displayName || defualtValues.displayName,
            coins: user.coins || defualtValues.coins,
            projects: user.projects || defualtValues.projects
        });
        console.log("now coins: ", updatedDoc);
    }
}

let deleteStuff = async (user) => {
    if(db == null){
        db = getFirestore(app);
    }
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {});
}

let defualtValues = {
    email: null,
    displayName: "guest",
    coins: 0,
    projects: {}
};

//Somehow, we need to merge the data of what we have online, and on site.
export let setUserDatapoint = async (email=null, displayName=null, coins=null, projects=null) => {
    if (!window.user) return console.warn("No user yet");

    if(db == null){
        db = getFirestore(app);
    }
    
    const userRef = doc(db, "users", window.user.uid);
    const updatedSnap = await getDoc(userRef);
    const data = updatedSnap.data() || {};

    const OLD_PROJECTS = data.projects;
    let saveProjectList = mergeObjects(projects, OLD_PROJECTS);

    let setEmail = email ?? data.email ?? defualtValues.email;
    let setDisplayName = displayName ?? data.displayName ?? defualtValues.displayName;
    let setCoins = coins ?? data.coins ?? defualtValues.coins;
    let setProjects = saveProjectList ?? defualtValues.projects;

    await setDoc(userRef, {
        email: setEmail,
        displayName: setDisplayName,
        coins: setCoins,
        projects: setProjects
    }, { merge: true });
}

let mergeObjects = (object1, object2) => {
    //projectList2 gets priority over projectList1
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

    if(object1 != undefined){
        merged = mergeObj(object1, merged);
    }
    if(object2 != undefined){
        merged = mergeObj(object2, merged);
    }

    /*
    let projKeys1 = Object.keys(object1);
    let projKeys2 = Object.keys(object2);

    for (const key of projKeys1) {
        //projectList1 for loop
        const object = object1[key];
        merged[key] = object;
        console.log(object);
    }

    for (const key of projKeys2) {
        //projectList2 for loop
        const object = object2[key];
        merged[key] = object;
        console.log(object);
    }
    */

    console.log("merged is this now wowww", merged);

    return merged;
}



function anonSign(){
    signInAnonymously(auth).then((id) => {
        console.log("Signed in anonymously");

        let user = auth.currentUser;
        let uid = user.uid;
        console.log("user is: " + uid);
    })
    .catch((error) => {
        console.error(error);
    });
}

setPersistence(auth, browserLocalPersistence).then(() => {
    console.log("Persistence set to local");
}).catch((error) => {
    console.error(error);
});


