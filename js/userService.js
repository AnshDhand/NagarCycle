import { db, auth } from "./firebaseConfig.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

/**
 * Updates the user's location in Firestore
 */
async function updateUserPresence(lat, lng) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Anonymous User",
            lat: lat,
            lng: lng,
            role: localStorage.getItem('targetPortal') || 'user',
            lastActive: serverTimestamp()
        }, { merge: true });
        
        console.log("Location synced to Firestore:", lat, lng);
    } catch (error) {
        console.error("Error syncing location:", error);
    }
}

// Automatically sync location when auth state changes and GPS is available
onAuthStateChanged(auth, (user) => {
    console.log("Auth State Changed. User:", user ? user.email : "Logged Out");
    if (user) {
        console.log("Requesting GPS for sync...");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    console.log("GPS Found:", latitude, longitude);
                    updateUserPresence(latitude, longitude);
                },
                (err) => {
                    console.error("GPS Error:", err.message);
                    alert("Please enable Location Access to see buyers near you!");
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
        }
    } else {
        console.warn("No user logged in. Sync skipped.");
    }
});
