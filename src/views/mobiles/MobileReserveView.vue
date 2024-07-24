<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useReserveModalStore } from "@/stores/mobiles/reserve/reserveModalStore";
import ReserveList from "@/components/mobiles/reserves/ReserveList.vue";
import DeleteList from "@/components/mobiles/reserves/DeleteList.vue";
import completeList from "@/components/mobiles/reserves/CompleteList.vue";
import RestoreConfirmModal from "@/components/mobiles/reserves/RestoreConfirmModal.vue";
import ReserveAdminModal from '@/components/mobiles/reserves/ReserveAdminModal.vue';
import ReserveConfirmModal from "@/components/mobiles/reserves/ReserveConfirmModal.vue";

const { restoreConfirmModalState, adminModalState, reserveConfirmModalState } = storeToRefs(useReserveModalStore());

const isActive = ref({
  reserveList: true,
  deleteList: false,
  completeList: false,
});

const toggleTab = (type) => {
  if (type === "reserveList") {
    isActive.value.reserveList = true;
    isActive.value.deleteList = false;
    isActive.value.completeList = false;
  } else if (type === "deleteList") {
    isActive.value.reserveList = false;
    isActive.value.deleteList = true;
    isActive.value.completeList = false;
  } else if (type === "completeList") {
    isActive.value.reserveList = false;
    isActive.value.deleteList = false;
    isActive.value.completeList = true;
  }
};

const activeUnderline = (isActive) => {
  if (isActive) {
    return 'h-1 bg-primary-900 rounded-full text-secondary-700'
  }
};

const activeCancelUnderline = (isActive) => {
  if (isActive) {
    return 'h-1 bg-danger rounded-full text-secondary-700'
  }
};

const activeTab = (isActive) => {
  if (isActive) {
    return 'text-secondary-900'
  }
};
</script>

<template>
  <RestoreConfirmModal v-if="restoreConfirmModalState" />
  <ReserveAdminModal v-if="adminModalState" />
  <ReserveConfirmModal v-if="reserveConfirmModalState" />
  <div class="w-full h-full">
    <div class="flex font-semibold text-xl border-b border-secondary-300 relative">
      <div class="w-1/12"></div>
      <div class="pr-5">
        <div @click="toggleTab('reserveList')" class="mb-2 w-[90px] text-center cursor-pointer" :class="activeTab(!isActive['reserveList'])">
          예약 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['reserveList'])"></div>
      </div>
      <div class="pr-5">
        <div @click="toggleTab('completeList')" class="mb-2 w-[90px] text-center cursor-pointer" :class="activeTab(!isActive['completeList'])">
          완료 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['completeList'])"></div>
      </div>
      <div>
        <div @click="toggleTab('deleteList')" class="mb-2 w-[90px] text-center cursor-pointer" :class="activeTab(!isActive['deleteList'])">
          삭제 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeCancelUnderline(isActive['deleteList'])"></div>
      </div>
    </div>
    <div class="flex items-center w-full text-secondary-900 border-b border-secondary-300 py-4">
      <div class="flex w-full">
        <div class="w-1/12"></div>
        <div class="w-1/12 flex flex-col">
          <div>예약</div>
          <div>번호</div>
        </div>
        <div class="w-2/12 flex flex-col">
          <div>예약자</div>
          <div>인원수</div>
        </div>
        <div class="w-5/12 flex flex-col">
          <div>연락처</div>
          <div>예약시간</div>
        </div>
        <div class="w-2/12 text-end">예약관리</div>
        <div class="w-1/12"></div>
      </div>
    </div>
    <ReserveList v-if="isActive['reserveList']" />
    <DeleteList v-if="isActive['deleteList']" />
    <completeList v-if="isActive['completeList']" />
  </div>
</template>

<style lang="css" scoped></style>
