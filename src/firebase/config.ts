import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAf6iJ4hNdJijF-4sWWt7Y-akXhT9mKCFE",
  authDomain: "qtholidays-app-a9595.firebaseapp.com",
  projectId: "qtholidays-app-a9595",
  storageBucket: "qtholidays-app-a9595.firebasestorage.app",
  messagingSenderId: "492855809684",
  appId: "1:492855809684:web:5927cefca2f046552e8681",
  measurementId: "G-MZP2YFKF8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;