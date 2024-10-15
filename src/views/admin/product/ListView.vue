<script setup>
import { RouterLink } from 'vue-router'

import { useAdminProductStore } from '@/stores/admin/product'

import AdminLayout from '@/layouts/AdminLayout.vue'
import Edit from '@/components/icons/Edit.vue'
import Trash from '@/components/icons/Trash.vue'

const adminProduct = useAdminProductStore()
</script>

<template>
    <AdminLayout>
        <div class="flex items-center justify-between my-5">
            <div class="text-3xl font-bold">Product</div>
            <div>
                <RouterLink :to="{ name: 'admin-product-create' }" class="btn btn-neutral">Add New</RouterLink>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Updated At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in adminProduct.list" :key="product.name">
                        <th>{{ product.name }}</th>
                        <td><img class="w-12" :src="product.imageURL" alt="Product Image" /></td>
                        <td>{{ product.price }}</td>
                        <td>{{ product.remainQuantity }}/{{ product.quantity }} </td>
                        <td>
                            <div class="badge badge-success">
                                {{ product.status }}
                            </div>
                        </td>
                        <td>{{ product.updateAt }}</td>
                        <td>
                            <div class="flex gap-3">

                                <Edit />

                                <Trash />

                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </AdminLayout>
</template>
