import { api, alertError } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ADMIN_CATEGORY } from '@/utils/constants';
import router from '@/router';

export const useBoothList = defineStore('boothList', () => {
  const boothList = ref([]);

  const getAllBoothList = async () => {
    try {
      const [nightResponse, dayResponse, foodResponse] = await Promise.all([
        api.get('/admin/booth/night/all'),
        api.get('/admin/booth/day/all'),
        api.get('/admin/booth/food/all'),
      ]);
      const nightData = nightResponse.data;
      const dayData = dayResponse.data;
      const foodData = foodResponse.data;

      if (nightData.success && dayData.success && foodData.success)
        boothList.value = [...nightData.boothList, ...dayData.boothList, ...foodData.boothList];
      else {
        alertError(`${nightData.message}, ${dayData.message}, ${foodData.message}`);
      }
    } catch (error) {
      console.log(error);
      alertError(error);
    }
  };

  const handleClickBoothDetail = (boothId) => {
    router.push({ name: 'BoothDetail', params: { boothId: boothId } });
  };

  const updateBoothOpen = async ({ boothId, isOpen, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/open`, {
        boothId: boothId, // === boothId
        isOpen: isOpen, // === isOpen
      });
      if (response.data.success) getAllBoothList();
      else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alertError(error);
    }
  };

  const updateBoothOrder = async ({ boothId, isOrder, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/order`, {
        boothId: boothId,
        isOrder: isOrder,
      });
      if (response.data.success) getAllBoothList();
      else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alertError(error);
    }
  };

  const updateBoothReservation = async ({ boothId, isReservation, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/reservation`, {
        boothId: boothId,
        isReservation: isReservation,
      });
      if (response.data.success) getAllBoothList();
      else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alertError(error);
    }
  };

  return {
    boothList,
    handleClickBoothDetail,
    getAllBoothList,
    updateBoothOpen,
    updateBoothReservation,
    updateBoothOrder,
  };
});
