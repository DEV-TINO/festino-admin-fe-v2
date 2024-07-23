import { alertError, api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReserveList = defineStore('reserveList', () => {
  const reserveList = ref([]);
  const deleteReserveList = ref([]);

  const searchKeyword = ref('');

  const getFilteredReserveList = () => {
    return reserveList.value.filter((reserve) => {
      return reserve.name.includes(searchKeyword.value);
    });
  };

  const getReserveList = async ({ boothId, type }) => {
    try {
      const response = await api.get(`/admin/reservation/${type}/booth/${boothId}`);
      const data = response.data;
      if (data.success) {
        reserveList.value = data.reservationInfo.reservationList;
      } else {
        reserveList.value = [];
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    }
  };

  const getDeleteReserveList = async (boothId) => {};

  const confirmReserve = async ({ boothId, reserveId }) => {
    try {
      const response = await api.put('/admin/reservation/complete', {
        boothId: boothId,
        reservationId: reserveId,
      });
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  };

  const deleteReserve = async ({ boothId, reserveId }) => {
    try {
      const response = await api.delete('/admin/reservation', {
        data: {
          boothId: boothId,
          reservationId: reserveId,
        },
      });
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  };

  const restoreReserve = async ({ boothId, reserveId }) => {
    try {
      const response = await api.put('/admin/reservation/restore', {
        boothId: boothId,
        reservationId: reserveId,
      });
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  };

  return {
    reserveList,
    deleteReserveList,
    searchKeyword,
    getFilteredReserveList,
    getReserveList,
    getDeleteReserveList,
    confirmReserve,
    deleteReserve,
    restoreReserve,
  };
});
