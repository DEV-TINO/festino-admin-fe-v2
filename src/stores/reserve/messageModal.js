import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useBaseModal } from '@/stores/baseModal';

export const useMessageModal = defineStore('messageModal', () => {
  const baseModalStore = useBaseModal();
  const messageInfo = ref({});

  const setMessageInfo = (info) => {
    messageInfo.value = info;
  };

  const openMessageModal = (info) => {
    setMessageInfo(info);
    baseModalStore.setModalType('messageModal');
    baseModalStore.openModal();
  };

  const openMessageCusotmModal = () => {
    baseModalStore.setModalType('messageCustomModal');
    baseModalStore.openModal();
  };

  return {
    messageInfo,
    openMessageModal,
    openMessageCusotmModal,
  };
});
