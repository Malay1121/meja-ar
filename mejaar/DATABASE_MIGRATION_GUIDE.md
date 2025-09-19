# Database Structure Migration Guide

## 🔄 Migration Overview

This guide explains the database structure change from a flat collection model to a nested subcollection model.

### Previous Structure (Flat Collections)

```
database/
├── restaurants/
│   ├── {restaurantId}
│   └── ...
├── categories/
│   ├── {categoryId} (with restaurantId field)
│   └── ...
└── menuItems/
    ├── {itemId} (with restaurantId field)
    └── ...
```

### New Structure (Nested Subcollections)

```
database/
└── restaurants/
    └── {restaurantId}/
        ├── (restaurant data)
        ├── categories/
        │   ├── {categoryId}
        │   └── ...
        └── menuItems/
            ├── {itemId}
            └── ...
```

## 🎯 Benefits of Nested Structure

1. **Better Data Organization**: Related data is physically co-located
2. **Improved Query Performance**: No need for `where` clauses on `restaurantId`
3. **Simplified Security Rules**: Easier to control access per restaurant
4. **Cleaner Data Model**: Implicit relationship through document path
5. **Better Scalability**: Each restaurant's data is isolated

## 📋 Migration Steps

### Step 1: Update Code Files

#### ✅ Files Already Updated:

- `scripts/populate-scalable-data.js` - Updated to use nested structure
- `src/services/restaurantService.ts` - Updated to query subcollections
- `setup-database.html` - Updated for nested data operations

### Step 2: Run Migration Script

```bash
# Run the migration script to convert existing data
node scripts/migrate-to-nested-structure.js
```

This script will:

1. ✅ Read all existing data from flat collections
2. ✅ Group data by restaurant
3. ✅ Create nested subcollections under each restaurant
4. ✅ Clean up old flat collections (optional)

### Step 3: Update Security Rules

Apply the new Firestore security rules:

```bash
# Deploy new security rules
firebase deploy --only firestore:rules
```

Or manually copy rules from `firestore-nested.rules` to Firebase Console.

### Step 4: Verify Migration

1. Check Firebase Console to ensure nested structure exists
2. Test the application to ensure data loads correctly
3. Verify that all queries work as expected

## 🔧 Code Changes Made

### Database Population (`populate-scalable-data.js`)

**Before:**

```javascript
// Separate collections
const itemRef = doc(db, "menuItems", item.itemId);
const categoryRef = doc(db, "categories", category.categoryId);
```

**After:**

```javascript
// Nested subcollections
const itemRef = doc(db, "restaurants", restaurantId, "menuItems", item.itemId);
const categoryRef = doc(
  db,
  "restaurants",
  restaurantId,
  "categories",
  category.categoryId
);
```

### Service Layer (`restaurantService.ts`)

**Before:**

```javascript
// Query with where clause
const menuQuery = query(
  collection(db, "menuItems"),
  where("restaurantId", "==", restaurantId),
  where("isActive", "==", true)
);
```

**After:**

```javascript
// Direct subcollection query
const menuItemsRef = collection(db, "restaurants", restaurantId, "menuItems");
const menuQuery = query(menuItemsRef, where("isActive", "==", true));
```

## 🔒 Security Rules

### New Rules Structure

```javascript
match /restaurants/{restaurantId} {
  allow read: if resource.data.isActive == true;

  match /categories/{categoryId} {
    allow read: if get(/databases/$(database)/documents/restaurants/$(restaurantId)).data.isActive == true
                && resource.data.isActive == true;
  }

  match /menuItems/{itemId} {
    allow read: if get(/databases/$(database)/documents/restaurants/$(restaurantId)).data.isActive == true
                && resource.data.isActive == true;
  }
}
```

## 🚨 Important Notes

### Data Integrity

- `restaurantId` field is removed from menu items and categories (implicit in path)
- All other fields remain unchanged
- Document IDs are preserved during migration

### Backward Compatibility

- Migration script preserves all existing data
- Old collections are cleaned up only after successful migration
- Legacy security rules are temporarily maintained

### Query Performance

- ✅ Faster queries (no cross-collection joins needed)
- ✅ Better security isolation per restaurant
- ✅ Reduced bandwidth (only relevant data fetched)

## 🔍 Verification Checklist

After migration, verify:

- [ ] All restaurants appear in the application
- [ ] Menu items display correctly for each restaurant
- [ ] Categories are properly grouped
- [ ] AR models still load correctly
- [ ] Search and filtering work as expected
- [ ] No 404 or permission errors in console

## 🆘 Rollback Plan

If issues arise, you can revert by:

1. Stop using the new application code
2. Redeploy the old service files
3. Restore from the backup collections (if migration script kept them)

## 📞 Support

If you encounter issues:

1. Check browser console for specific error messages
2. Verify Firebase Console shows the expected nested structure
3. Ensure security rules are properly deployed
4. Test with a simple restaurant first

---

**Migration Status**: ✅ Ready to execute
**Estimated Downtime**: < 5 minutes
**Data Loss Risk**: Minimal (backup strategy included)
