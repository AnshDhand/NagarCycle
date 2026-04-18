const admin = require('../config/firebaseAdmin');
const auth = admin.auth();
const db = admin.firestore();

async function syncAuthUsers() {
    console.log("Fetching all registered users from Firebase Authentication...");
    
    try {
        const listUsersResult = await auth.listUsers(1000);
        const users = listUsersResult.users;
        
        console.log(`Found ${users.length} total users in Auth.`);

        const batch = db.batch();
        
        users.forEach((user) => {
            const userRef = db.collection('users').doc(user.uid);
            
            // For real Auth users, we assign a randomized location near Delhi 
            // so they show up in your "Nearby" filter for the demo.
            // In a real app, they would update this themselves via GPS.
            const randomLat = 28.6139 + (Math.random() * 0.08 - 0.04);
            const randomLng = 77.2090 + (Math.random() * 0.08 - 0.04);

            batch.set(userRef, {
                uid: user.uid,
                email: user.email || "no-email",
                displayName: user.displayName || user.email.split('@')[0],
                lat: randomLat,
                lng: randomLng,
                role: 'buyer',
                lastActive: admin.firestore.FieldValue.serverTimestamp(),
                source: 'auth_sync'
            }, { merge: true });
        });

        await batch.commit();
        console.log(`Successfully synced ${users.length} real users to the database!`);
        process.exit(0);

    } catch (error) {
        console.error("Error syncing users:", error);
        process.exit(1);
    }
}

syncAuthUsers();
