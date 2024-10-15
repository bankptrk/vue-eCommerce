<script setup>
import { reactive } from 'vue';

import AdminLayout from '@/layouts/AdminLayout.vue'


const formData = [
    {
        name: 'Name',
        field: 'name'
    },
    {
        name: 'Image',
        field: 'image'
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

const productData = reactive({
    name: '',
    image: '',
    price: '',
    quantity: 0,
    about: '',
    status: ''
})

const addProduct = () => {
    console.log(productData)
}

</script>


<template>
    <AdminLayout>
        <div class="shadow-xl p-8 mt-5">
            <div class="text-3xl font-bold">ADD</div>
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
                <button class="btn btn-ghost">Back</button>
                <button class="btn btn-neutral" @click="addProduct()">Add</button>
            </div>
        </div>
    </AdminLayout>
</template>