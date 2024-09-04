import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAllOrder = defineStore('allOrder', () => {
  const allOrder = ref([]);

  const getAllOrder = async ({ boothId, date }) => {
    try {
      if (!boothId) return;
      const response = await api.get(`/admin/booth/${boothId}/order/all/${date}`);
      const data = response.data;

      if (data.success) {
        allOrder.value = data.OrderList;
        return true;
      } else {
        allOrder.value = [];
        return false;
      }
    } catch (error) {
      console.log(error);
      allOrder.value = [];
      return false;
    }
  };

  return {
    allOrder,
    getAllOrder,
  };
});
