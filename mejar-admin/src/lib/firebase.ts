import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Firebase configuration - matches your main MejaAR project
const firebaseConfig = {
    apiKey: "AIzaSyDYrE6RE9wzG33p3aAlmv4QReFdxn_zRKQ",
    authDomain: "mejaar-app.firebaseapp.com",
    projectId: "mejaar-app",
    storageBucket: "mejaar-app.firebasestorage.app",
    messagingSenderId: "881726352245",
    appId: "1:881726352245:web:10cb11248f65123be8013c",
    measurementId: "G-PKQZGTQFX4"
  };

// Initialize Firebase
let app: FirebaseApp
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)

export default app