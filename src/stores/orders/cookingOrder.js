import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCookingOrder = defineStore('cookingOrder', () => {
  const cookingOrderList = ref([]);

  const getCookingOrderList = async ({ boothId, date }) => {
    try {
      if (!boothId) return;

      const response = await api.get(`/admin/booth/${boothId}/order/cooking/all/${date}`);
      const data = response.data;

      if (data.success) {
        cookingOrderList.value = data.cookingList;
        return true;
      } else {
        cookingOrderList.value = [];
        return false;
      }
    } catch (error) {
      console.error(error);
      cookingOrderList.value = [];
      return false;
    }
  };

  const initCookingOrderList = () => {
    cookingOrderList.value = [];
  };

  return {
    cookingOrderList,
    getCookingOrderList,
    initCookingOrderList,
  };
});
