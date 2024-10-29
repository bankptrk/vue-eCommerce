<script setup>
import UserLayout from '@/layouts/UserLayout.vue';
import Close from '@/components/icons/Close.vue';
import { useCartStore } from '@/stores/user/cart';
import { RouterLink } from 'vue-router';


const cartStore = useCartStore();

const changeQuantity = (event, index) => {
  const newQuantity = parseInt(event.target.value)
  cartStore.updateQuantity(index, newQuantity)
}
</script>

<template>
  <UserLayout>
    <h1 class="text-2xl font-bold m-5">Shopping Cart</h1>
    <div class="flex">
      <div class="flex-auto w-64 bg-base-200 p-2">
        <div v-if="cartStore.items.length === 0">Cart is empty</div>
        <div v-else v-for="(item, index) in cartStore.items" :key="index" class="flex">
          <div class="flex-1">
            <img class="w-full p-10" :src="item.imageUrl" />
          </div>
          <div class="flex-1">
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="relative grid grid-cols-2">
                  <div>
                    <div>
                      <b>{{ item.name }}</b>
                    </div>
                    <div>{{ item.about }}</div>
                    <div>{{ item.price }}</div>
                  </div>
                  <div>
                    <select v-model="item.quantity" @change="changeQuantity($event, index)"
                      class="select select-bordered w-1/2">
                      <option v-for="quantity in [1, 2, 3, 4, 5]" :key="quantity">
                        {{ quantity }}
                      </option>
                    </select>
                  </div>
                  <div @click="cartStore.removeItemInCart(index)" class="absolute top-0 right-0">
                    <Close></Close>
                  </div>
                </div>
              </div>
              <div>In stock</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-auto w-32 bg-slate-100 p-2">
        <div class="text-xl font-bold">Order Summary</div>
        <div class="my-4 divide-y divide-black">
          <div class="flex justify-between py-2">
            <div>ราคาสินค้าทั้งหมด</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
          <div class="flex justify-between py-2">
            <div>ค่าส่ง</div>
            <div>0</div>
          </div>
          <div class="flex justify-between py-2">
            <div>ราคารวม</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
          <div v-if="cartStore.items.length === 0">
            <button class="btn btn-neutral w-full mt-4" disabled>
              Buy
            </button>
          </div>
          <div v-else>
            <RouterLink :to="{ name: 'checkout' }" class="btn btn-neutral w-full mt-4">
              Buy
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>
