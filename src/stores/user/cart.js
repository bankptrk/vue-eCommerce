import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    checkout: {}
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
  },
  actions: {
    loadCart() {
      const previousCart = localStorage.getItem('cart-data');
      if (previousCart) {
        this.items = JSON.parse(previousCart);
      }
    },
    addOrUpdateCart(productData) {
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
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    addToCart(productData) {
      this.addOrUpdateCart(productData);
    },
    buyNow(productData) {
      this.addOrUpdateCart(productData);
    },
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity;
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    removeItemInCart(index) {
      this.items.splice(index, 1);
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    placeorder(userData){
        const orderData = {
            ...userData,
            totalPrice: this.summaryPrice,
            paymentMethod: 'Credit Card',
            createDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
            orderNumber: `AA${Math.floor((Math.random() * 90000) + 10000)}`,
            products: this.items
        }
        localStorage.setItem('order-data', JSON.stringify(orderData))
    },
    loadCheckout(){
        const orderData = localStorage.getItem('order-data')
        if (orderData){
            this.checkout = JSON.parse(orderData)
        }
    }
  },
});
