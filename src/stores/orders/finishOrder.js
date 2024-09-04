import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFinishOrder = defineStore('finishOrder', () => {
  const finishOrderList = ref([]);

  const getFinishOrderList = async ({ boothId, date }) => {
    try {
      if (!boothId) return;

      const response = await api.get(`/admin/booth/${boothId}/order/finish/all/${date}`);
      const data = response.data;

      if (data.success) {
        finishOrderList.value = data.finishList;
        return true;
      } else {
        finishOrderList.value = [];
        return false;
      }
    } catch (error) {
      console.error(error);
      finishOrderList.value = [];
      return false;
    }
  };

  const initFinishOrderList = () => {
    finishOrderList.value = [];
  };

  return {
    finishOrderList,
    getFinishOrderList,
    initFinishOrderList,
  };
});
