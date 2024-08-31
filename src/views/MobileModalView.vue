<script setup>
import MobileModalBackground from '../components/modals/mobile/MoblieModalBackground.vue';
import MobileConfirmModal from '../components/modals/mobile/MobileConfirmModal.vue';
import MobileReserveModal from '../components/modals/mobile/MobileReserveModal.vue';
import MobileLoadingModal from '../components/modals/mobile/MobileLoadingModal.vue';
import MobileTableCustomModal from '../components/modals/mobile/MobileTableCustomModal.vue';
import MobileMessageModal from '@/components/modals/mobile/MobileMessageModal.vue';
import MobileCustomMessageModal from '@/components/modals/mobile/MobileCustomMessageModal.vue';

import { useBaseModal } from '@/stores/baseModal';
import { storeToRefs } from 'pinia';
import MobileMenuModal from '@/components/modals/mobile/MobileMenuModal.vue';

const baseModalStore = useBaseModal();
const { isMobileModalOpen, modalType } = storeToRefs(baseModalStore);
const { closeMobileModal } = baseModalStore;
</script>

<template>
  <MobileModalBackground v-if="isMobileModalOpen" @click="closeMobileModal(modalType)">
    <MobileConfirmModal v-if="modalType === 'mobileConfirm'" @click.stop />
    <MobileReserveModal v-if="modalType === 'mobileReserve'" @click.stop />
    <MobileMenuModal v-if="modalType === 'mobileMenu'" @click.stop />
    <MobileTableCustomModal v-if="modalType === 'mobileTableCustom'" @click.stop />
    <MobileMessageModal v-if="modalType === 'mobileMessage'" @click.stop />
    <MobileCustomMessageModal v-if="modalType === 'mobileCustomMessage'" @click.stop />
    <MobileLoadingModal v-if="modalType === 'mobileLoading'" />
  </MobileModalBackground>
</template>

<style lang="css" scoped></style>
