import { defineStore } from 'pinia';
import axios from 'axios';

import { doc, getDoc } from 'firebase/firestore';
import { db, realtimeDB } from '@/firebase';
import { ref, onValue, set } from 'firebase/database';

import { useAccountStore } from '@/stores/account';

Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY);

const createSource = (amount) => {
  return new Promise((resolve, reject) => {
    Omise.createSource(
      'rabbit_linepay',
      {
        amount: amount * 100,
        currency: 'THB',
      },
      (statusCode, response) => {
        if (statusCode !== 200) {
          return reject(response);
        }
        resolve(response);
      }
    );
  });
};

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    checkout: {},
  }),
  getters: {
    summaryQuantity(state) {
      return state.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    summaryPrice(state) {
      return state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    },
    user(state) {
      const accountStore = useAccountStore();
      return accountStore.user;
    },
  },
  actions: {
    loadCart() {
      if (this.user.uid) {
        const cartRef = ref(realtimeDB, `carts/${this.user.uid}`);
        onValue(
          cartRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              this.items = data;
            }
          },
          (err) => {
            console.log('error', err);
          }
        );
      } else {
        const previousCart = localStorage.getItem('cart-data');
        if (previousCart) {
          this.items = JSON.parse(previousCart);
        }
      }
    },
    async addOrUpdateCart(productData) {
      const findIndexProduct = this.items.findIndex(
        (item) => item.name === productData.name
      );
      if (findIndexProduct === -1) {
        productData.quantity = 1;
        this.items.push(productData);
      } else {
        const currItem = this.items[findIndexProduct];
        this.updateQuantity(findIndexProduct, currItem.quantity + 1);
      }
      await set(ref(realtimeDB, `carts/${this.user.uid}`), this.items);
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    addToCart(productData) {
      this.addOrUpdateCart(productData);
    },
    buyNow(productData) {
      this.addOrUpdateCart(productData);
    },
    async updateQuantity(index, quantity) {
      this.items[index].quantity = quantity;
      await set(ref(realtimeDB, `carts/${this.user.uid}`), this.items);
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    async removeItemInCart(index) {
      this.items.splice(index, 1);
      await set(ref(realtimeDB, `carts/${this.user.uid}`), this.items);
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    async placeorder(userData) {
      try {
        const checkoutData = {
          ...userData,
          products: this.items.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        };

        const omiseResponse = await createSource(this.summaryPrice);

        const response = await axios.post('/api/placeorder', {
          source: omiseResponse.id, //omise source token
          checkout: checkoutData,
        });
        return response.data;
      } catch (error) {
        console.log('error', error);
      }
    },
    async loadCheckout(orderId) {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnapshot = await getDoc(orderRef);
        let orderData = orderSnapshot.data();
        orderData.createAt = orderData.createAt.toDate();
        orderData.orderNumber = orderSnapshot.id;
        console.log('Order data loaded:', orderData);
        return orderData;
      } catch (error) {
        console.error('Failed to load checkout:', error.message);
        throw new Error(error.message);
      }
    },
  },
});
