import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReserveModalStore = defineStore('reserveModalStore', () => {
  const confirmModalState = ref(false);
  const confirmData = ref([]);
  const confirmType = ref([]);

  const handleClickOpenConfirm = (data, type) => {
    confirmData.value = data;
    confirmType.value = type;
    confirmModalState.value = true;
  };
  
  const handleClickCloseConfirm = () => {
    confirmModalState.value = false;
  };
  return {
    handleClickOpenConfirm,
    handleClickCloseConfirm,
    confirmModalState,
    confirmData,
    confirmType,
  };
});
