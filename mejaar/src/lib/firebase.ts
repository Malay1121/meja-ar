import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDYrE6RE9wzG33p3aAlmv4QReFdxn_zRKQ",
  authDomain: "mejaar-app.firebaseapp.com",
  projectId: "mejaar-app",
  storageBucket: "mejaar-app.firebasestorage.app",
  messagingSenderId: "881726352245",
  appId: "1:881726352245:web:c9efd1db6816af20e8013c",
  measurementId: "G-Q13TMJG460"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
