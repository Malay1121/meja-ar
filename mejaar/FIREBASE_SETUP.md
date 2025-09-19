# Firebase Setup Guide

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `ar-restaurant-menu`
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**

## 🔧 Step 2: Firebase Configuration

### **Add Web App:**

1. In Firebase Console, click **"Web"** icon (`</>`)
2. App nickname: `AR Restaurant Menu`
3. ✅ Check **"Also set up Firebase Hosting"**
4. Click **"Register app"**

### **Get Configuration:**

Copy the config object and add to your `.env.local` file:

```bash
# .env.local
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 💾 Step 3: Setup Firestore Database

### **Create Database:**

1. Go to **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it later)
4. Choose location closest to your users
5. Click **"Done"**

### **Create Collections:**

Create these collections manually or they'll be auto-created when you add data:

#### **1. `restaurants` Collection:**

```javascript
// Document ID: grand-palace
{
  restaurantId: "grand-palace",
  name: "Grand Palace Restaurant",
  description: "Experience royal dining with our extensive menu",
  logoPath: "logos/grand-palace-logo.png", // optional
  primaryColor: "#3B82F6",
  accentColor: "#8B5CF6",
  isActive: true,
  createdAt: new Date()
}
```

#### **2. `menuItems` Collection:**

```javascript
// Document ID: auto-generated
{
  restaurantId: "grand-palace",
  name: "Butter Chicken",
  description: "Creamy tomato-based curry with tender chicken pieces",
  price: 450, // in paisa (₹4.50)
  category: "North Indian",
  imagePath: "dishes/butter-chicken.jpg",
  modelPath: "models/butter-chicken.glb",
  isAvailable: true,
  createdAt: new Date()
}
```

## 🗂️ Step 4: Setup Storage

### **Create Storage Bucket:**

1. Go to **"Storage"** in sidebar
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Choose same location as Firestore
5. Click **"Done"**

### **Create Folder Structure:**

```
📁 your-bucket/
├── 📁 dishes/          # Food images
│   ├── butter-chicken.jpg
│   ├── biryani.jpg
│   └── masala-dosa.jpg
├── 📁 models/          # 3D models (.glb files)
│   ├── butter-chicken.glb
│   ├── biryani.glb
│   └── masala-dosa.glb
└── 📁 logos/           # Restaurant logos
    └── grand-palace-logo.png
```

## 🔒 Step 5: Security Rules

### **Firestore Rules:**

Go to **"Firestore Database" → "Rules"** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to active restaurants
    match /restaurants/{restaurantId} {
      allow read: if resource.data.isActive == true;
    }

    // Allow read access to available menu items
    match /menuItems/{itemId} {
      allow read: if resource.data.isAvailable == true;
    }
  }
}
```

### **Storage Rules:**

Go to **"Storage" → "Rules"** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to images and models
    match /{allPaths=**} {
      allow read: if true;
    }
  }
}
```

## 📱 Step 6: Test Your Setup

1. Add your environment variables to `.env.local`
2. Add sample data to Firestore collections
3. Upload sample images and 3D models to Storage
4. Run your app: `npm run dev`

## 🎯 Sample Data Script

Create a simple script to populate initial data:

```javascript
// scripts/populate-firebase.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/lib/firebase";

const sampleRestaurant = {
  restaurantId: "grand-palace",
  name: "Grand Palace Restaurant",
  description: "Experience royal dining with our extensive menu",
  primaryColor: "#3B82F6",
  accentColor: "#8B5CF6",
  isActive: true,
  createdAt: new Date(),
};

const sampleMenuItems = [
  {
    restaurantId: "grand-palace",
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken pieces",
    price: 450,
    category: "North Indian",
    imagePath: "dishes/butter-chicken.jpg",
    modelPath: "models/butter-chicken.glb",
    isAvailable: true,
    createdAt: new Date(),
  },
  // Add more items...
];

// Run this to populate data
async function populateData() {
  await addDoc(collection(db, "restaurants"), sampleRestaurant);

  for (const item of sampleMenuItems) {
    await addDoc(collection(db, "menuItems"), item);
  }
}
```

## 🎉 You're Ready!

Your Firebase backend is now configured for:

- ✅ Multi-tenant restaurant data
- ✅ Menu items with categories and pricing
- ✅ Image and 3D model storage
- ✅ Real-time updates
- ✅ Secure access rules

**Total Cost**: FREE for development and small scale
**Storage**: 5GB for 3D models and images
**Bandwidth**: 1GB/day downloads
