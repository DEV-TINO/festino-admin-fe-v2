<script setup>
import ModalBackground from '../components/modals/ModalBackground.vue';
import BoothPopup from '../components/modals/BoothPopup.vue';
import MenuModal from '../components/modals/MenuModal.vue';

import { useBaseModal } from '@/stores/baseModal';
import { storeToRefs } from 'pinia';
import ReservePopup from '@/components/modals/ReservePopup.vue';
import LoadingModal from '@/components/modals/LoadingModal.vue';

const baseModalStore = useBaseModal();
const { isModalOpen, modalType } = storeToRefs(baseModalStore);
</script>
<template>
  <ModalBackground v-if="isModalOpen">
    <BoothPopup v-if="modalType === 'boothPopup'" />
    <MenuModal v-if="modalType === 'menuModal'" />
    <ReservePopup v-if="modalType === 'reservePopup'" />
    <LoadingModal v-if="modalType === 'loadingModal'" />
  </ModalBackground>
</template>

<style lang="scss" scoped></style>
