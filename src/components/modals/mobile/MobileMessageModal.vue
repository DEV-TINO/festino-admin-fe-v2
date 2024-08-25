<script setup>
import { useMessage } from '@/stores/reserve/message';
import { useReserveModal } from '@/stores/mobiles/reserve/reserveModal';
import { storeToRefs } from 'pinia';

const useMessageStore = useMessage();

const { closeMobilePopup } = useReserveModal();
const { reserveData } = storeToRefs(useReserveModal());

const { sendMobileMessage } = useMessageStore;
const { message } = storeToRefs(useMessageStore);

const getMobileNum = (num) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

const handleInputMessage = (event) => {
  if (event.target.value.length > 45) {
    event.target.value = event.target.value.slice(0, 45);
  }
  message.value = event.target.value;
};

const handleClickSendButton = () => {
  if (message.value.length === 0) {
    alert('메시지 내용을 입력해주세요.');
    return;
  }
  sendMobileMessage(message.value, reserveData.value);
};

const clickSave = () => {
  handleClickSendButton();
};

const clickCancel = () => {
  closeMobilePopup();
};
</script>

<template>
    <div class="w-[380px] min-w-[325px] bg-white rounded-3xl flex flex-col items-center px-10 py-8">
      <div class="flex w-full justify-end">
        <svg @click="closeMobilePopup()" class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </div>
      <div class="flex flex-col items-center gap-2 w-full">
        <div class="font-bold text-xl text-secondary-700">문자 커스텀</div>
        <div class="w-full">
          <div class="p-1">예약자 정보</div>
          <div class="flex w-full rounded-2xl text-sm border border-primary-700">
            <div class="flex flex-col rounded-l-2xl bg-restore border-r border-primary-700">
              <div class="py-2.5 px-5 border-b border-primary-700">No.</div>
              <div class="py-2.5 px-5 border-b border-primary-700">입금자명</div>
              <div class="py-2.5 px-5">전화번호</div>
            </div>
            <div class="flex flex-col grow">
              <div class="py-2.5 px-5 border-b border-primary-700">{{ reserveData.reservationNum }}</div>
              <div class="py-2.5 px-5 border-b border-primary-700">{{ reserveData.userName }}</div>
              <div class="py-2.5 px-5">{{ getMobileNum(reserveData.phoneNum) }}</div>
            </div>
          </div>
        </div>
        <div class="w-full">
          <div class="p-1">커스텀 메세지</div>
          <textarea
            placeholder="메세지 내용을 입력해주세요"
            @input="handleInputMessage($event)"
            :value="message"
            maxlength="45"
            class="text-sm w-full resize-none border border-primary-700 p-4 h-24 rounded-2xl"
          ></textarea>
        </div>
      </div>
      <div class="mt-2 flex gap-5 font-semibold text-xl w-full pt-2">
        <div @click="clickCancel()" class="flex items-center justify-center w-full h-12 border-2 border-primary-900 rounded-3xl text-primary-900">
          취소
        </div>
        <div @click="clickSave()" class="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-900 text-white">
          전송
        </div>
      </div>
    </div>
</template>

<style lang="css" scoped></style>
