import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBaseOrder = defineStore('baseOrder', () => {
  const orderCategories = ref(['realTime', 'ready', 'cooking', 'finish', 'cancel', 'statistics']);

  const orderStatus = ref('realTime'); // realTime, ready, cooking, finish, cancel, statistics

  const boothId = ref('');

  const allTableOrders = ref([]);

  const setOrderStatus = (status) => {
    orderStatus.value = status;
  };

  const setBoothId = (id) => {
    boothId.value = id;
  };

  const initBaseOrder = () => {
    setOrderStatus('realTime');
  };

  const getAllTableOrders = async ({ boothId, date }) => {
    try {
      const response = await api.get(`/admin/booth/${boothId}/order/table/${date}`);
      const data = response.data;

      if (data.success) {
        allTableOrders.value = data.orderList;
      } else {
        allTableOrders.value = [];
      }
    } catch (error) {
      console.error(error);
      allTableOrders.value = [];
    }
  };

  return {
    orderStatus,
    orderCategories,
    allTableOrders,
    boothId,
    setBoothId,
    setOrderStatus,
    initBaseOrder,
    getAllTableOrders,
  };
});
