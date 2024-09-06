<script setup>
import { storeToRefs } from 'pinia';
import IconClose from '../icons/IconClose.vue';
import { useMessageModal } from '@/stores/reserve/messageModal';
import { useMessage } from '@/stores/reserve/message';
import { prettyDate } from '@/utils/utils';
import { useBaseModal } from '@/stores/baseModal';

const useMessageModalStore = useMessageModal();
const useMessageStore = useMessage();
const useBaseModalStore = useBaseModal();

const { sendMessage } = useMessageStore;
const { closeModal } = useBaseModalStore;

const { messageInfo } = storeToRefs(useMessageModalStore);
const { message } = storeToRefs(useMessageStore);

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
  sendMessage(message.value);
};
</script>
<template>
  <div class="min-w-[455px] w-[600px] h-fit bg-white rounded-2xl p-8 flex flex-col justify-between">
    <div class="flex flex-col w-full gap-[28px]">
      <div>
        <div
          class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-xl text-primary-900 h-9"
        >
          <div class="w-[25px]"></div>
          문자 커스텀
          <IconClose @click="closeModal()" class="w-8 h-8 p-2 cursor-pointer hover:bg-gray-100 hover:rounded:2xl" />
        </div>
        <div class="text-secondary-700-light font-medium text-center text-sm">보낼 메시지 내용을 45글자 이내로 입력해주세요.</div>
      </div>
      <div class="w-full flex flex-col gap-4">
      <div class="text-secondary-700-light text-md ml-4">예약자 정보</div>
        <div class="relative w-full rounded-xl">
          <table class="w-full outline-primary-900-light outline outline-1 rounded-xl">
            <thead class="text-secondary-900 h-[40px]">
              <tr class="bg-primary-700-light text-sm">
                <th class="rounded-tl-xl px-5">No.</th>
                <th class="px-5">이름</th>
                <th class="px-5">전화번호</th>
                <th class="rounded-tr-xl px-5">예약 시간</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center h-[40px] text-sm">
                <td>{{ messageInfo.reservationNum }}</td>
                <td>{{ messageInfo.userName }}</td>
                <td>{{ messageInfo.phoneNum }}</td>
                <td>{{ prettyDate(messageInfo.updateAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="relative">
        <input
          type="text"
          placeholder="메시지 내용을 입력해주세요"
          @input="handleInputMessage($event)"
          :value="message"
          maxlength="45"
          class="w-full h-[45px] border-1 border-secondary-700 rounded-xl px-[17px] font-medium focus:border-primary-900 focus:outline-none focus:border-1 pr-[80px] text-sm"
        />
        <div class="absolute bottom-3 right-5 text-secondary-900-light text-sm">{{ message.length }}/45</div>
      </div>
      <div class="w-full flex justify-end items-center text-xl gap-3">
        <button class="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-900 lg:text-md bg-primary-900cursor-pointer select-none" @click="closeModal()">취소</button>
        <button class="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none" @click="handleClickSendButton()">전송</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
