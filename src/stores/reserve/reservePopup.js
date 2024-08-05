import { defineStore } from 'pinia';
import { useBaseModal } from '../baseModal';
import { useBoothList } from '../booths/boothList';
import { nextTick, ref } from 'vue';

export const useReservePopup = defineStore('reservePopup', () => {
  const baseModalStore = useBaseModal();
  const boothListStore = useBoothList();

  const boothInfo = ref({});
  const reservationInfo = ref({});

  const handleSumit = ref(async () => {});

  const popupType = ref('');

  const setReservationInfo = (reservation) => {
    reservationInfo.value = reservation;
  };

  const openBoothReservePopup = ({ booth, callback }) => {
    boothInfo.value = booth;
    handleSumit.value = callback;
    baseModalStore.setModalType('reservePopup');
    popupType.value = 'booth';
    baseModalStore.openModal();
  };

  const submitBoothReservePopup = async () => {
    baseModalStore.setModalType('loadingModal');
    await boothListStore.updateBoothReservation({
      boothId: boothInfo.value.boothId,
      adminCategory: boothInfo.value.adminCategory,
      isReservation: boothInfo.value.isReservation,
    });
    handleSumit.value({
      ...boothInfo.value,
      isReservation: !boothInfo.value.isReservation,
    });
    baseModalStore.closeModal();
  };

  const openPopup = ({ reserveInfo: reservation, type: type, callback: callback }) => {
    setReservationInfo(reservation);
    handleSumit.value = callback;
    baseModalStore.setModalType('reservePopup');
    popupType.value = type;
    baseModalStore.openModal();
  };

  const submitPopup = async () => {
    baseModalStore.setModalType('loadingModal');
    try {
      await handleSumit.value();
    } finally {
      baseModalStore.closeModal();
    }
  };

  const closePopup = () => {
    baseModalStore.closeModal();
  };

  return {
    boothInfo,
    reservationInfo,
    handleSumit,
    popupType,
    setReservationInfo,
    openBoothReservePopup,
    submitBoothReservePopup,
    openPopup,
    submitPopup,
    closePopup,
  };
});
