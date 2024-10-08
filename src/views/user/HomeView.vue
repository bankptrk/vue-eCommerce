<script setup>
import UserLayout from '@/layouts/UserLayout.vue';
import Product from '@/components/Product.vue';

import { useProductStore } from '@/stores/user/product';

const productStore = useProductStore();
</script>

<template>
  <UserLayout>
    <div
      class="hero h-96"
      style="
        background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);
      "
    >
      <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
          <p class="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
      </div>
    </div>

    <!-- Product card-->
    <Product :products="productStore.list"></Product>
  </UserLayout>
</template>
