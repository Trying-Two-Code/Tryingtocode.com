import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

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

export function createEmail(email, password){
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        alert("creating account...");
    }).catch((error) => {
        console.error(error);
        if(password.length < 6){
            console.log("must be over 5 characters");
        }
    });
}

function signIn(auth, email, password){
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
    }).catch((error) => console.error(error));
}

function authChanged(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User signed in:", user.uid);
        } else {
            console.log("User signed out");
        }
    });
}
