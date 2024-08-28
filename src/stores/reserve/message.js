import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { alertError, api } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useMessageModal } from '@/stores/reserve/messageModal';
import { useBaseModal } from '@/stores/baseModal';

export const useMessage = defineStore('message', () => {
  const message = ref('');
  const customMessageList = ref([
    {
      message: '1',
      messageType: 0,
    },
    {
      message: '2',
      messageType: 1,
    },
    {
      message: '3',
      messageType: 2,
    },
  ]);

  const useMessageModalStore = useMessageModal();
  const boothDeatilStore = useBoothDetail();
  const baseModalStore = useBaseModal();

  const { messageInfo } = storeToRefs(useMessageModalStore);
  const { boothInfo } = storeToRefs(boothDeatilStore);

  const openLoadingModal = () => {
    baseModalStore.setModalType('loadingModal');
    baseModalStore.openModal();
  };

  const getMessage = async () => {
    try {
      const response = await api.get();
      if (response.data.success) {
        customMessageList.value = response.data.customMessageList;
      } else {
        customMessageList.value = [];
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    }
  };

  const sendMessage = async (message) => {
    baseModalStore.closeModal();
    if (!messageInfo.value.phoneNum || !messageInfo.value.userName || !boothInfo.value.adminName) {
      return alertError('메시지 전송에 실패했습니다.');
    }
    openLoadingModal();
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
        alert('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    } finally {
      baseModalStore.closeModal();
    }
  };

  const saveCustomMessage = async (message) => {
    try {
      const response = await api.get('/admin/message', {
        boothId: boothInfo.value.boothId,
        customMessageList: customMessageList.value,
      });
      if (response.data.success) {
        alert('메시지 수정에 성공했습니다.');
      } else {
        alert('메시지 수정에 실패했습니다.');
        baseModalStore.closeModal();
      }
    } catch (error) {
      baseModalStore.closeModal();
      console.error(error);
      alertError(error);
    }
  };

  return {
    message,
    customMessageList,
    getMessage,
    sendMessage,
    saveCustomMessage,
  };
});
