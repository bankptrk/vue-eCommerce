<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router';

import { useAdminOrderStore } from '@/stores/admin/order'
import AdminLayout from '@/layouts/AdminLayout.vue'


const adminOrderStore = useAdminOrderStore()

const route = useRoute()
const router = useRouter()

const orderIndex = ref(-1)

const orderData = ref({
    products: []
})

onMounted(async () => {
    if (route.params.id) {
        orderIndex.value = route.params.id
        const selectedOrder = await adminOrderStore.getOrder(orderIndex.value)
        orderData.value = selectedOrder
    }
})


</script>


<template>
    <AdminLayout>
        <div class="shadow-xl p-8 mt-5">
            <div class="text-3xl font-bold">Order detail customer: {{ orderData.customerName }}</div>
            <div class="divider"></div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <div class="font-bold">Order Date</div>
                    <div>{{ orderData.createdAt }}</div>
                </div>
                <div>
                    <div class="font-bold">Order Number</div>
                    <div>{{ orderData.orderId }}</div>
                </div>
                <div>
                    <div class="font-bold">Payment Method</div>
                    <div>{{ orderData.paymentMethod }}</div>
                </div>
                <div>
                    <div class="font-bold">Address</div>
                    <div>{{ orderData.address }}</div>
                </div>
            </div>
            <div class="divider"></div>
            <div v-for="(product, index) in orderData.products" :key="index" class="grid grid-cols-4">
                <div class="mx-auto">
                    <img class="p-4" :src="product.imageUrl">
                </div>
                <div class="mt-10">
                    <div class="font-bold">{{ product.name }}</div>
                    <div>{{ product.description }}</div>
                </div>
                <div class="mt-10">
                    <div class="font-bold">Quantity</div>
                    <div>{{ product.quantity }} piece</div>
                </div>
                <div class="mt-10">{{ product.price }} $</div>
            </div>

            <div class="divider"></div>
            <div class="flex justify-between">
                <div class="font-bold">Total Price</div>
                <div class="mr-5">{{ orderData.totalPrice }} $</div>
            </div>
            <div class="flex justify-end">
                <RouterLink :to="{ name: 'admin-order-list' }" class="btn btn-ghost m-3">Back</RouterLink>
            </div>
        </div>
    </AdminLayout>
</template>