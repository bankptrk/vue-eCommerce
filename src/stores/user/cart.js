import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
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
    addToCart(productData) {
        const findIndexProduct = this.items.findIndex(item => item.name === productData.name)
        if (findIndexProduct === -1){
            productData.quantity = 1;
            this.items.push(productData)
        }else{
            const currItem = this.items[findIndexProduct]
            this.updateQuantity(findIndexProduct, currItem.quantity + 1)
        }
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity;
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
    removeItemInCart(index) {
      this.items.splice(index, 1);
      localStorage.setItem('cart-data', JSON.stringify(this.items));
    },
  },
});
