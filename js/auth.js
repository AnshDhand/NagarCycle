import { auth, googleProvider, signInWithPopup } from "./firebaseConfig.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const errorMsg = document.getElementById('error-msg');
const googleBtn = document.getElementById('google-btn');

let isLogin = true;

// Toggle between Login and Signup
toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Login to access your dashboard';
        submitBtn.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join the circular economy today';
        submitBtn.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
    }
    errorMsg.style.display = 'none';
});

// Handle Form Submit
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        // Save selected portal for redirection
        const selectedPortal = document.querySelector('input[name="portal-type"]:checked')?.value || 'user';
        localStorage.setItem('targetPortal', selectedPortal);

        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        // Redirect handled by onAuthStateChanged
    } catch (error) {
        showError(error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
    }
});

// Handle Google Login
googleBtn.addEventListener('click', async () => {
    try {
        // Default to user portal for Google login if not specified
        if (!localStorage.getItem('targetPortal')) {
            localStorage.setItem('targetPortal', 'user');
        }
        await signInWithPopup(auth, googleProvider);
        // Redirect handled by onAuthStateChanged
    } catch (error) {
        showError(error.message);
    }
});

// Auth State Listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('User logged in:', user);
        // Get the ID token to verify backend connection (optional step for now)
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token); // Store for API calls

        // Handle Portal Redirection
        const targetPortal = localStorage.getItem('targetPortal') || 'user';
        
        if (targetPortal === 'collector') {
            // Redirect to index and signal to open collector portal
            localStorage.setItem('openCollectorOnLoad', 'true');
            window.location.href = 'index.html';
        } else {
            // Redirect to user dashboard
            window.location.href = 'dashboard.html';
        }
    }
});

function showError(message) {
    errorMsg.textContent = message.replace('Firebase: ', '');
    errorMsg.style.display = 'block';
}
