import { defineStore } from 'pinia';

import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/firebase';

export const useAdminUserStore = defineStore('admin-user', {
  state: () => ({
    list: [],
  }),
  actions: {
    async loadUser() {
      try {
        const userCol = collection(db, 'users');
        const userSnapshot = await getDocs(userCol);
        const userList = userSnapshot.docs.map((doc) => {
          let convertedUser = doc.data();
          convertedUser.uid = doc.id;
          // ตรวจสอบว่ามี updatedAt และเป็น Timestamp ก่อนแปลง
          if (
            convertedUser.updatedAt &&
            typeof convertedUser.updatedAt.toDate === 'function'
          ) {
            convertedUser.updatedAt = convertedUser.updatedAt.toDate();
          } else {
            convertedUser.updatedAt = null; // ตั้งค่าเป็น null หรือค่า default อื่น
          }
          return convertedUser;
        });
        this.list = userList;
      } catch (error) {
        console.log('error', error);
      }
    },
    async getUser(uid) {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userRef);
        return userSnapshot.data();
      } catch (error) {
        console.log('error', error);
      }
    },
    async updateUser(uid, userData) {
      try {
        const updateUserData = {
          fullname: userData.fullname,
          role: userData.role,
          status: userData.status,
          updatedAt: new Date(),
        };
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, updateUserData);
      } catch (erorr) {
        console.log('error', error);
      }
    },
  },
});
