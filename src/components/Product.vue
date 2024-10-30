<script setup>
import { computed } from 'vue';

defineProps({
  products: Array,
  addToCart: Function,
  buyNow: Function
});

const isDarkTheme = computed(() => localStorage.getItem('theme') === 'dark');

</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-5">
    <div v-for="product in products" :key="product.name"
      :class="['card w-full shadow-xl', isDarkTheme ? 'bg-neutral text-neutral-content' : 'bg-white text-black border border-gray-200']">
      <figure>
        <img class="w-full" :src="product.imageUrl" alt="Product image" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ product.name }}</h2>
        <p>{{ product.about }}</p>
        <div class="card-actions justify-end">
          <button @click="addToCart(product)" class="btn btn-outline btn-primary">Add To Cart</button>
          <button @click="buyNow(product)" class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  </section>
</template>
