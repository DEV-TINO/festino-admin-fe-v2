<script setup>
import MobileModalBackground from '../components/modals/mobile/MoblieModalBackground.vue';
import MobileConfirmModal from '../components/modals/mobile/MobileConfirmModal.vue';
import MobileReserveModal from '../components/modals/mobile/MobileReserveModal.vue';
import MobileLoadingModal from '../components/modals/mobile/MobileLoadingModal.vue';

import { useBaseModal } from '@/stores/baseModal';
import { storeToRefs } from 'pinia';
import MobileMenuModal from '@/components/modals/mobile/MobileMenuModal.vue';

const baseModalStore = useBaseModal();
const { isMobileModalOpen, modalType } = storeToRefs(baseModalStore);
const { closeMobileModal } = baseModalStore;
</script>

<template>
  <MobileModalBackground v-if="isMobileModalOpen" @click="closeMobileModal()">
    <MobileConfirmModal v-if="modalType === 'mobileConfirm'" @click.stop />
    <MobileReserveModal v-if="modalType === 'mobileReserve'" @click.stop />
    <MobileMenuModal v-if="modalType === 'mobileMenu'" @click.stop />
    <MobileLoadingModal v-if="modalType === 'mobileLoading'" />
  </MobileModalBackground>
</template>

<style lang="css" scoped></style>
