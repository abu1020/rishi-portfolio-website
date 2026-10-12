import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  authError = signal<string | null>(null);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser.set(user);
      this.isLoading.set(false);

      if (user) {
        // Save/update user profile in Firestore securely
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Client',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error('Error saving user profile:', err);
        }
      }
    });

    // Test connection
    this.testConnection();
  }

  private async testConnection() {
    try {
      await getDoc(doc(db, 'test', 'connection'));
    } catch (error) {
      // expected if test doc doesn't exist, but confirms connectivity
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.authError.set(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google login error:', error);
      this.authError.set(error.message || 'Google Sign-In failed.');
    }
  }

  async logout(): Promise<void> {
    this.authError.set(null);
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      this.authError.set(error.message || 'Logout failed.');
    }
  }
}
