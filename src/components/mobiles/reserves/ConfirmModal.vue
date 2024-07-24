<script setup>
import { useReserveModalStore } from "@/stores/mobiles/reserve/reserveModalStore";
import { useReserveStore } from "@/stores/mobiles/reserve/reserveStore";
import { storeToRefs } from "pinia";

const { confirmData, confirmType } = storeToRefs(useReserveModalStore());
const { handleClickCloseConfirm } = useReserveModalStore();
const { updateReservation } = useReserveStore();

const getConfirmType = () => {
  if (confirmType.value === "reserve") return "삭제";
  else if (confirmType.value === "cancel") return "복구";
};

const getMobileNum = (num) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 10)}`
};

const confirm = (reservationId) => {
  updateReservation(reservationId, confirmType.value);
  handleClickCloseConfirm();
};
</script>

<template>
  <div class="max-w-[500px] w-full h-full fixed top-0 bg-opacity-60 bg-black z-50 flex justify-center items-center px-6">
    <div class="w-[380px] bg-white rounded-3xl flex flex-col items-center px-10 py-8 gap-5" @click.stop>
      <div class="w-12 h-12 rounded-full bg-confirmation-icon bg-restore bg-center bg-no-repeat bg[length:32px_32px]"></div>
      <div class="flex flex-col items-center gap-4 w-full">
        <div class="font-bold text-xl text-secondary-700">예약 {{ getConfirmType() }} 안내</div>
        <div class="flex w-full rounded-2xl text-sm border border-primary-700">
          <div class="flex flex-col rounded-l-2xl bg-restore border-r border-primary-700">
            <div class="py-2.5 px-5 border-b border-primary-700">No.</div>
            <div class="py-2.5 px-5 border-b border-primary-700">입금자명</div>
            <div class="py-2.5 px-5">전화번호</div>
          </div>
          <div class="flex flex-col grow">
            <div class="py-2.5 px-5 border-b border-primary-700">{{ confirmData.reservationNum }}</div>
            <div class="py-2.5 px-5 border-b border-primary-700">{{ confirmData.userName }}</div>
            <div class="py-2.5 px-5">{{ getMobileNum(confirmData.phoneNum) }}</div>
          </div>
        </div>
        <div class="text-secondary-500 text-center">
          <div>해당 예약을 {{ getConfirmType() }}하시겠습니까?</div>
          <div>확인 버튼 선택 시, 해당 예약이 {{ getConfirmType() }}됩니다.</div>
        </div>
      </div>
      <div class="mt-6 flex gap-5 font-semibold text-xl w-full">
        <div class="flex items-center justify-center w-full h-12 border-2 border-primary-900 rounded-3xl text-primary-900" @click="handleClickCloseConfirm()">
          취소
        </div>
        <div @click="confirm(confirmData.reservationId)" class="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-900 text-white">
          확인
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
