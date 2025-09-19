import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User 
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from './firebase'

export interface RestaurantAdmin {
  uid: string // This will be the restaurant ID (e.g., "the-spice-garden")
  email: string
  displayName: string
  restaurantId: string // Same as uid for consistency
  role: 'admin' | 'manager' | 'staff'
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
  permissions: {
    manageMenu: boolean
    manageProfile: boolean
    viewAnalytics: boolean
    manageStaff: boolean
  }
}

class AuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await this.updateLastLogin(result.user.uid)
      return result.user
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Create new restaurant admin account with specific UID
  async createRestaurantAdmin(
    email: string, 
    password: string, 
    displayName: string,
    restaurantId: string, // This will be used as the UID
    role: 'admin' | 'manager' | 'staff' = 'admin'
  ): Promise<User> {
    try {
      // Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile
      await updateProfile(result.user, { displayName })
      
      // Create admin document in restaurants-admin collection
      // Using restaurantId as the document ID
      const adminData: Omit<RestaurantAdmin, 'createdAt' | 'lastLogin'> & { 
        createdAt: any, 
        lastLogin?: any 
      } = {
        uid: result.user.uid,
        email,
        displayName,
        restaurantId, // The restaurant they manage
        role,
        createdAt: serverTimestamp(),
        isActive: true,
        permissions: this.getDefaultPermissions(role)
      }
      
      // Store in restaurants-admin collection with restaurantId as document ID
      await setDoc(doc(db, 'restaurants-admin', restaurantId), adminData)
      
      return result.user
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Get admin data by Firebase UID
  async getAdminDataByUID(uid: string): Promise<RestaurantAdmin | null> {
    try {
      // Search for admin document where uid field matches
      const adminCollectionRef = collection(db, 'restaurants-admin')
      const q = query(adminCollectionRef, where('uid', '==', uid))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate()
        } as RestaurantAdmin
      }
      return null
    } catch (error) {
      console.error('Error fetching admin data:', error)
      return null
    }
  }

  // Get admin data by restaurant ID
  async getAdminData(restaurantId: string): Promise<RestaurantAdmin | null> {
    try {
      const adminDoc = await getDoc(doc(db, 'restaurants-admin', restaurantId))
      if (adminDoc.exists()) {
        const data = adminDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate()
        } as RestaurantAdmin
      }
      return null
    } catch (error) {
      console.error('Error fetching admin data:', error)
      return null
    }
  }

  // Get restaurant data by restaurant ID
  async getRestaurantData(restaurantId: string): Promise<any> {
    try {
      const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId))
      if (restaurantDoc.exists()) {
        return restaurantDoc.data()
      }
      return null
    } catch (error) {
      console.error('Error fetching restaurant data:', error)
      return null
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error('Failed to sign out')
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Update last login timestamp
  private async updateLastLogin(firebaseUID: string): Promise<void> {
    try {
      // Find the restaurant admin by Firebase UID and update lastLogin
      const adminCollectionRef = collection(db, 'restaurants-admin')
      const q = query(adminCollectionRef, where('uid', '==', firebaseUID))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref
        await setDoc(docRef, {
          lastLogin: serverTimestamp()
        }, { merge: true })
      }
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  // Get default permissions based on role
  private getDefaultPermissions(role: string) {
    switch (role) {
      case 'admin':
        return {
          manageMenu: true,
          manageProfile: true,
          viewAnalytics: true,
          manageStaff: true
        }
      case 'manager':
        return {
          manageMenu: true,
          manageProfile: true,
          viewAnalytics: true,
          manageStaff: false
        }
      case 'staff':
        return {
          manageMenu: true,
          manageProfile: false,
          viewAnalytics: false,
          manageStaff: false
        }
      default:
        return {
          manageMenu: false,
          manageProfile: false,
          viewAnalytics: false,
          manageStaff: false
        }
    }
  }

  // Get user-friendly error messages
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      default:
        return 'An error occurred. Please try again'
    }
  }
}

export const authService = new AuthService()