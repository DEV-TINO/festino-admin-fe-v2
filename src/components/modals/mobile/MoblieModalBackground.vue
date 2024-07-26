<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useBaseModal } from '@/stores/baseModal';

const baseModalStore = useBaseModal();

const preventScroll = () => {
  document.getElementsByTagName('html')[0].style.overflow = 'hidden';
};

const allowScroll = () => {
  document.getElementsByTagName('html')[0].style.overflow = 'auto';
};

const handleEscKey = (e) => {
  if (e.key === 'Escape') {
    baseModalStore.closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscKey);
  preventScroll();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
  allowScroll();
});
</script>

<template>
  <div class="fixed z-50 mx-auto inset-0 max-w-[500px] w-full h-full bg-black/50 flex justify-center items-center px-6">
    <slot></slot>
  </div>
</template>

<style lang="css" scoped></style>