<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

import { useAdminUserStore } from '@/stores/admin/user'

import AdminLayout from '@/layouts/AdminLayout.vue'

import Table from '@/components/Table.vue';




const adminUserStore = useAdminUserStore()

const changeStatus = async (index) => {
    let selectedUser = adminUserStore.list[index]
    selectedUser.status = selectedUser.status === 'active' ? 'inactive' : 'active'
    await adminUserStore.updateUser(selectedUser.uid, selectedUser)
}

onMounted(async () => {
    await adminUserStore.loadUser()
})


</script>


<template>
    <AdminLayout>
        <div class="flex items-center justify-between my-5">
            <div class="text-3xl font-bold">User</div>
        </div>
        <Table :headers="['Name', 'Role', 'Status', 'Updated At', '']">
            <tr v-for="(user, index) in adminUserStore.list" :key="user.fullname">
                <td>{{ user.fullname }}</td>
                <td>{{ user.role }}</td>
                <td>
                    <div :class="user.status === 'active' ? 'badge badge-success' : 'badge badge-warning'">
                        {{ user.status }}
                    </div>
                </td>
                <td>{{ user.updateAt }}</td>
                <td>
                    <div class="flex gap-2">
                        <RouterLink :to="{ name: 'admin-user-update', params: { id: user.uid } }"
                            class="btn btn-neutral">
                            Edit</RouterLink>
                        <button class="btn btn-neutral" @click="changeStatus(index)">{{ user.status === 'active' ?
                            'Disable' : 'Enable' }}</button>
                    </div>
                </td>
            </tr>
        </Table>
    </AdminLayout>
</template>