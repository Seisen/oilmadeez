// firebase-config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add auth imports

// Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAR7RN7ZuYZZWAYNjsU1c7ndYe7sVuel6c",
    authDomain: "oilpaintmadeez.firebaseapp.com",
    projectId: "oilpaintmadeez",
    storageBucket: "oilpaintmadeez.firebasestorage.app",
    messagingSenderId: "218726191220",
    appId: "1:218726191220:web:bfffde03dab18426ed0121"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Google Auth Provider

export { db, auth, googleProvider };
