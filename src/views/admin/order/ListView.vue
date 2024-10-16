<script setup>

import { RouterLink } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue'
import Table from '@/components/Table.vue';
import { useAdminOrderStore } from '@/stores/admin/order'


const adminOrderStore = useAdminOrderStore()
</script>


<template>
    <AdminLayout>
        <div class="flex items-center justify-between my-5">
            <div class="text-3xl font-bold">Order</div>

        </div>
        <Table :headers="['Customer Name', 'Price', 'Status', 'Update At', '']">
            <tr v-for="(order, index) in adminOrderStore.list" :key="index">
                <th>{{ order.customerName }}</th>
                <td>{{ order.totalPrice }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.updatedAt }}</td>
                <td>
                    <div class="flex gap-1">
                        <RouterLink :to="{ name: 'admin-orders-detail', params: { id: index } }" class="btn">See Detail
                        </RouterLink>
                    </div>
                </td>

            </tr>

        </Table>
    </AdminLayout>
</template>