<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import { storage } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

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
        field: 'imageUrl',
        type: 'upload-image'
    },
    {
        name: 'Price',
        field: 'price',
        type: 'number'
    },
    {
        name: 'Quantity',
        field: 'quantity',
        type: 'number'
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

const handleFileUpload = async (event) => {
    try {
        let path = ''
        if (productIndex.value !== -1) {
            path = productIndex.value + '-'
        }
        const file = event.target.files[0];
        if (file) {
            const uploadRef = storageRef(storage, `products/${path}${file.name}`)

            const snapshot = await uploadBytes(uploadRef, file)
            const downloadUrl = await getDownloadURL(snapshot.ref)
            productData.imageUrl = downloadUrl;
        }
    } catch (error) {
        console.log('error', error)
    }

};

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
                    <input v-if="form.type !== 'upload-image'" v-model="productData[form.field]"
                        :type="form.type || 'text'" placeholder="Type here" class="input input-bordered w-full " />
                    <div v-else>
                        <div class="avatar">
                            <div class="w-24 rounded-full">
                                <img :src="productData[form.field]">
                            </div>
                        </div>
                        <div>
                            <label class="form-control w-full max-w-xs">
                                <input type="file" class="file-input file-input-bordered w-full max-w-xs file-input-sm"
                                    @change="handleFileUpload" />
                            </label>
                        </div>
                    </div>
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