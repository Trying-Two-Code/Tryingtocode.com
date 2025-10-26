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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

function anon(auth){
    signInAnonymously(auth).then((userCredential) => {
        const user = userCredential.user;
    }).catch((error) => console.error(error));
}

export async function createEmail(email, password){
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
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

async function signIn(email, password){
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // return the actual user
    } catch (error) {
        console.error(error);
        throw error; // propagate error to caller
    }
}

export async function signInUp(email, password){
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

const db = getFirestore(app);

export async function initUserData(user){
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
            const updatedSnap = await getDoc(userRef);
            console.log("now coins: ", userSnap.data().coins);
        } else{
            await setDoc(userRef, {
                email: user.email || null,
                displayName: user.displayName || null,
                coins: user.coins || 0,
                projects: user.projects || null
        });
    }
}

export async function setUserDatapoint(email=null, displayName=null, coins=null, projects=null){
    const userRef = doc(db, "users", window.user.id)
    const updatedSnap = await getDoc(userRef);
    await setDoc(userRef, {
        email: email || updatedSnap.email,
        displayName: displayName || updatedSnap.displayName,
        coins: coins || updatedSnap.coins,
        projects: projects || updatedSnap.projects
    });
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User signed in:", user.uid);
        await initUserData(user);
        window.user = user;
        let user_made = new Event("user_made");
        window.dispatchEvent(user_made);
    } else {
        console.log("User signed out");
        anonSign();
    }

});

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

