<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useAccountStore } from '@/stores/account'

const menus = [
    {
        name: 'Dashboard',
        routerName: 'admin-dashboard'
    },
    {
        name: 'Product',
        routerName: 'admin-product-list'
    },
    {
        name: 'Order',
        routerName: 'admin-order-list'
    },
    {
        name: 'User',
        routerName: 'admin-users-list'
    }
]

const route = useRoute()
const activeMenu = ref('')
const router = useRouter()

const accountStore = useAccountStore()

onMounted(() => {
    activeMenu.value = route.name
})

const logout = async () => {
    try {
        await accountStore.logout()
        router.push({ name: 'login' })
    } catch (error) {
        console.log(error)
    }
}

</script>

<template>
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content mx-4">
            <!-- Page content here -->
            <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
                Open drawer
            </label>
            <slot></slot>
        </div>
        <div class="drawer-side">
            <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <!-- Sidebar content here -->
                <li class="text-3xl font-bold">
                    <a>Backoffice</a>
                </li>
                <li v-for="menu in menus" :key="menu.name">
                    <RouterLink :class="menu.routerName === activeMenu ? 'active' : ''" :to="{ name: menu.routerName }">
                        {{ menu.name }}</RouterLink>
                </li>
                <li>
                    <a @click="logout">Logout</a>
                </li>
            </ul>
        </div>
    </div>



</template>