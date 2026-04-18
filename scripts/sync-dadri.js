const admin = require('../config/firebaseAdmin');
const auth = admin.auth();
const db = admin.firestore();

// Coordinates for Dadri/Noida area where you are located
const DADRI_LAT = 28.55; 
const DADRI_LNG = 77.55;

async function syncToDadri() {
    console.log("Syncing users to your specific location (Dadri/Noida) for stability...");
    
    try {
        const listUsersResult = await auth.listUsers(10);
        const users = listUsersResult.users;
        
        const batch = db.batch();
        
        users.forEach((user, index) => {
            const userRef = db.collection('users').doc(user.uid);
            
            // Scatter them very slightly but keep them safely within 5km
            // 0.01 degrees is roughly 1km
            const offsetLat = (Math.random() - 0.5) * 0.02; // max 1km away
            const offsetLng = (Math.random() - 0.5) * 0.02; 

            batch.set(userRef, {
                uid: user.uid,
                email: user.email || "no-email",
                displayName: user.displayName || user.email.split('@')[0],
                lat: DADRI_LAT + offsetLat,
                lng: DADRI_LNG + offsetLng,
                role: 'buyer',
                lastActive: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        });

        await batch.commit();
        console.log(`Synced ${users.length} users near Dadri. Refresh your dashboard!`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

syncToDadri();
