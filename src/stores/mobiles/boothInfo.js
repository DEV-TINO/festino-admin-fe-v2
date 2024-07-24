import { defineStore } from 'pinia';
import { api } from '@/utils/api';
import { ref } from 'vue';

export const useBoothInfo = defineStore('boothInfo', () => {
  const updateBoothInfo = async (type, boothData) => {
    const response = await api.put(`/admin/booth/${type}`, boothData);
    console.log(response.data);
  };
  return { updateBoothInfo };
});
