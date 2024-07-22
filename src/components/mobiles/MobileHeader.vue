<script setup>
import router from '@/router';
import IconHeaderBack from '@/components/icons/mobiles/IconHeaderBack.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  isMainPage: {
    type: Boolean,
    default: false,
  },
});

const handleClickBackButton = () => {
  router.push({ name: 'mobile-main' });
};
</script>

<template>
  <div class="w-full h-[60px] bg-white flex justify-between items-center px-6 shadow-xs mb-7">
    <div class="w-7">
      <IconHeaderBack v-if="!isMainPage" @click="handleClickBackButton()" />
    </div>
    <p class="font-medium text-xl">{{ title }}</p>
    <div class="w-[42px] text-xs underline text-secondary-300 underline-offset-4">
      <p v-if="isMainPage">로그아웃</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
