import { defineStore, storeToRefs } from 'pinia';
import { alertError, api } from '@/utils/api';
import { ref } from 'vue';
import { useUser } from '@/stores/user';
import { useBoothList } from '../booths/boothList';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { isUUID } from '@/utils/utils';

const useBoothListStore = useBoothList();
const useUserStore = useUser();
const useBoothDetailStore = useBoothDetail();

const { boothType } = storeToRefs(useBoothDetailStore);
const { boothList } = storeToRefs(useBoothListStore);
const { userOwnBoothId } = storeToRefs(useUserStore);

export const useBoothUser = defineStore('boothUser', () => {
  const userBoothInfo = ref({});

  const getBoothInfo = async (boothId) => {
    await useBoothListStore.getAllBoothList();
    const booth = boothList.value.find((booth) => booth.boothId === boothId);
    userBoothInfo.value = booth;
    console.log('[INFO] boothUser.js - getBoothInfo', booth);
  };

  const initBoothInfo = async () => {
    await useUserStore.getUserOwnBoothId();
    await getBoothInfo(userOwnBoothId.value);
  };

  return { userBoothInfo, initBoothInfo };
});
