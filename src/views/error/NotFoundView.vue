<script setup>
import IconNotFound from '@/components/icons/IconNotFound.vue';
</script>
<template>
  <div class="flex flex-col justify-center items-center pt-24">
    <!-- Easter eggs -->
    <IconNotFound :width="404" />
    <p class="text-3xl py-4">에러가 발생했습니다. 다시 시도해주세요.</p>
    <router-link
      to="/"
      class="is-button w-48 h-16 text-2xl text-center mt-4 flex items-center justify-center rounded-lg"
      >홈으로 돌아가기</router-link
    >
  </div>
</template>

<style lang="scss" scoped></style>
