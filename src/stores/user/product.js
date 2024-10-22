import { defineStore } from 'pinia';

import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase';

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [],
    loaded: true,
  }),
  actions: {
    filterProducts(searchText) {
      return this.list.filter((product) => product.name.includes(searchText));
    },
    async loadProduct() {
      const productCol = query(
        collection(db, 'products'),
        where('status', '==', 'open')
      );
      // const productSnapshot = await getDocs(productCol);
      // const products = productSnapshot.docs.map((doc) => doc.data());
      // if (products.length > 0) {
      //   this.list = products;
      //   this.loaded = true;
      // }
      onSnapshot(productCol, (snapshot) => {
        const products = snapshot.docs.map((doc) => {
          const convertedData = doc.data();
          convertedData.productId = doc.id;
          return convertedData;
        });
        this.list = products;
      });
    },
  },
});
