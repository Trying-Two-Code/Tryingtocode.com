import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

//const analytics = getAnalytics(app);

let authStateChangedFunction = async (user) => {
    if (user) {
        window.user = await initUserData(user);
        userMade(user);
    } else {
        console.log("User signed out? Or error with user.");
        window.user = anonSign();
    }
}

onAuthStateChanged(auth, authStateChangedFunction);

export let createEmail =  async(email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        user = userCredential.user;
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
        user = await signIn(email, password);
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

let defaultValues = {
    email: null,
    displayName: "guest",
    coins: 0,
    projects: {}
};

export let setUserDatapoint = async (email=null, displayName=null, coins=null, projects=null) => {
    if (!window.user) return console.warn("No user yet");
    
    const userRef = doc(db, "users", window.user.uid);
    const updatedSnap = await getDoc(userRef);
    const data = updatedSnap.data() || {};

    const OLD_PROJECTS = data.projects;
    let saveProjectList = mergeObjects(OLD_PROJECTS, projects);

    let setEmail = email ?? data.email ?? defaultValues.email;
    let setDisplayName = displayName ?? data.displayName ?? defaultValues.displayName;
    let setCoins = coins ?? data.coins ?? defaultValues.coins;
    let setProjects = saveProjectList ?? defaultValues.projects;

    await setDoc(userRef, {
        email: setEmail,
        displayName: setDisplayName,
        coins: setCoins,
        projects: setProjects
    }, { merge: true });
}

export let setUserDatapoint2 = async () => {
    return error;
}

let mergeObjects = (object1, object2) => { //projectList2 gets priority over projectList1
    if(object1 == null || object2 == null) { return object1 == null ? object2 : object1 }
    
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

export let getUserData = async () => {
    if(typeof user == "undefined"){return null;}
    const userRef = doc(db, "users", user.uid);
    const updatedSnap = await getDoc(userRef);
    return updatedSnap;
}

var updateProjects = []

let userMade = (user) => {
    window.user = user;
    let user_made = new Event("user_made");
    window.dispatchEvent(user_made);

    let code;
    const userRef = doc(db, "users", user.uid);

    let openMain = (mainProject) => {

    }

    getDoc(userRef).then((userSnap) => {
        console.log(userSnap);
        console.log("userSnap", userSnap.get("projects"));
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
            projectDisplay.codeArea.createText(code);
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

let anonSign = () => {
    signInAnonymously(auth).then((userCredential) => {
        console.log("Signed in anonymously, ");
        console.alert("id passed in is: ", userCredential);

        let user = auth.currentUser;
        //user = userCredential.user;
        let uid = user.uid;

        console.log("user is: " + uid);
        return user
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

export let setProject = async (title, data, section="default", projectId="1") => {
    let user = window.user ?? anonSign();
    console.group("--SET PROJECT--");
    console.log(title, data, section, projectId);
    console.log("user");
    console.log("Checking Auth before Write:", {
        currentUser: auth.currentUser,
        isAnonymous: auth.currentUser?.isAnonymous,
        uid: auth.currentUser?.uid
    });
    console.log(`path: /databases/{database}/documents/projects/${user.uid}/${section}/${projectId}`);
    console.groupEnd();

    const projectRef = doc(db, "projects", user.uid, section, title);
    let obj = {
        title: title,
        data: data,
        lastUpdated: serverTimestamp()
    };
    try {
        await setDoc(projectRef, obj, {merge: true});
    }catch (error){
        console.error("oops. That project did not set well.", error);
        console.log(user, user.uid, section, projectId);
        return error;
    }
}

let printProjects = async () => {
    const projectRef = doc(db, "projects", user.uid);
    try {
        let projDoc = await getDoc(projectRef);
        console.log("THIS IS THE DOCUMENT!!!", projDoc);
    } catch (error) {
        console.error(error);
    }
}
