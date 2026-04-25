const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

if (!admin.apps.length) {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credPath) {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS is not set in your .env file.');
    console.error('   Add this line to server/.env:');
    console.error('   GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\your-service-account.json');
    process.exit(1);
  }

  // Resolve absolute or relative path
  const resolvedPath = path.isAbsolute(credPath)
    ? credPath
    : path.join(__dirname, '..', credPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Service account file not found at: ${resolvedPath}`);
    console.error('   Make sure the path in GOOGLE_APPLICATION_CREDENTIALS is correct.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId:  'walletin-ca915',
  });

  console.log('✅ Firebase Admin initialized — project: walletin-ca915');
}

const db = admin.firestore();

module.exports = { admin, db };
