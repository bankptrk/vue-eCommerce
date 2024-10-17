<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';



import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminProductStore } from '@/stores/admin/product'
import { useEventStore } from '@/stores/event'


const formData = [
    {
        name: 'Name',
        field: 'name'
    },
    {
        name: 'Image',
        field: 'imageUrl'
    },
    {
        name: 'Price',
        field: 'price'
    },
    {
        name: 'Quantity',
        field: 'quantity'
    },
    {
        name: 'About',
        field: 'about'
    }
]

const adminProductStore = useAdminProductStore()
const eventStore = useEventStore()
const router = useRouter()
const route = useRoute()
const productIndex = ref('-1')
const mode = ref('ADD')

const productData = reactive({
    name: '',
    imageUrl: '',
    price: '',
    quantity: 0,
    about: '',
    status: ''
})



const addProduct = async () => {
    try {
        if (mode.value === 'EDIT') {
            await adminProductStore.updateProduct(productIndex.value, productData)
            eventStore.popupMessage('success', 'Edit product successful')
        } else {
            await adminProductStore.addProduct(productData)
            eventStore.popupMessage('success', 'Add product successful')
        }
        router.push({
            name: 'admin-product-list'
        })
    } catch (error) {
        console.log('error', error)
    }


}

onMounted(async () => {
    if (route.params.id) {
        productIndex.value = route.params.id
        mode.value = 'EDIT'
        const selectedProduct = await adminProductStore.getProduct(productIndex.value)
        if (selectedProduct) {
            productData.name = selectedProduct.name;
            productData.imageUrl = selectedProduct.imageUrl;
            productData.price = selectedProduct.price;
            productData.quantity = selectedProduct.quantity;
            productData.about = selectedProduct.about;
            productData.status = selectedProduct.status;
        } else {
            eventStore.popupMessage('info', 'Product not found!')
            router.push({ name: 'admin-product-list' });
        }
    }
})

</script>


<template>
    <AdminLayout>
        <div class="shadow-xl p-8 mt-5">
            <div class="text-3xl font-bold">{{ mode }}</div>
            <div class="divider"></div>
            <div class="grid grid-cols-2 gap-8">
                <label v-for="form in formData" :key="form.name" class="form-control w-full">
                    <div class="label">
                        <span class="label-text">{{ form.name }}</span>
                    </div>
                    <input v-model="productData[form.field]" type="text" placeholder="Type here"
                        class="input input-bordered w-full " />
                </label>
            </div>
            <div class="divider"></div>
            <div class="grid grid-cols-2 gap-8">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Status</span>
                    </div>
                    <select v-model="productData.status" class="select select-bordered">
                        <option disabled selected>Choose status</option>
                        <option value="open">Open</option>
                        <option value="close">Close</option>
                    </select>
                </label>
            </div>
            <div class="flex mt-5 justify-end">
                <div class="mr-5">
                    <RouterLink :to="{ name: 'admin-product-list' }" class="btn btn-ghost">Back</RouterLink>
                </div>
                <div>
                    <button class="btn btn-neutral" @click="addProduct()">{{ mode }}</button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>