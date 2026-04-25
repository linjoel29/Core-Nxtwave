const admin = require('firebase-admin');

let db;

try {
  if (!admin.apps.length) {
    let credential;
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      // Production (Railway) - JSON string in env variable
      const serviceAccount = JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
      );
      credential = admin.credential.cert(serviceAccount);
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Local development - path to JSON file
      credential = admin.credential.applicationDefault();
    } else {
      throw new Error('No Firebase credentials found');
    }

    admin.initializeApp({
      credential: credential,
      projectId: 'walletin-ca915'
    });
  }
  
  db = admin.firestore();
  console.log('Firebase Admin initialized successfully');
  
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
  process.exit(1);
}

module.exports = { admin, db };
