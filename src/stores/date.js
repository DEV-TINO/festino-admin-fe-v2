import { api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDate = defineStore('date', () => {
  const nowDate = ref(0);

  const getNowDate = async () => {
    const response = await api.get('/admin/date');
    const date = response.data;

    if (date > 3 || date < 0) {
      alertError('Date Error, Please try again!');
      nowDate.value = 0;
      return;
    }

    nowDate.value = Number(response.data);
  };

  return {
    nowDate,
    getNowDate,
  };
});
