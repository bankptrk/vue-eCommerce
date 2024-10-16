import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [],
    loaded: true,
  }),
  actions: {
    filterProducts(searchText) {
      return this.list.filter((product) => product.name.includes(searchText));
    },
    loadProduct(){
      const products = localStorage.getItem('admin-product')
      if(products){
          this.list = JSON.parse(products)
          this.loaded = true
      }
    }
  },
});
