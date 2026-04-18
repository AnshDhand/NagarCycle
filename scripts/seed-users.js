const admin = require('../config/firebaseAdmin');
const db = admin.firestore();

const mockData = [
    { email: 'buyer1@example.com', lat: 28.6139, lng: 77.2090, displayName: 'Amit Kumar' },
    { email: 'buyer2@example.com', lat: 28.6200, lng: 77.2150, displayName: 'Sreya Singh' },
    { email: 'buyer3@example.com', lat: 28.6100, lng: 77.2000, displayName: 'Rohan Sharma' },
    { email: 'buyer4@example.com', lat: 28.5900, lng: 77.2200, displayName: 'Vikram Seth' },
    { email: 'buyer5@example.com', lat: 28.6300, lng: 77.1900, displayName: 'Priya Das' }
];

async function seed() {
    console.log("Starting to sync real buyer data to Firestore...");
    
    for (const data of mockData) {
        const id = data.email.replace('@', '_').replace('.', '_');
        await db.collection('users').doc(id).set({
            ...data,
            uid: id,
            role: 'buyer',
            lastActive: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Synced: ${data.displayName}`);
    }
    
    console.log("Done! Refresh your Firebase Console and Dashboard.");
    process.exit();
}

seed().catch(err => {
    console.error("Seed failed:", err);
    process.exit(1);
});
