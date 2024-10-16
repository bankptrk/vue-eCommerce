<script setup>
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue';

import { useAdminProductStore } from '@/stores/admin/product'
import { useEventStore } from '@/stores/event'

import AdminLayout from '@/layouts/AdminLayout.vue'
import Edit from '@/components/icons/Edit.vue'
import Trash from '@/components/icons/Trash.vue'
import Table from '@/components/Table.vue';



const adminProductStore = useAdminProductStore()
const eventStore = useEventStore()

onMounted(() => {
    adminProductStore.loadProduct()
})

const removeProduct = (index) => {
    adminProductStore.removeProduct(index)
    eventStore.popupMessage('success', 'Delete product successful')

}

</script>

<template>
    <AdminLayout>
        <div class="flex items-center justify-between my-5">
            <div class="text-3xl font-bold">Product</div>
            <div>
                <RouterLink :to="{ name: 'admin-product-create' }" class="btn btn-neutral">Add New</RouterLink>
            </div>
        </div>
        <Table :headers="['Name', 'Image', 'Price', 'Quantity', 'Status', 'Updated At', '']">
            <tr v-for="(product, index) in adminProductStore.list" :key="product.name">
                <th>{{ product.name }}</th>
                <td><img class="w-12" :src="product.imageUrl" alt="Product Image" /></td>
                <td>{{ product.price }}</td>
                <td>{{ product.remainQuantity }}/{{ product.quantity }} </td>
                <td>
                    <div :class="product.status === 'open' ? 'badge badge-success' : 'badge badge-error'">
                        {{ product.status }}
                    </div>
                </td>
                <td>{{ product.updateAt }}</td>
                <td>
                    <div class="flex gap-1">
                        <RouterLink :to="{ name: 'admin-product-update', params: { id: index } }"
                            class="btn btn-ghost p-3">
                            <Edit class="w-5 h-5" />
                        </RouterLink>
                        <button class="btn btn-ghost p-3" @click="removeProduct(index)">
                            <Trash class="w-5 h-5" />
                        </button>
                    </div>
                </td>
            </tr>
        </Table>

    </AdminLayout>
</template>
