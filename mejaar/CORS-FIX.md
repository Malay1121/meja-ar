# Firebase Storage CORS Setup for MejaAR

## Problem

The CORS error occurs because Firebase Storage doesn't allow cross-origin requests from localhost by default.

## Quick Fix Options:

### Option 1: Firebase Storage Rules (Recommended for Development)

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `mejaar-app`
3. Go to Storage → Rules
4. Update rules to:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Allow all reads for development
      allow write: if request.auth != null;
    }
  }
}
```

### Option 2: Google Cloud SDK CORS Setup

1. Install Google Cloud SDK from: https://cloud.google.com/sdk/docs/install
2. Authenticate: `gcloud auth login`
3. Set project: `gcloud config set project mejaar-app`
4. Apply CORS: `gsutil cors set cors.json gs://mejaar-app.firebasestorage.app`

### Option 3: Use Proxy (Temporary)

Add to your `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/storage": {
        target: "https://firebasestorage.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/storage/, ""),
      },
    },
  },
});
```

## Fallback Solution

The app now includes fallback 3D models from public CDNs when Firebase models fail to load.

## Test the Fix

1. Apply one of the solutions above
2. Refresh the app: http://localhost:5173/bella-italia
3. Try viewing an item in AR

## Production Note

For production, ensure proper CORS configuration and authentication rules are in place.
