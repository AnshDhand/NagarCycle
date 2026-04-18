const admin = require('../config/firebaseAdmin');
const db = admin.firestore();

async function cleanup() {
    console.log("Cleaning up example buyer records...");
    
    // List of mock IDs we created in the seed script
    const mockIds = [
        'buyer1_example_com', 
        'buyer2_example_com', 
        'buyer3_example_com', 
        'buyer4_example_com', 
        'buyer5_example_com'
    ];

    const batch = db.batch();
    for (const id of mockIds) {
        batch.delete(db.collection('users').doc(id));
    }

    await batch.commit();
    console.log("Example records deleted. Only real Auth users remain.");
    process.exit(0);
}

cleanup();
