<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminUserStore } from '@/stores/admin/user'
import { useEventStore } from '@/stores/event'

const formData = [
    {
        name: 'Name',
        field: 'fullname',
        type: 'text'
    },
    {
        name: 'Role',
        field: 'role',
        type: 'select',
        dropdownList: ['admin', 'moderator', 'user']
    },
    {
        name: 'Status',
        field: 'status',
        type: 'select',
        dropdownList: ['active', 'inactive']
    }
]

const adminUserStore = useAdminUserStore()
const eventStore = useEventStore()
const route = useRoute()
const router = useRouter()

const userIndex = ref(-1)

const userData = reactive({
    fullname: '',
    role: '',
    status: ''
})

const updateUser = () => {
    adminUserStore.updateUser(userIndex.value, userData)
    eventStore.popupMessage('success', 'Update user successful')
    router.push({ name: 'admin-users-list' })
}

onMounted(() => {
    if (route.params.id) {
        userIndex.value = parseInt(route.params.id)
        const selectedUser = adminUserStore.getUser(userIndex.value)
        userData.fullname = selectedUser.fullname
        userData.role = selectedUser.role
        userData.status = selectedUser.status
    }
})
</script>


<template>
    <AdminLayout>
        <div class="shadow-xl p-8 mt-5">
            <div class="text-3xl font-bold">Update User</div>
            <div class="divider"></div>
            <div class="grid grid-cols-1 gap-2">
                <label v-for="form in formData" :key="form.name" class="form-control w-full">
                    <div class="label">
                        <span class="label-text">{{ form.name }}</span>
                    </div>
                    <input v-if="form.type === 'text'" type="text" placeholder="Type here"
                        class="input input-bordered w-full " v-model="userData[form.field]" />
                    <select v-if="form.type === 'select'" class="input input-bordered w-full"
                        v-model="userData[form.field]">
                        <option disabled selected>{{ form.field === 'role' ? 'Choose role' : 'Choose status' }}</option>
                        <option v-for="item in form.dropdownList" :key="item">{{ item }}</option>
                    </select>
                </label>
            </div>
            <div class="flex mt-5 justify-end">
                <div class="mr-5">
                    <RouterLink :to="{ name: 'admin-users-list' }" class="btn btn-ghost">Back</RouterLink>
                </div>
                <div>
                    <button class="btn btn-neutral" @click="updateUser()">Update</button>
                </div>
            </div>
        </div>

    </AdminLayout>
</template>