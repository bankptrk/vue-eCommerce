<script setup>
import { useRouter } from 'vue-router'

import UserLayout from '@/layouts/UserLayout.vue';
import Product from '@/components/Product.vue';

import { useProductStore } from '@/stores/user/product';
import { useCartStore } from '@/stores/user/cart'

const router = useRouter()
const cartStore = useCartStore()

const productStore = useProductStore();

const addToCart = (product) => {
  cartStore.addToCart(product)
}

const buyNow = (product) => {
  cartStore.buyNow(product)
  router.push({ name: 'cart' })
}
</script>

<template>
  <UserLayout>
    <div class="hero h-96" style="
        background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);
      ">
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
    <Product :products="productStore.list" :addToCart="addToCart" :buyNow="buyNow"></Product>
  </UserLayout>
</template>
