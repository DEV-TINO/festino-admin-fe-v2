import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrderStatistics = defineStore('orderStatistics', () => {
  const allOrderStatistics = ref([]);
  const boothInfo = ref({});

  const setBoothInfo = (booth) => {
    boothInfo.value = booth;
  };

  const getStatistics = async ({ boothId, date }) => {
    try {
      const response = await api.get(`/admin/booth/${boothId}/order/statistic/${date}`);
      const data = response.data;

      if (data.success) {
        allOrderStatistics.value = data.statistic;
      } else {
        allOrderStatistics.value = [];
      }
    } catch (error) {
      console.error(error);
      allOrderStatistics.value = [];
    }
  };
  
  return {
    allOrderStatistics,
    boothInfo,
    setBoothInfo,
    getStatistics,
  };
});
