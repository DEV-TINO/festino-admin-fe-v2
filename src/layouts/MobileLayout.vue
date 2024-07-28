<script setup>
import MobileHeader from '@/components/mobiles/MobileHeader.vue';
import { RouterView, useRouter } from 'vue-router';
import { ref, watchEffect } from 'vue';

const router = useRouter();
const isLogin = ref(false);
const isLoginPage = ref(false);
const isMainPage = ref(false);
const title = ref('');

watchEffect(() => {
  const currentRoute = router.currentRoute.value;
  const currentRouteName = currentRoute.name;
  isLoginPage.value = currentRouteName == 'mobileLogin';
  isMainPage.value = currentRouteName == 'mobileMain';
  if (currentRouteName == 'mobile-booth') {
    title.value = '부스 등록 및 수정';
  } else {
    title.value = '컴퓨터공학과';
  }
});
</script>

<template>
  <div class="min-w-[375px] max-w-[500px] bg-white min-h-screen shadow-xs mx-auto">
    <MobileHeader v-if="!isLoginPage" :title="title" :isMainPage="isMainPage" />
    <RouterView />
  </div>
</template>

<style lang="css" scoped></style>
