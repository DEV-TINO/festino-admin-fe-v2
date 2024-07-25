import { alertError, api } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReserveList = defineStore('reserveList', () => {
  const reserveList = ref({
    reserve: [],
    cancel: [],
    complete: [],
  });
  const deleteReserveList = ref([]);

  const searchKeyword = ref('');

  const setReserveList = ({ data, type }) => {
    reserveList.value = {
      ...reserveList.value,
      [type]: data,
    };
  };

  const getFilteredReserveList = ({ type }) => {
    if (searchKeyword.value === '') {
      return reserveList.value[type];
    }
    return reserveList.value[type].filter((reserve) => {
      return (
        reserve.userName.includes(searchKeyword.value) ||
        String(reserve.reservationNum).includes(searchKeyword.value) ||
        String(reserve.personCount).includes(searchKeyword.value) ||
        String(reserve.phoneNum).includes(searchKeyword.value)
      );
    });
  };

  const getReserveList = async ({ boothId, type }) => {
    try {
      const response = await api.get(`/admin/reservation/${type}/booth/${boothId}`);
      const data = response.data;
      if (data.success) {
        setReserveList({
          data: data.reservationInfo.reservationList,
          type,
        });
      } else {
        setReserveList({
          data: [],
          type,
        });
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

  const restoreReserve = async ({ boothId, reserveId, reserveType }) => {
    try {
      const response = await api.put('/admin/reservation/restore', {
        boothId: boothId,
        reservationId: reserveId,
        reservationType: String(reserveType).toUpperCase(),
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
