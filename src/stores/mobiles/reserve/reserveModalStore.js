import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReserveModalStore = defineStore('reserveModalStore', () => {
  const restoreConfirmModalState = ref(false);
  const adminModalState = ref(false);
  const reserveConfirmModalState = ref(false);
  const confirmData = ref([]);
  const confirmType = ref([]);
  const adminData = ref([]);

  const handleClickOpenConfirm = (data, type) => {
    confirmData.value = data;
    confirmType.value = type;
    restoreConfirmModalState.value = true;
  };
  
  const handleClickCloseConfirm = () => {
    restoreConfirmModalState.value = false;
  };

  const handleClickOpenAdmin = (data) => {
    adminData.value = data;
    adminModalState.value = true;
  };
  
  const handleClickCloseAdmin = () => {
    adminModalState.value = false;
  };

  const handleClickOpenReserveConfirm = (type) => {
    confirmType.value = type;
    reserveConfirmModalState.value = true;
  };
  
  const handleClickCloseReserveConfirm = () => {
    reserveConfirmModalState.value = false;
  };

  return {
    handleClickOpenConfirm,
    handleClickCloseConfirm,
    handleClickOpenAdmin,
    handleClickCloseAdmin,
    restoreConfirmModalState,
    handleClickOpenReserveConfirm,
    handleClickCloseReserveConfirm,
    adminModalState,
    confirmData,
    confirmType,
    adminData,
    reserveConfirmModalState,
  };
});
