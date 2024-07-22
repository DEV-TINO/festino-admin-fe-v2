<script setup>
import { onMounted, ref, watch } from 'vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

import { useRoute } from 'vue-router';
import ModalView from './views/ModalView.vue';
import { initFlowbite } from 'flowbite';

const route = useRoute();

const showNavBar = ref(true);

const updateNavBarVisibility = () => {
  console.log('Current route:', route.name);
  showNavBar.value = route.name !== 'Login';
};

watch(() => route.name, updateNavBarVisibility);

onMounted(() => {
  initFlowbite();
});
</script>

<template>
  <ModalView />
  <div
    id="container"
    class="grid grid-cols-1 md:grid-cols-[minmax(50px,_1fr)_minmax(auto,_1920px)_minmax(50px,_1fr)] grid-rows-[100px_1fr_200px] min-h-screen w-full gap-0"
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
</template>

<style scoped lang="css"></style>
