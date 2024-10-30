import { defineStore } from 'pinia';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';

import { db } from '@/firebase';

export const useAdminProductStore = defineStore('admin-product', {
  state: () => ({
    list: [],
    loaded: false,
  }),
  actions: {
    async loadProduct() {
      try {
        const productCol = collection(db, 'products');
        const productSnapshot = await getDocs(productCol);
        const products = productSnapshot.docs.map((doc) => {
          const convertedProduct = doc.data();
          convertedProduct.pid = doc.id;
          convertedProduct.updateAt = new Date();
          return convertedProduct;
        });
        this.list = products;
      } catch (error) {
        console.log('error', error);
      }
    },
    async getProduct(pid) {
      try {
        const productRef = doc(db, 'products', pid);
        const productSnapshot = await getDoc(productRef);
        return productSnapshot.data();
      } catch (error) {
        console.log('error', error);
      }
    },
    async addProduct(productData) {
      try {
        productData.price = Number(productData.price);
        productData.quantity = Number(productData.quantity);

        productData.remainQuantity = productData.quantity;
        productData.updateAt = new Date();
        const productCol = collection(db, 'products');
        await addDoc(productCol, productData);
      } catch (error) {
        console.log('error', error);
      }
    },
    async updateProduct(pid, productData) {
      try {
        const updateProductData = {};
        updateProductData.name = productData.name;
        updateProductData.imageUrl = productData.imageUrl;
        updateProductData.price = Number(productData.price);
        updateProductData.quantity = Number(productData.quantity);
        updateProductData.remainQuantity = Number(productData.quantity);
        updateProductData.status = productData.status;
        updateProductData.updateAt = new Date();

        const productRef = doc(db, 'products', pid);
        await setDoc(productRef, updateProductData);
      } catch (error) {
        console.log('error', error);
      }
    },
    async removeProduct(pid) {
      try {
        const productRef = doc(db, 'products', pid);
        await deleteDoc(productRef);
      } catch (error) {
        console.log('error', error);
      }
    },
  },
});
