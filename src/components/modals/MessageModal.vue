<script setup>
import { storeToRefs } from 'pinia';
import IconClose from '../icons/IconClose.vue';
import { useMessageModal } from '@/stores/reserve/messageModal';
import { useMessage } from '@/stores/reserve/message';
import { prettyDate } from '@/utils/utils';

const useMessageModalStore = useMessageModal();
const useMessageStore = useMessage();

const { sendMessage } = useMessageStore;
const { closeMessageModal } = useMessageModalStore;

const { messageInfo } = storeToRefs(useMessageModalStore);
const { message } = storeToRefs(useMessageStore);

const handleInputMessage = (event) => {
  if (event.target.value.length > 45) {
    event.target.value = event.target.value.slice(0, 45);
  }
  message.value = event.target.value;
};

const handleClickCancleButton = () => {
  closeMessageModal();
};

const handleClickSendButton = () => {
  if (message.value.length === 0) {
    alert('메시지 내용을 입력해주세요.');
    return;
  }
  sendMessage(message.value);
};
</script>
<template>
  <div class="w-[780px] h-[550px] bg-white rounded-2xl py-[50px] px-[50px] flex flex-col justify-between">
    <div class="flex flex-col w-full gap-[28px]">
      <div
        class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-[30px] text-primary-900 h-9"
      >
        <div class="w-[25px]"></div>
        메시지 커스텀
        <IconClose @click="handleClickCancleButton()" class="cursor-pointer" />
      </div>
      <div class="text-secondary-700-light font-medium text-center">
        보낼 메시지 내용을 입력해주세요.<br />최대 45글자까지 입력 가능합니다.
      </div>

      <div class="w-full flex flex-col gap-4">
        <div class="text-secondary-700-light text-xl">예약자 정보</div>
        <div class="relative w-full rounded-2xl border-primary-700 border shadow-primary">
          <table class="w-full">
            <thead class="text-secondary-900 h-[50px]">
              <tr class="bg-primary-700-light">
                <th class="rounded-tl-2xl">No.</th>
                <th>이름</th>
                <th>전화번호</th>
                <th class="rounded-tr-2xl">예약 시간</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center h-[50px]">
                <td>{{ messageInfo.reservationNum }}</td>
                <td>{{ messageInfo.userName }}</td>
                <td>{{ messageInfo.phoneNum }}</td>
                <td>{{ prettyDate(messageInfo.updateAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <input
        type="text"
        placeholder="메시지 내용을 입력해주세요"
        @input="handleInputMessage($event)"
        :value="message"
        maxlength="45"
        class="w-full h-[57px] border-1 border-secondary-700 rounded-2xl px-[17px] font-medium focus:border-primary-900 focus:outline-none focus:border-2"
      />
      <div class="w-full flex justify-end items-center text-xl gap-5">
        <button class="is-button is-outlined w-[100px] h-[50px] font-semibold" @click="handleClickCancleButton()">
          취소
        </button>
        <button class="is-button w-[100px] h-[50px] font-semibold" @click="handleClickSendButton()">전송</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
