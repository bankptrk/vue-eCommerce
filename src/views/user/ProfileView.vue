<script setup>
import { reactive, onMounted } from 'vue';
import UserLayout from '@/layouts/UserLayout.vue';

import { storage } from '@/firebase'
import { useAccountStore } from '@/stores/account'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const accountStore = useAccountStore()

const profileData = reactive({
  imageUrl: '',
  email: '',
  fullname: ''
});

onMounted(() => {
  const savedProfileData = accountStore.profile
  if (savedProfileData) {
    profileData.imageUrl = (savedProfileData.imageUrl || 'https://cdn.discordapp.com/attachments/410748661149073410/1297838156002889748/user.png?ex=67176179&is=67160ff9&hm=ab880042067f0278df9d8ec52a7a474bdd9660eab83036cbc404ee98ace5a8af&');
    profileData.email = savedProfileData.email;
    profileData.fullname = savedProfileData.fullname;
  }
});

const handleFileUpload = async (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const uploadRef = ref(storage, `users/${accountStore.user.uid}/${file.name}`)

      const snapshot = await uploadBytes(uploadRef, file)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      profileData.imageUrl = downloadUrl;
    }
  } catch (error) {
    console.log('error', error)
  }

};

const updateProfile = async () => {
  try {
    const updateprofileData = {
      imageUrl: profileData.imageUrl,
      fullname: profileData.fullname,
      email: profileData.email
    }
    await accountStore.updateProfile(updateprofileData)
  } catch (error) {
    console.log('error', error)
  }

};



</script>

<template>
  <UserLayout>
    <div class="max-w-4xl border border-base-200 shadow-xl mx-auto p-8 bg-white rounded-lg m-5">
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
        <input type="text" placeholder="Type here" class="input input-bordered w-full"
          :value="accountStore.profile.email" disabled />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input v-model="profileData.fullname" type="text" placeholder="Type here" class="input input-bordered w-full" />
      </label>

      <button @click="updateProfile" class="btn btn-neutral w-full m-4">Update Profile</button>
    </div>
  </UserLayout>
</template>
