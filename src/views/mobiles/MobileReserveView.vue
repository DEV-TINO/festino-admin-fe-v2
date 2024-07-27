<script setup>
import { ref } from "vue";
import ReserveList from "@/components/mobiles/reserves/ReserveList.vue";

const isActive = ref({
  reserveList: true,
  deleteList: false,
  completeList: false,
});

const listType = ref("reserve");

const toggleTab = (type) => {
  listType.value = type;
  if (type === "reserve") {
    isActive.value.reserveList = true;
    isActive.value.deleteList = false;
    isActive.value.completeList = false;
  } else if (type === "cancel") {
    isActive.value.reserveList = false;
    isActive.value.deleteList = true;
    isActive.value.completeList = false;
  } else if (type === "complete") {
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

const activeTab = (isActive) => {
  if (isActive) {
    return 'text-secondary-900'
  }
};
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-center font-semibold text-xl border-b border-secondary-300 relative gap-5">
      <div>
        <div @click="toggleTab('reserve')" class="mb-2 w-[90px] text-center cursor-pointer" :class="activeTab(!isActive['reserveList'])">
          예약 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['reserveList'])"></div>
      </div>
      <div>
        <div @click="toggleTab('complete')" class="mb-2 w-[90px] text-center cursor-pointer" :class="activeTab(!isActive['completeList'])">
          완료 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['completeList'])"></div>
      </div>
      <div>
        <div @click="toggleTab('cancel')" class="mb-2 w-[90px] text-center cursor-pointer" :class="activeTab(!isActive['deleteList'])">
          삭제 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['deleteList'])"></div>
      </div>
    </div>
    <div class="flex items-center w-full text-secondary-900 border-b border-secondary-300 py-4">
      <div class="flex w-full items-center">
        <div class="w-1/12"></div>
        <div class="w-1/12 flex flex-col items-center">
          <div>예약</div>
          <div>번호</div>
        </div>
        <div class="w-2/12 flex flex-col items-center">
          <div>예약자 /</div>
          <div>인원수</div>
        </div>
        <div class="w-5/12 flex flex-col items-center">
          <div>연락처 /</div>
          <div>예약시간</div>
        </div>
        <div class="w-2/12 text-center">예약관리</div>
        <div class="w-1/12"></div>
      </div>
    </div>
    <ReserveList :listType = "listType" />
  </div>
</template>

<style lang="css" scoped></style>
