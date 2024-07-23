<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconFileUpload from '@/components/icons/IconFileUpload.vue';
import IconAdd from '@/components/icons/mobiles/IconAdd.vue';
import SelectOption from '@/components/mobiles/SelectOption.vue';
import { computed, ref, watch } from 'vue';

const boothDescription = ref('');
const characterCount = computed(() => boothDescription.value.length);

watch(boothDescription, (newVal) => {
  if (newVal.length > 100) {
    boothDescription.value = newVal.slice(0, 100);
  }
});
</script>
<template>
  <div class="dynamic-padding flex flex-col gap-[20px]">
    <div class="flex gap-[10px] items-center">
      <div class="w-[90px] font-bold text-base shrink-0">학과</div>
      <div class="w-full px-5 py-3 bg-black bg-opacity-5 rounded-[10px] text-sm">컴퓨터공학부</div>
    </div>
    <div class="flex gap-[10px] items-center">
      <div class="w-[90px] font-bold text-base shrink-0">부스이름</div>
      <input
        placeholder="부스 이름을 작성해주세요."
        class="w-full px-5 py-3 bg-black bg-opacity-5 rounded-[10px] text-sm foucs:outline-none"
      />
    </div>
    <div class="flex gap-[10px] items-center">
      <div class="w-[90px] font-bold text-base shrink-0">운영 시간</div>
      <input
        placeholder="예) 15:00 ~ 20:00"
        class="w-full px-5 py-3 bg-black bg-opacity-5 rounded-[10px] text-sm foucs:outline-none"
      />
      <IconBoothListToggle width="48" />
    </div>
    <div class="relative flex flex-col gap-[10px] items-start">
      <div class="font-bold text-base">부스 소개</div>
      <textarea
        v-model="boothDescription"
        placeholder="부스 소개를 작성해주세요."
        class="resize-none w-full h-[97px] bg-black bg-opacity-5 rounded-3xl text-sm border-none p-5"
      />
      <div class="absolute bottom-9 right-5 text-sm">{{ characterCount }}/100</div>
    </div>
    <div class="flex flex-col gap-[10px] items-start">
      <div class="font-bold text-base">부스 사진</div>
      <!-- ADD: BOOTH IMAGE -->
    </div>
    <div class="flex flex-col gap-[10px] items-start">
      <div class="font-bold text-base">메뉴 정보</div>
      <!-- <MobileMenuDetail /> -->
      <div class="w-full h-[150px] flex flex-col items-center justify-center border-dashed border-2 rounded-3xl">
        <IconAdd />
        <div class="pt-[10px] text-base">메뉴 추가하기</div>
      </div>
    </div>
    <!-- Show when night booth -->
    <div class="flex flex-col gap-[10px] items-start">
      <div class="font-bold text-base shrink-0">예약 기능 사용 여부</div>
      <SelectOption />
    </div>
    <div class="flex flex-col gap-[10px] items-start">
      <div class="font-bold text-base shrink-0">쿠폰 진행 여부</div>
      <SelectOption />
    </div>
    <div class="flex flex-col gap-[10px] items-start">
      <div class="font-bold text-base shrink-0">주문 기능 사용 여부</div>
      <SelectOption />
    </div>
  </div>
  <div class="w-full dynamic-padding flex gap-[10px] py-20">
    <button class="w-full bg-[#CCCCCC] rounded-[50px] text-white font-bold h-[54px]">취소</button>
    <button class="w-full bg-[#CCCCCC] rounded-[50px] text-white font-bold h-[54px]">등록</button>
  </div>
</template>

<style lang="css" scoped>
.dynamic-padding {
  padding-left: calc(20 / 430 * 100%) !important;
  padding-right: calc(20 / 430 * 100%) !important;
}
</style>
