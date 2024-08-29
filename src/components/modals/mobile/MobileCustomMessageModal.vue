<script setup>
import { useMessage } from '@/stores/reserve/message';
import { useReserveModal } from '@/stores/mobiles/reserve/reserveModal';
import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue';
import _ from 'lodash';

const MAX_MESSAGE_LENGTH = 35;
const useMessageStore = useMessage();
const useReserveModalStore = useReserveModal();

const { saveCustomMessage } = useMessageStore;
const { customMessageList } = storeToRefs(useMessageStore);
const messageList = ref(_.cloneDeep(customMessageList.value));
const { closeMobilePopup } = useReserveModalStore;

const handleInputMessage = (event, type) => {
  if (event.target.value.length > MAX_MESSAGE_LENGTH) {
    event.target.value = event.target.value.slice(0, MAX_MESSAGE_LENGTH);
  }
  messageList.value[type].message = event.target.value;
};

const handleClickSave = async () => {
  if (messageList.value.some((message) => message.message.length === 0)) {
    alert('메시지 내용을 입력해주세요.');
    return;
  }
  saveCustomMessage(messageList.value);
  closeMobilePopup();
};

const handleClickCancel = () => {
  closeMobilePopup();
};

watchEffect(() => {
  messageList.value = _.cloneDeep(customMessageList.value);
});
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
        <div class="w-full text-sm text-center">
          <p>메세지 앞에 <span class="text-danger font-bold">ㅇㅇㅇ님</span>이 고정으로 붙습니다.<br>보낼 메세지 내용을 {{ MAX_MESSAGE_LENGTH }}자 이내로 작성해주세요.</p>
        </div>
        <div class="relative w-full flex flex-col gap-2">
          <div class="flex flex-col gap-2 relative">
            <div>예약 완료</div>
            <textarea
              type="text"
              placeholder="ㅇㅇㅇ학과 예약이 완료되었습니다."
              @input="handleInputMessage($event, 0)"
              :value="messageList[0].message || ''"
              maxlength="MAX_MESSAGE_LENGTH"
              class="text-sm w-full resize-none border border-primary-700 p-4 h-24 rounded-2xl"
            ></textarea>
            <div class="absolute bottom-4 right-5 text-secondary-900-light">{{ messageList[0].message.length }}/{{ MAX_MESSAGE_LENGTH }}</div>
          </div>
          <div class="flex flex-col gap-2 relative">
            <div>입장 완료</div>
            <textarea
              type="text"
              placeholder="ㅇㅇㅇ학과에서 즐거운 시간 보내시기 바랍니다."
              @input="handleInputMessage($event, 1)"
              :value="messageList[1]?.message || ''"
              maxlength="MAX_MESSAGE_LENGTH"
              class="text-sm w-full resize-none border border-primary-700 p-4 h-24 rounded-2xl"
            ></textarea>
            <div class="absolute bottom-4 right-5 text-secondary-900-light">{{ messageList[1].message.length }}/{{ MAX_MESSAGE_LENGTH }}</div>
          </div>
          <div class="flex flex-col gap-2 relative">
            <div>예약 취소</div>
            <textarea
              type="text"
              placeholder="ㅇㅇㅇ학과 예약이 취소 되었습니다."
              @input="handleInputMessage($event, 2)"
              :value="messageList[2]?.message || ''"
              maxlength="MAX_MESSAGE_LENGTH"
              class="text-sm w-full resize-none border border-primary-700 p-4 h-24 rounded-2xl"
            ></textarea>
            <div class="absolute bottom-4 right-5 text-secondary-900-light">{{ messageList[2].message.length }}/{{ MAX_MESSAGE_LENGTH }}</div>
          </div>
        </div>
      </div>
      <div class="mt-2 flex gap-5 font-semibold text-xl w-full pt-2">
        <div @click="handleClickCancel()" class="flex items-center justify-center w-full h-12 border-2 border-primary-900 rounded-3xl text-primary-900">
          취소
        </div>
        <div @click="handleClickSave()" class="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-900 text-white">
          수정
        </div>
      </div>
    </div>
</template>

<style lang="css" scoped></style>
