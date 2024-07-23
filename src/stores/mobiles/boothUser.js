import { defineStore, storeToRefs } from 'pinia';
import { alertError, api } from '@/utils/api';
import { ref } from 'vue';
import { useUser } from '@/stores/user';
import { useBoothList } from '../booths/boothList';
import { isUUID } from '@/utils/utils';

const useBoothListStore = useBoothList();
const useUserStore = useUser();

const { userOwnBoothId } = storeToRefs(useUserStore);
const { getAllBoothList } = useBoothListStore;
//All Booth List
const { boothList } = storeToRefs(useBoothListStore);

export const useBoothUser = defineStore('boothUser', () => {
  const userBoothInfo = ref({});
  const getBoothId = async () => {
    try {
      const response = await api.get('/admin/user/booth');
      const data = response.data;

      if (data.success) {
        userOwnBoothId.value = data.boothId;
        return data.boothId;
      } else {
        userOwnBoothId.value = '';
        return false;
      }
    } catch (e) {
      userOwnBoothId.value = '';
      console.error(e);
    }
  };

  const findUserBoothInfo = async (boothId) => {
    await getAllBoothList();
    if (!boothList || isUUID(boothId)) {
      //부스 리스트가 없거나 부스 리스트 정보가 안가져와진 경우
    }
    boothList.value.forEach((booth) => {
      if (booth.id === boothId) {
        userOwnBoothId.value = boothId;
        userBoothInfo.value = booth;
      } else {
        // 내가 부여받은 부스 번호가 부스 리스트에 없음
      }
    });
  };

  return { userBoothInfo, getBoothId, findUserBoothInfo };
});
