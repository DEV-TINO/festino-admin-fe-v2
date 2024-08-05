<script setup>
import { onMounted, ref, watch } from 'vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

import { useRoute } from 'vue-router';
import ModalView from './views/ModalView.vue';
import { initFlowbite } from 'flowbite';
import MobileModalView from './views/MobileModalView.vue';

const route = useRoute();

const showNavBar = ref(true);
const isMobile = ref(false);

const updateNavBarVisibility = () => {
  showNavBar.value = route.name !== 'Login';
};

const checkIsMobile = () => {
  isMobile.value = route.name.includes('Mobile');
};

watch(() => route.name, updateNavBarVisibility);
watch(() => route.name, checkIsMobile);

onMounted(() => {
  initFlowbite();
});
</script>

<template>
  <ModalView />
  <MobileModalView />
  <div
    id="container"
    class="grid grid-cols-1 md:grid-cols-[minmax(50px,_1fr)_minmax(auto,_1920px)_minmax(50px,_1fr)] grid-rows-[100px_1fr_200px] min-h-screen w-full gap-0"
    v-if="!isMobile"
  >
    <!-- Header -->
    <div class="col-span-1 md:col-span-3 h-[100px]">
      <NavBar v-if="showNavBar" />
    </div>

    <!-- Left Side Bar -->
    <div class="min-w-[50px] hidden md:block"></div>

    <!-- Main Section -->
    <div class="overflow-x-auto">
      <router-view></router-view>
    </div>

    <!-- Right Side Bar -->
    <div class="min-w-[50px] hidden md:block"></div>

    <!-- Footer -->
    <div class="col-span-1 md:col-span-3 h-[200px]">
      <Footer />
    </div>
  </div>
  <div v-if="isMobile">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="css"></style>
