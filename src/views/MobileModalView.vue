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
</script>

<template>
  <MobileModalBackground v-if="isMobileModalOpen">
    <MobileConfirmModal v-if="modalType === 'mobileConfirm'" />
    <MobileReserveModal v-if="modalType === 'mobileReserve'" />
    <MobileMenuModal v-if="modalType === 'mobileMenu'" />
    <MobileLoadingModal v-if="modalType === 'mobileLoading'" />
  </MobileModalBackground>
</template>

<style lang="css" scoped></style>
