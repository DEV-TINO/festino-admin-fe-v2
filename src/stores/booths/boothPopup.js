import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useBaseModal } from '../baseModal';
import { useBoothList } from './boothList';
import { alertError } from '@/utils/api';

export const useBoothPopup = defineStore('boothPopup', () => {
  const baseModalStore = useBaseModal();
  const boothListStore = useBoothList();

  const boothInfo = ref({});
  const seletedType = ref('');

  const setBoothInfo = (booth) => {
    boothInfo.value = booth;
  };

  const setSeletedType = (type) => {
    seletedType.value = type;
  };

  const openPopup = ({ type, boothInfo }) => {
    setSeletedType(type);
    setBoothInfo(boothInfo);

    baseModalStore.openModal();
    baseModalStore.setModalType('boothPopup');
  };

  const submitPopup = () => {
    baseModalStore.closeModal();

    if (seletedType.value === 'open') {
      boothListStore.updateBoothOpen({
        boothId: boothInfo.value.boothId,
        isOpen: boothInfo.value.isOpen,
        adminCategory: boothInfo.value.adminCategory,
      });
    } else if (seletedType.value === 'order') {
      boothListStore.updateBoothOrder({
        boothId: boothInfo.value.boothId,
        isOrder: boothInfo.value.isOrder,
        adminCategory: boothInfo.value.adminCategory,
      });
    } else if (seletedType.value === 'reservation') {
      boothListStore.updateBoothReservation({
        boothId: boothInfo.value.boothId,
        adminCategory: boothInfo.value.adminCategory,
        isReservation: boothInfo.value.isReservation,
      });
    } else alertError('[Close Popup] 잘못된 타입입니다.');
  };

  const closePopup = () => {
    baseModalStore.closeModal();
  };

  return {
    boothInfo,
    seletedType,
    openPopup,
    submitPopup,
    closePopup,
    setBoothInfo,
  };
});
