import { defineStore } from 'pinia';

export const useAdminProductStore = defineStore('admin-product', {
    state: () => ({
        list: [],
        loaded: false
    }),
    actions: {
        loadProduct(){
            const products = localStorage.getItem('admin-product')
            if(products){
                this.list = JSON.parse(products)
                this.loaded = true
            }
        },
        getProduct(index){
            if(!this.loaded){
                this.loadProduct()
            }
            return this.list[index]
        },
        addProduct(productData){
            productData.remainQuantity = productData.quantity
            productData.updateAt = (new Date()).toISOString()
            this.list.push(productData)
            localStorage.setItem('admin-product', JSON.stringify(this.list))
        },
        updateProduct(index, productData){
            this.list[index].name = productData.name
            this.list[index].imageURL = productData.imageURL
            this.list[index].price = productData.price
            this.list[index].quantity = productData.quantity
            this.list[index].remainQuantity = productData.quantity
            this.list[index].status = productData.status
            this.list[index].updateAt = (new Date()).toISOString()
            localStorage.setItem('admin-product', JSON.stringify(this.list))

        },
        removeProduct(index){
            this.list.splice(index, 1)
            localStorage.setItem('admin-product', JSON.stringify(this.list))

        }
    }

})