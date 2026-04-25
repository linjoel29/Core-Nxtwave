// Firestore database instance — use this everywhere instead of supabaseClient
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2CrGFEAEaRPe4cqxV_1HWKiBa1wTzxwc",
  authDomain: "walletin-ca915.firebaseapp.com",
  projectId: "walletin-ca915",
  storageBucket: "walletin-ca915.firebasestorage.app",
  messagingSenderId: "661937495232",
  appId: "1:661937495232:web:9a50aca896a3a0c3392125",
  measurementId: "G-RZLHFSPLJG",
};

// Re-use existing app if already initialized (hot-reload safe)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
