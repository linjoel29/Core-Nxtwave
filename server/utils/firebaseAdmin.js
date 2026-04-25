const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'walletin-ca915'
  });
}

const db = admin.firestore();
module.exports = { admin, db };
