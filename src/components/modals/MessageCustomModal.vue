<script setup>
import { storeToRefs } from 'pinia';
import IconClose from '../icons/IconClose.vue';
import { useMessage } from '@/stores/reserve/message';
import { useBaseModal } from '@/stores/baseModal';
import { ref, watchEffect } from 'vue';
import _ from 'lodash';

const useMessageStore = useMessage();
const useBaseModalStore = useBaseModal();

const { closeModal } = useBaseModalStore;
const { saveCustomMessage } = useMessageStore;

const { customMessageList } = storeToRefs(useMessageStore);
const messageList = ref(_.cloneDeep(customMessageList.value));

const handleInputMessage = (event, type) => {
  if (event.target.value.length > 35) {
    event.target.value = event.target.value.slice(0, 35);
  }
  messageList.value[type].message = event.target.value;
};

const handleClickSaveButton = async () => {
  if (messageList.value.some((message) => message.message.length === 0)) {
    alert('메시지 내용을 입력해주세요.');
    return;
  }
  saveCustomMessage(messageList.value);
};

watchEffect(() => {
  messageList.value = _.cloneDeep(customMessageList.value);
});
</script>
<template>
  <div class="min-w-[515px] w-[600px] h-fit bg-white rounded-2xl p-10 flex flex-col justify-between">
    <div class="flex flex-col w-full gap-[28px]">
      <div>
        <div
          class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-xl text-primary-900 h-9 pb-2"
        >
          <div class="w-[25px]"></div>
          문자 커스텀
          <IconClose @click="closeModal()" class="w-8 h-8 p-2 cursor-pointer hover:bg-gray-100 rounded:2xl" />
        </div>
        <div class="text-secondary-700-light font-medium text-center text-sm">
          메시지 앞에 <span class="text-danger font-bold">_ _ _님</span>이 고정으로 붙습니다.<br />보낼 메시지 내용을
          35글자 이내로 입력해주세요.
        </div>
      </div>
      <div class="flex flex-col gap-[10px] relative">
        <div class="text-md font-semibold pl-2">예약 완료</div>
        <input
          type="text"
          placeholder="ㅇㅇㅇ학과 예약이 완료되었습니다."
          @input="handleInputMessage($event, 0)"
          :value="messageList[0].message || ''"
          maxlength="35"
          class="w-full h-[48px] border-1 border-secondary-700 rounded-xl px-[17px] font-medium focus:border-primary-900 focus:outline-none focus:border-1 text-sm"
        />
        <div class="absolute bottom-[13px] right-5 text-secondary-900-light text-sm">{{ messageList[0].message.length }}/35</div>
      </div>
      <div class="flex flex-col gap-[10px] relative">
        <div class="text-md font-semibold pl-2">입장 완료</div>
        <input
          type="text"
          placeholder="ㅇㅇㅇ학과에서 즐거운 시간 보내시기 바랍니다."
          @input="handleInputMessage($event, 1)"
          :value="messageList[1]?.message || ''"
          maxlength="35"
          class="w-full h-[48px] border-1 border-secondary-700 rounded-xl px-[17px] font-medium focus:border-primary-900 focus:outline-none focus:border-1 text-sm"
        />
        <div class="absolute bottom-[13px] right-5 text-secondary-900-light text-sm">{{ messageList[1].message.length }}/35</div>
      </div>
      <div class="flex flex-col gap-[10px] relative">
        <div class="text-md font-semibold pl-2">예약 취소</div>
        <input
          type="text"
          placeholder="ㅇㅇㅇ학과 예약이 취소 되었습니다."
          @input="handleInputMessage($event, 2)"
          :value="messageList[2]?.message || ''"
          maxlength="35"
          class="w-full h-[48px] border-1 border-secondary-700 rounded-xl px-[17px] font-medium focus:border-primary-900 focus:outline-none focus:border-1 text-sm"
        />
        <div class="absolute bottom-[13px] right-5 text-secondary-900-light text-sm">{{ messageList[2].message.length }}/35</div>
      </div>
      <div class="w-full flex justify-end items-center text-xl gap-3">
        <button class="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-900 lg:text-md bg-primary-900cursor-pointer select-none" @click="closeModal()">취소</button>
        <button class="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none" @click="handleClickSaveButton()">수정</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
