<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import Product from '@/components/Product.vue';
import UserLayout from '@/layouts/UserLayout.vue';

import { useProductStore } from '@/stores/user/product';
import { useCartStore } from '@/stores/user/cart';

const route = useRoute();

const productStore = useProductStore();
const cartStore = useCartStore();

const searchText = ref('');


watch(() => route.query.q, (newSearchText) => {
  searchText.value = newSearchText;
}, { immediate: true }
);

const filterProducts = computed(() => {
  return productStore.filterProducts(searchText.value);
});

const addToCart = (product) => {
  cartStore.addToCart(product)
}

</script>

<template>
  <UserLayout>
    <div class="text-2xl m-5">
      Search: <b>{{ searchText }}</b>
    </div>

    <Product :products="filterProducts" :addToCart="addToCart"></Product>
  </UserLayout>
</template>
