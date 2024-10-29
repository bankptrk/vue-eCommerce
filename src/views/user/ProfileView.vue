<script setup>
import { reactive, onMounted } from 'vue';
import UserLayout from '@/layouts/UserLayout.vue';
import { storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAccountStore } from '@/stores/account';
import { useEventStore } from '@/stores/event';

const accountStore = useAccountStore();
const eventStore = useEventStore();

const profileData = reactive({
  imageUrl: '',
  email: '',
  fullname: '',
  isLoading: false,
  imageFile: null
});

onMounted(() => {
  const savedProfileData = accountStore.profile;
  if (savedProfileData) {
    profileData.imageUrl = savedProfileData.imageUrl;
    profileData.email = savedProfileData.email;
    profileData.fullname = savedProfileData.fullname;
  }
  if (localStorage.getItem('profileUpdateSuccess')) {
    eventStore.popupMessage('success', 'Update successful');
    localStorage.removeItem('profileUpdateSuccess');
  }
});

const handleFileUpload = async (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        eventStore.popupMessage('error', 'Only image files are allowed (jpg, jpeg, png, gif).');
        return;
      }
      profileData.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        profileData.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const updateProfile = async () => {
  profileData.isLoading = true;
  try {
    const updateProfileData = {
      imageUrl: profileData.imageUrl,
      fullname: profileData.fullname,
      email: profileData.email,
    };

    await accountStore.updateProfile(updateProfileData);

    if (profileData.imageFile) {
      const uploadRef = ref(storage, `users/${accountStore.user.uid}/${profileData.imageFile.name}`);
      const snapshot = await uploadBytes(uploadRef, profileData.imageFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      updateProfileData.imageUrl = downloadUrl;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.setItem('profileUpdateSuccess', 'true');
    location.reload();
  } catch (error) {
    eventStore.popupMessage('error', 'Failed to update profile. Please try again.');
    console.error('Profile update error:', error);
  } finally {
    profileData.isLoading = false;
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

      <button @click="updateProfile" class="btn btn-neutral w-full m-4" :disabled="profileData.isLoading">
        Update Profile
      </button>

      <div v-if="profileData.isLoading"
        class="absolute inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
        <div class="spinner border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full w-16 h-16 animate-spin">
        </div>
        <span class="text-white text-xl ml-4">Loading...</span>
      </div>
    </div>
  </UserLayout>
</template>
