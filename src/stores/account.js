import { defineStore } from 'pinia';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';

const provider = new GoogleAuthProvider();

export const useAccountStore = defineStore('account', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: {},
  }),
  actions: {
    async checkAuth() {
      return new Promise((reslove) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user;
            // fix back
            if (user.email === 'admin@test.com') {
              this.isAdmin = true;
            }
            this.isLoggedIn = true;
            reslove(true);
          } else {
            reslove(false);
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
        console.log(error);
      }
    },
    async logout() {
      try {
        this.isLoggedIn = false;
        this.isAdmin = false;
        await signOut(auth);
      } catch (error) {
        console.log(error);
      }
    },
    async signInAdmin(email, password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        this.isLoggedIn = true;
        this.isAdmin = true;
      } catch (error) {
        console.log(error);
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
