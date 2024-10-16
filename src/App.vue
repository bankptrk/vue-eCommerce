<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router';

import { useCartStore } from '@/stores/user/cart';
import { useProductStore } from '@/stores/user/product'
import { useEventStore } from '@/stores/event'


const cartStore = useCartStore()
const productStore = useProductStore()
const eventStore = useEventStore()


onMounted(() => {
  cartStore.loadCart()
  productStore.loadProduct()
})

</script>

<template>
  <div v-if="eventStore.alert" class="toast">
    <div class="alert" :class="`aleart-${eventStore.data.status}`">
      <span>{{ eventStore.data.message }}</span>
    </div>
  </div>
  <RouterView />
</template>
