<script setup>
import { reactive, onMounted } from 'vue';
import UserLayout from '@/layouts/UserLayout.vue';

const profileData = reactive({
  imageUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
  email: '',
  name: ''
});

onMounted(() => {
  let savedProfileData = localStorage.getItem('profile-data');
  if (savedProfileData) {
    savedProfileData = JSON.parse(savedProfileData);
    profileData.imageUrl = savedProfileData.imageUrl;
    profileData.email = savedProfileData.email;
    profileData.name = savedProfileData.name;
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileData.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const updateProfile = () => {
  localStorage.setItem('profile-data', JSON.stringify(profileData));
};



</script>

<template>
  <UserLayout>
    <div class="max-w-4xl border border-base-200 shadow-xl mx-auto p-8 bg-white rounded-lg mt-5">
      <div class="font-bold text-2xl">Your Profile</div>
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center">
          <div class="avatar">
            <div class="w-24 rounded-full">
              <img :src="profileData.imageUrl" alt="Profile Image">
            </div>
          </div>
          <input type="file" @change="handleFileUpload">
        </div>
      </div>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <input v-model="profileData.email" type="text" placeholder="Type here" class="input input-bordered w-full" />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input v-model="profileData.name" type="text" placeholder="Type here" class="input input-bordered w-full" />
      </label>

      <button @click="updateProfile" class="btn btn-neutral w-full mt-4">Update Profile</button>
    </div>
  </UserLayout>
</template>
