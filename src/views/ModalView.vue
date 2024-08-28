<script setup>
import ModalBackground from '../components/modals/ModalBackground.vue';
import BoothPopup from '../components/modals/BoothPopup.vue';
import MenuModal from '../components/modals/MenuModal.vue';
import TableCustomModal from '@/components/modals/TableCustomModal.vue';
import MessageModal from '@/components/modals/MessageModal.vue';
import ServiceModal from '@/components/modals/ServiceModal.vue';

import { useBaseModal } from '@/stores/baseModal';
import { storeToRefs } from 'pinia';
import ReservePopup from '@/components/modals/ReservePopup.vue';
import LoadingModal from '@/components/modals/LoadingModal.vue';
import OrderPopup from '@/components/modals/OrderPopup.vue';

const baseModalStore = useBaseModal();
const { isModalOpen, modalType } = storeToRefs(baseModalStore);
</script>
<template>
  <ModalBackground v-if="isModalOpen">
    <BoothPopup v-if="modalType === 'boothPopup'" />
    <MenuModal v-if="modalType === 'menuModal'" />
    <ReservePopup v-if="modalType === 'reservePopup'" />
    <LoadingModal v-if="modalType === 'loadingModal'" />
    <OrderPopup v-if="modalType === 'orderPopup'" />
    <TableCustomModal v-if="modalType === 'tableDetail'" />
    <MessageModal v-if="modalType === 'messageModal'" />
    <ServiceModal v-if="modalType === 'serviceModal'" />
  </ModalBackground>
</template>

<style lang="scss" scoped></style>
