<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router';


import { useProductStore } from '@/stores/user/product'
import { useEventStore } from '@/stores/event'



const productStore = useProductStore()
const eventStore = useEventStore()


onMounted(() => {
  productStore.loadProduct()
})

</script>

<template>
  <div v-if="eventStore.alert" class="toast toast-top toast-end">
    <div class="alert" :class="`alert-${eventStore.data.status}`">
      <span>{{ eventStore.data.message }}</span>
    </div>
  </div>
  <RouterView />
</template>
