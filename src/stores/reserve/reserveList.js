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

  const getReserveList = async ({ boothId, type }) => {};

  const getDeleteReserveList = async (boothId) => {};

  const confirmReserve = async (reserve) => {};

  const deleteReserve = async (reserve) => {};

  const restoreReserve = async (reserve) => {};
});
