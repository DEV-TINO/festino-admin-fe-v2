import { defineStore } from 'pinia';
import { useBaseModal } from '../../baseModal';
import { ref } from 'vue';

export const useReserveModal = defineStore('reserveModal', () => {
  const baseModalStore = useBaseModal();
  const reserveData = ref([]);
  const popupType = ref('');
  const confirmType = ref('');
  const selectBoothId = ref('');

  const openReservePopup = (type, data) => {
    reserveData.value = data;
    baseModalStore.setModalType('mobileReserve');
    popupType.value = type;
    baseModalStore.openMobileModal();
  };

  const openMessagePopup = (data) => {
    reserveData.value = data;
    baseModalStore.setModalType('mobileMessage');
    baseModalStore.openMobileModal();
  };

  const openConfirmPopup = (type) => {
    baseModalStore.setModalType('mobileConfirm');
    confirmType.value = type;
    baseModalStore.openMobileModal();
  };

  const openLoadingModal = () => {
    baseModalStore.setModalType('mobileLoading');
    baseModalStore.openMobileModal();
  };

  const closeMobilePopup = () => {
    baseModalStore.closeMobileModal();
  };

  return {
    popupType,
    confirmType,
    openReservePopup,
    openConfirmPopup,
    closeMobilePopup,
    openLoadingModal,
    openMessagePopup,
    reserveData,
    selectBoothId,
  };
});
