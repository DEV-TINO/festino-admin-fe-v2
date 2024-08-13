import { defineStore } from 'pinia';
import { useBaseModal } from '../baseModal';

export const useCustomTableModal = defineStore('customTableModal', () => {
  const baseModalStore = useBaseModal();

  const openCustomTablePopup = () => {
    baseModalStore.setModalType('mobileTableCustom');
    baseModalStore.openMobileModal();
  };

  const closeMobilePopup = () => {
    baseModalStore.closeMobileModal();
  };

  return {
    openCustomTablePopup,
    closeMobilePopup,
  };
});
