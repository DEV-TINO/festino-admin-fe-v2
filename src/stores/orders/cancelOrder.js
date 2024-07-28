import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCancelOrder = defineStore('cancelOrder', () => {
  const cancelOrderList = ref([]);

  const getCancelOrderList = async ({ boothId, date }) => {
    try {
      const response = await api.get(`/admin/booth/${boothId}/order/cancel/all/${date}`);
      const data = response.data;

      if (data.success) {
        cancelOrderList.value = data.cancelList;
        return true;
      } else {
        cancelOrderList.value = [];
        return false;
      }
    } catch (error) {
      console.error(error);
      cancelOrderList.value = [];
      return false;
    }
  };

  const initCancelOrderList = () => {
    cancelOrderList.value = [];
  };

  return {
    cancelOrderList,
    getCancelOrderList,
    initCancelOrderList,
  };
});
