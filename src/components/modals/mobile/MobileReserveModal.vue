<script setup>
import IconBoothInfo from '../../icons/IconBoothInfo.vue';
import { useReserveModal } from '@/stores/mobiles/reserve/reserveModal';
import { storeToRefs } from 'pinia';

const { closeMobilePopup, openConfirmPopup } = useReserveModal();
const { reserveData, popupType } = storeToRefs(useReserveModal());

const getMobileNum = (num) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

const clickCancel = () => {
  closeMobilePopup();
  openConfirmPopup('cancel');
};

const clickComplete = () => {
  closeMobilePopup();
  openConfirmPopup('confirm');
};

const clickReserve = () => {
  closeMobilePopup();
  openConfirmPopup('restore');
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
      <IconBoothInfo type="info" />
      <div class="flex flex-col items-center gap-4 w-full pt-5">
        <div class="font-bold text-xl text-secondary-700">예약 관리</div>
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
      <div class="mt-2 flex gap-5 font-semibold text-xl w-full pt-5">
        <div v-if="popupType !== 'complete'" @click="clickComplete()" class="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-900 text-white">
          입장
        </div>
        <div v-if="popupType !== 'cancel'" @click="clickCancel()" class="flex items-center justify-center w-full h-12 border-2 border-danger rounded-3xl text-danger">
          취소
        </div>
        <div v-if="popupType !== 'reserve'" @click="clickReserve()" class="flex items-center justify-center w-full h-12 border-2 border-primary-900 rounded-3xl text-primary-900">
          예약
        </div>
      </div>
    </div>
</template>

<style lang="css" scoped></style>
