<script setup>
import { reactive } from 'vue';

import UserLayout from '@/layouts/UserLayout.vue';
import { useCartStore } from '@/stores/user/cart';

const FormData = [
  {
    name: 'Email Address',
    field: 'email'
  },
  {
    name: 'Name',
    field: 'name'
  },
  {
    name: 'Address',
    field: 'address'
  },
  {
    name: 'Note',
    field: 'note'
  }
];
const cartStore = useCartStore();

const userFormData = reactive({
  email: '',
  name: '',
  address: '',
  note: ''
});

const payment = async () => {
  if (userFormData.email && userFormData.name && userFormData.address) {
    const response = await cartStore.placeorder(userFormData)
    location.href = response.redirectUrl

  } else {
    alert('Please fill out all required fields.');
  }
};
</script>

<template>
  <UserLayout>
    <h1 class="text-2xl font-bold m-5">Checkout</h1>
    <div class="flex">
      <section class="flex-auto w-64 bg-base-200 p-8">
        <div v-for="form in FormData" :key="form.name" class="form-control w-full mb-2">
          <label class="label mb-2">
            <span class="label-text">{{ form.name }}</span>
          </label>
          <input v-model="userFormData[form.field]" type="text" :placeholder="'Enter ' + form.name"
            class="input input-bordered w-full p-3" />
        </div>
        <button @click="payment" class="btn btn-neutral w-full my-5">Check out</button>
      </section>

      <section class="flex-auto w-32 bg-slate-100">
        <div v-for="item in cartStore.items" :key="item.name" class="flex bg-slate-10 border m-5 py-5">
          <div class="w-1/3">
            <img class="w-full p-2" :src="item.imageUrl" alt="Product Image">
          </div>
          <div class="w-2/3 flex flex-col justify-between">
            <div>
              <div><b>{{ item.name }}</b></div>
              <div>Quantity: {{ item.quantity }}</div>
            </div>
            <RouterLink class="btn btn-neutral" :to="{ name: 'cart' }">Edit</RouterLink>
          </div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="flex ml-2"><b>Order Summary</b></div>
          <div class="flex justify-between p-2">
            <div>Product price</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
          <div class="flex justify-between p-2">
            <div>Shipping price </div>
            <div>0</div>
          </div>
          <div class="divider"></div>
          <div class="flex justify-between p-4 mb-3">
            <div>Total price</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
        </div>
      </section>
    </div>
  </UserLayout>
</template>
