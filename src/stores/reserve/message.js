import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { alertError, api } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useMessageModal } from '@/stores/reserve/messageModal';

export const useMessage = defineStore('message', () => {
  const message = ref('');

  const useMessageModalStore = useMessageModal();
  const boothDeatilStore = useBoothDetail();

  const { closeMessageModal } = useMessageModalStore;
  const { messageInfo } = storeToRefs(useMessageModalStore);
  const { boothInfo } = storeToRefs(boothDeatilStore);

  const sendMessage = async (message) => {
    try {
      const response = await api.post('/admin/message/sed', {
        phoneNum: messageInfo.value.phoneNum,
        userName: messageInfo.value.userName,
        adminName: boothInfo.value.adminName,
        message,
      });
      const data = response.data;
      closeMessageModal();

      //메시지 전송 성공
      if (data === 'SEND_SUCCESS') {
        alert('메시지 전송에 성공했습니다.');
      } else {
        //메시지 전송 실패
        alertError('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      closeMessageModal();
      console.error(error);
      alertError(error);
    }
  };

  return {
    message,
    sendMessage,
  };
});
