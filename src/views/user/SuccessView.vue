<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue';
import { useCartStore } from '@/stores/user/cart';


import { useEventStore } from '@/stores/event'


const route = useRoute();
const router = useRouter();

const eventStore = useEventStore();
const cartStore = useCartStore();
const orderData = ref({});


onMounted(async () => {
  const orderId = route.query.order_id;
  if (orderId) {
    try {
      const data = await cartStore.loadCheckout(orderId);
      if (data) {
        orderData.value = data;
      }
    } catch (error) {
      router.push({ name: 'home' })
      eventStore.popupMessage('error', 'Order unsuccessful!')
    }
  }
});

</script>

<template>
  <UserLayout>
    <div class="max-w-4xl border border-base-200 shadow-xl mx-auto p-8 bg-white rounded-lg">
      <div class="text-center">
        <div class="text-4xl font-bold text-primary">Thank you for your purchase!</div>
        <div class="font-bold mt-4 text-lg">
          Summary of your order, <span v-if="orderData.name">{{ orderData.name }}</span>
        </div>
      </div>
      <div class="divider my-6"></div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div class="flex flex-col items-center">
          <div class="font-bold text-base">Order date</div>
          <div class="text-gray-600">{{ orderData.createAt }}</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-bold text-base">Order number</div>
          <div class="text-gray-600">{{ orderData.orderNumber }}</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-bold text-base">Payment method</div>
          <div class="text-gray-600">{{ orderData.paymentMethod }}</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-bold text-base">Address</div>
          <div class="text-gray-600">{{ orderData.address }}</div>
        </div>
      </div>
      <div class="divider my-6"></div>
      <div v-for="product in orderData.products" :key="product.name"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-center border-b pb-4">
        <div class="flex justify-center">
          <img class="w-32 h-auto rounded-lg shadow-md" :src="product.imageUrl" alt="Product Image">
        </div>
        <div class="flex flex-col justify-between">
          <div class="font-bold text-lg">{{ product.name }}</div>
          <div class="text-gray-600">Quantity: {{ product.quantity }}</div>
          <div class="font-bold text-lg">Total Price: {{ (product.price * product.quantity).toLocaleString() }} ฿</div>
        </div>
      </div>
      <div class="divider my-6"></div>
      <div class="flex justify-between">
        <div class="font-bold">Total product prices</div>
        <div>{{ orderData.totalPrice }}</div>
      </div>
      <div class="flex justify-between mt-4">
        <div class="font-blod">Shipping</div>
        <div>0</div>
      </div>
      <div class="divider my-6"> </div>
      <div class="flex justify-between">
        <div class="font-bold">Total price</div>
        <div>{{ orderData.totalPrice }}</div>
      </div>


    </div>
  </UserLayout>
</template>
