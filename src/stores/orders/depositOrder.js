import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDepositOrder = defineStore('depositOrder', () => {
  const waitDepositOrderList = ref([]);

  const getWaitDepositOrderList = async ({ boothId, date }) => {
    try {
      if (!boothId) return;

      const response = await api.get(`/admin/booth/${boothId}/order/deposit/all/${date}`);
      const data = response.data;

      if (data.success) {
        waitDepositOrderList.value = data.waitDepositList;
        return true;
      } else {
        waitDepositOrderList.value = [];
        return false;
      }
    } catch (error) {
      console.error(error);
      waitDepositOrderList.value = [];
      return false;
    }
  };

  const initDepositOrder = () => {
    waitDepositOrderList.value = [];
  };

  return {
    waitDepositOrderList,
    getWaitDepositOrderList,
    initDepositOrder,
  };
});
