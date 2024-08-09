import { api, alertError } from '@/utils/api';
import { defineStore } from 'pinia';
import { useBaseModal } from '../baseModal';
import { ref } from 'vue';

export const useTableDetail = defineStore('tableDetail', () => {
  const tableNumList = ref([]);

  const baseModalStore = useBaseModal();

  const openTableDetailModal = () => {
    baseModalStore.openModal();
    baseModalStore.setModalType('tableDetail');
  };

  const closeTableDetailModal = () => {
    baseModalStore.closeModal();
  };

  const getTableList = async (boothId) => {
    try {
      const res = await api.get(`/admin/order/table/booth/${boothId}`);
      if (res.data.success) tableNumList.value = res.data.tableNumList;
      else {
        alertError(`${res.data.message}`);
      }
    } catch (error) {
      console.log(error);
      alertError(error);
    }
  };
  const updateTableList = async (boothId) => {
    try {
      const res = await api.post('/admin/order/table', {
        boothId,
        tableNumList: tableNumList.value,
      });
      if (!res.data.success) {
        alertError(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alertError(error);
    }
  };

  const sumbitTableDetail = async (boothId) => {
    tableNumList.value.forEach((table) => {
      if (table.customTableNum === '') {
        table.customTableNum = table.tableNumIndex;
      }
    });
    await updateTableList(boothId);
    baseModalStore.closeModal();
  };

  return {
    tableNumList,
    openTableDetailModal,
    closeTableDetailModal,
    sumbitTableDetail,
    getTableList,
  };
});
