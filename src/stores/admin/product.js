import { defineStore } from 'pinia';

export const useAdminProductStore = defineStore('admin-product', {
    state: () => ({
        list: [
            {
                name: 'test',
                imageURL: 'https://fastly.picsum.photos/id/337/200/200.jpg?hmac=9bd24xSAcmLdObO71hB9dXskhXQmQ2b0YB3QTAzhUtY',
                price: 200,
                quantity: 20,
                remainQuantity: 6,
                status: 'open',
                updateAt: (new Date()).toISOString()
            }
        ]
    }),
    actions: {
        getProduct(index){
            return this.list[index]
        },
        addProduct(productData){
            productData.remainQuantity = productData.quantity
            productData.updateAt = (new Date()).toISOString()
            this.list.push(productData)
        },
        updateProduct(index, productData){
            this.list[index].name = productData.name
            this.list[index].imageURL = productData.imageURL
            this.list[index].price = productData.price
            this.list[index].quantity = productData.quantity
            this.list[index].remainQuantity = productData.quantity
            this.list[index].status = productData.status
            this.list[index].updateAt = (new Date()).toISOString()
        },
        removeProduct(index){
            this.list.splice(index, 1)
        }
    }

})