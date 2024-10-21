import { defineStore } from 'pinia';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '@/firebase';

const provider = new GoogleAuthProvider();

export const useAccountStore = defineStore('account', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: {},
    profile: {},
  }),
  actions: {
    async checkAuth() {
      return new Promise((reslove) => {
        onAuthStateChanged(auth, async (user) => {
          try {
            if (user) {
              this.user = user;

              // console.log('user', user);

              const docRef = doc(db, 'users', user.uid);

              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                this.profile = docSnap.data();
              } else {
                const newUser = {
                  fullname: user.displayName,
                  role: 'member',
                  status: 'active',
                  updateAt: new Date(),
                };
                await setDoc(docRef, newUser);
                this.profile = newUser;
              }
              if (
                this.profile.role === 'admin' ||
                this.profile.role === 'moderator'
              ) {
                this.isAdmin = true;
              }
              this.isLoggedIn = true;
              this.profile.email = user.email;
              // console.log('profile', this.profile);
              reslove(true);
            } else {
              reslove(false);
            }
          } catch (error) {
            console.log('error', error);
          }
        });
      });
    },
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, provider);
        this.isLoggedIn = true;
        this.user = result.user;
      } catch (error) {
        console.log('error', error);
      }
    },
    async updateProfile(userData) {
      try {
        const updateUserData = {
          fullname: userData.fullname,
          imageUrl: userData.imageUrl,
        };
        const useRef = doc(db, `users/${this.user.uid}`);
        await updateDoc(useRef, updateUserData);
      } catch (error) {
        console.loe('error', error);
      }
    },
    async logout() {
      try {
        this.isLoggedIn = false;
        this.isAdmin = false;
        await signOut(auth);
      } catch (error) {
        console.log('error', error);
      }
    },
    async signInAdmin(email, password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        this.isLoggedIn = true;
        this.isAdmin = true;
      } catch (error) {
        console.log('error', error);
        switch (error.code) {
          case 'auth/invalid-email':
            throw new Error('Invalid email or password');
          case 'auth/wrong-password':
            throw new Error('Invalid email or password');
          default:
            throw new Error("Can't Login");
        }
      }
    },
  },
});
