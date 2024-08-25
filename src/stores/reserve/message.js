import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { alertError, api } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useMessageModal } from '@/stores/reserve/messageModal';
import { useBaseModal } from '../baseModal';
import { useReserveModal } from '../mobiles/reserve/reserveModal';

export const useMessage = defineStore('message', () => {
  const message = ref('');

  const useMessageModalStore = useMessageModal();
  const boothDeatilStore = useBoothDetail();
  const baseModalStore = useBaseModal();
  const useReserveModalStore = useReserveModal();

  const { closeMobilePopup, openLoadingModal } = useReserveModalStore;
  const { closeMessageModal } = useMessageModalStore;
  const { messageInfo } = storeToRefs(useMessageModalStore);
  const { boothInfo } = storeToRefs(boothDeatilStore);

  const sendMessage = async (message) => {
    closeMessageModal();
    if (!messageInfo.value.phoneNum || !messageInfo.value.userName || !boothInfo.value.adminName) {
      return alertError('메시지 전송에 실패했습니다.');
    }
    baseModalStore.setModalType('loadingModal');
    baseModalStore.openModal();
    try {
      const response = await api.post('/admin/message/send', {
        phoneNum: messageInfo.value.phoneNum,
        userName: messageInfo.value.userName,
        adminName: boothInfo.value.adminName,
        message,
      });

      if (response.data === 'SEND_SUCCESS') {
        alert('메시지 전송에 성공했습니다.');
      } else {
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    } finally {
      baseModalStore.closeModal();
    }
  };

  const sendMobileMessage = async (message, data) => {
    if (!data.phoneNum || !data.userName || !boothInfo.value.adminName) {
      return alertError('메시지 전송에 실패했습니다.');
    }
    openLoadingModal();
    try {
      const response = await api.post('/admin/message/send', {
        phoneNum: data.phoneNum,
        userName: data.userName,
        adminName: boothInfo.value.adminName,
        message,
      });

      if (response.data === 'SEND_SUCCESS') {
        alert('메시지 전송에 성공했습니다.');
      } else {
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    } finally {
      closeMobilePopup();
    }
  };

  return {
    message,
    sendMessage,
    sendMobileMessage,
  };
});
