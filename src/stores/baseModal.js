import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBaseModal = defineStore('baseModal', () => {
  const isModalOpen = ref(false);
  const isMobileModalOpen = ref(false);

  const modalType = ref('');
  const setModalType = (type) => {
    modalType.value = type;
  };

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const openMobileModal = () => {
    isMobileModalOpen.value = true;
  };

  const closeMobileModal = () => {
    isMobileModalOpen.value = false;
  };

  return {
    isModalOpen,
    modalType,
    setModalType,
    openModal,
    closeModal,
    isMobileModalOpen,
    openMobileModal,
    closeMobileModal,
  };
});
