import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [
      {
        name: 'Test Product 1',
        imageUrl:
          'https://fastly.picsum.photos/id/849/200/200.jpg?hmac=LwsdGn2endKvoLY10FPqtfqKYCVMbPEp5J6S_tUN1Yg',
        quantity: 10,
        about: 'Description for Test Product 1',
        status: 'open',
        price: 100,
      },
      {
        name: 'Test Product 2',
        imageUrl:
          'https://fastly.picsum.photos/id/688/200/200.jpg?hmac=SPM6DXITCd9R3P5BMqgFMw6QdW-SJ2mPKUvq2g9eF-g',
        quantity: 5,
        about: 'Description for Test Product 2',
        status: 'open',
        price: 150,
      },
    ],
    loaded: true,
  }),
  actions: {
    filterProducts(searchText) {
      return this.list.filter((product) => product.name.includes(searchText));
    },
  },
});
