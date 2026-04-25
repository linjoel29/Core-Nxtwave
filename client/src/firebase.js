import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2CrGFEAEaRPe4cqxV_1HWKiBa1wTzxwc",
  authDomain: "walletin-ca915.firebaseapp.com",
  projectId: "walletin-ca915",
  storageBucket: "walletin-ca915.firebasestorage.app",
  messagingSenderId: "661937495232",
  appId: "1:661937495232:web:9a50aca896a3a0c3392125",
  measurementId: "G-RZLHFSPLJG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
