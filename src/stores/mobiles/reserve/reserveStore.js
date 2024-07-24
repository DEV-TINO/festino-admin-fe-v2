import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/utils/api';

export const useReserveStore = defineStore('reserveStore', () => {
  const HOST = import.meta.env.VITE_API_URL;
  const currentBoothId = "bcb6ddc2-1116-4729-a643-fa8f3bb5408f";
  const reserveData = ref([]);

  const getReserveData = async (type) => {
    try {
      const response = await api.get(`${HOST}/admin/reservation/${type}/booth/${currentBoothId}`);
      if(response.data.reservationInfo) reserveData.value = response.data.reservationInfo.reservationList;
      else return reserveData.value = [];
    } catch (error) {
      console.error(error);
    }
  };

  const confirmReserve = async (reserveId) => {
    const type = 'reserve'
    try {
      const response = await api.put('/admin/reservation/complete', {
        boothId: currentBoothId,
        reservationId: reserveId,
      });
    } catch (error) {
      console.error(error);
    }
    getReserveData(type);
  };

  const deleteReserve = async (reserveId) => {
    const type = 'reserve'
    try {
      const response = await api.delete('/admin/reservation', {
        data: {
          boothId: currentBoothId,
          reservationId: reserveId,
        }
      });
    } catch (error) {
      console.error(error);
    }
    getReserveData(type);
  };

  const updateReservation = async (reserveId, type) => {
    const upperCaseType = type.toUpperCase();
    try {
      const response = await api.put('/admin/reservation/restore', {
        boothId: currentBoothId,
        reservationId: reserveId,
        reservationType: upperCaseType,
      });
    } catch (error) {
      console.error(error);
    }
    getReserveData(type);
  };

  return {
    reserveData,
    getReserveData,
    updateReservation,
    confirmReserve,
    deleteReserve,
  };
});
6