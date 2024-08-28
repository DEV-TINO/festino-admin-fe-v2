import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { alertError, api } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useMessageModal } from '@/stores/reserve/messageModal';
import { useBaseModal } from '@/stores/baseModal';

export const useMessage = defineStore('message', () => {
  const useMessageModalStore = useMessageModal();
  const boothDeatilStore = useBoothDetail();
  const baseModalStore = useBaseModal();

  const { messageInfo } = storeToRefs(useMessageModalStore);
  const { boothInfo } = storeToRefs(boothDeatilStore);

  const message = ref('');
  const customMessageList = ref([
    {
      message: '',
      messageType: 0,
    },
    {
      message: '',
      messageTyp: 1,
    },
    {
      message: '',
      messageType: 2,
    },
  ]);

  const openLoadingModal = () => {
    baseModalStore.setModalType('loadingModal');
    baseModalStore.openModal();
  };

  const getMessage = async (boothId) => {
    try {
      const response = await api.get('/admin/message/all', {
        params: {
          boothId,
        },
      });
      if (response.data.success) {
        customMessageList.value = response.data.customMessageList.map(({ message, messageType }) => ({
          message,
          messageType,
        }));
      } else {
        customMessageList.value = [];
      }
    } catch (error) {
      console.error(error);
      alertError(error, false);
      baseModalStore.closeModal();
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
      const response = await api.post('/admin/message', {
        boothId: boothInfo.value.boothId,
        customMessageList: message,
      });
      if (response.data.success) {
        alert('메시지 수정에 성공했습니다.');
      } else {
        alert('메시지 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alertError(error, false);
    } finally {
      baseModalStore.closeModal();
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
