const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err);
    }
} else {
    try {
        serviceAccount = require('./serviceAccountKey.json');
    } catch (err) {
        console.warn("serviceAccountKey.json not found. Firebase Admin may not initialize correctly.");
    }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.error("CRITICAL: Firebase service account credentials missing!");
}

module.exports = admin;
