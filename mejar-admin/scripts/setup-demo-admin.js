import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config (matches your main project)
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔧 Setting up demo restaurant admin for "the-spice-garden"...');
console.log('=======================================================');

async function setupDemoAdmin() {
  const restaurantId = 'the-spice-garden';
  const demoEmail = 'demo@restaurant.com';
  const demoPassword = 'demo123';
  const displayName = 'The Spice Garden Admin';

  try {
    // Check if restaurant exists in restaurants collection
    console.log('🔍 Checking if restaurant exists...');
    const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
    
    if (!restaurantDoc.exists()) {
      console.log('❌ Restaurant "the-spice-garden" not found in restaurants collection!');
      console.log('   Please ensure the restaurant document exists first.');
      return;
    }
    
    console.log('✅ Restaurant "the-spice-garden" found');
    const restaurantData = restaurantDoc.data();
    console.log(`   Restaurant Name: ${restaurantData.name || 'N/A'}`);
    console.log(`   Cuisine: ${restaurantData.cuisine || 'N/A'}`);

    // Create Firebase Auth user
    console.log('🔐 Creating Firebase Auth user...');
    let user;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
      user = userCredential.user;
      console.log(`✅ Firebase Auth user created with UID: ${user.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Email already exists, signing in instead...');
        const userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
        user = userCredential.user;
        console.log(`✅ Signed in existing user with UID: ${user.uid}`);
      } else {
        throw error;
      }
    }

    // Create admin document in restaurants-admin collection
    console.log('📝 Creating restaurants-admin document...');
    const adminData = {
      uid: user.uid,
      email: demoEmail,
      displayName: displayName,
      restaurantId: restaurantId,
      role: 'admin',
      createdAt: serverTimestamp(),
      isActive: true,
      permissions: {
        manageMenu: true,
        manageProfile: true,
        viewAnalytics: true,
        manageStaff: true
      }
    };

    // Store in restaurants-admin collection with restaurantId as document ID
    await setDoc(doc(db, 'restaurants-admin', restaurantId), adminData);
    console.log(`✅ Admin document created in restaurants-admin/${restaurantId}`);

    // Verify the setup
    console.log('🔍 Verifying setup...');
    const adminDoc = await getDoc(doc(db, 'restaurants-admin', restaurantId));
    if (adminDoc.exists()) {
      const adminInfo = adminDoc.data();
      console.log('✅ Verification successful!');
      console.log('');
      console.log('📊 Admin Setup Summary:');
      console.log('========================');
      console.log(`Restaurant ID: ${restaurantId}`);
      console.log(`Firebase UID: ${adminInfo.uid}`);
      console.log(`Email: ${adminInfo.email}`);
      console.log(`Display Name: ${adminInfo.displayName}`);
      console.log(`Role: ${adminInfo.role}`);
      console.log(`Permissions: ${JSON.stringify(adminInfo.permissions, null, 2)}`);
      console.log('');
      console.log('🎉 Demo admin setup complete!');
      console.log('');
      console.log('🔐 Login Credentials:');
      console.log('=====================');
      console.log(`Email: ${demoEmail}`);
      console.log(`Password: ${demoPassword}`);
      console.log('');
      console.log('🌐 Admin Panel URL: http://localhost:3001');
      console.log('');
      console.log('✨ The admin user can now manage "the-spice-garden" restaurant!');
    } else {
      console.log('❌ Verification failed - admin document not found');
    }

  } catch (error) {
    console.error('❌ Error setting up demo admin:', error);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Ensure Firebase configuration is correct');
    console.error('   2. Check Firebase Auth is enabled in console'); 
    console.error('   3. Verify Firestore security rules allow writes');
    console.error('   4. Make sure "the-spice-garden" restaurant exists');
  }
}

// Execute the setup
setupDemoAdmin()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });