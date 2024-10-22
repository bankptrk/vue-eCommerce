import { defineStore } from 'pinia';

import { updateDoc, increment, doc, writeBatch } from 'firebase/firestore';
import { db, realtimeDB } from '@/firebase';
import { ref, onValue, set } from 'firebase/database';

import { useAccountStore } from '@/stores/account';

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
        const orderData = {
          ...userData,
          totalPrice: this.summaryPrice,
          paymentMethod: 'Credit Card',
          createDate: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
          }),
          orderNumber: `AA${Math.floor(Math.random() * 90000 + 10000)}`,
          products: this.items,
        };
        localStorage.setItem('order-data', JSON.stringify(orderData));
      } catch (error) {
        console.log('error', error);
      }
    },
    loadCheckout() {
      const orderData = localStorage.getItem('order-data');
      if (orderData) {
        this.checkout = JSON.parse(orderData);
      }
    },
  },
});
