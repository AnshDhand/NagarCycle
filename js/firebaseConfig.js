// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnt41Jwppp-rvbDNl6GOPEndHoEjHsGmg",
    authDomain: "nagarcycle-3710f.firebaseapp.com",
    projectId: "nagarcycle-3710f",
    storageBucket: "nagarcycle-3710f.firebasestorage.app",
    messagingSenderId: "917905120543",
    appId: "1:917905120543:web:0588615b729f8fab4f242a",
    measurementId: "G-5Y6X3D0SM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup };
