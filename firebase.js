import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInAnonymously } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInAnonymously(auth).then((userCredential) => {
    const user = userCredential.user;
}).catch((error) => console.error(error));

createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
}).catch((error) => console.error(error));

signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
}).catch((error) => console.error(error));

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in:", user.uid);
    } else {
        console.log("User signed out");
    }
});