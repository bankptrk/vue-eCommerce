<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import Product from '@/components/Product.vue';
import UserLayout from '@/layouts/UserLayout.vue';

import { useProductStore } from '@/stores/user/product';

const productStore = useProductStore();
const searchText = ref('');

const route = useRoute();
watch(
  () => route.query.q,
  (newSearchText) => {
    searchText.value = newSearchText;
  },
  { immediate: true }
);

const filterProducts = computed(() => {
  return productStore.filterProducts(searchText.value);
});
</script>

<template>
  <UserLayout>
    <div class="text-2xl m-5">
      Search: <b>{{ searchText }}</b>
    </div>

    <Product :products="filterProducts"></Product
  ></UserLayout>
</template>
