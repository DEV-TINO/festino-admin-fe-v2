<script setup>
import IconBoothList from '@/components/icons/IconBoothList.vue';
import BoothList from '@/components/booths/BoothRow.vue';
import { onMounted, ref, watchEffect } from 'vue';

import { useBoothList } from '@/stores/booths/boothList';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { useUser } from '@/stores/user';

const useBoothListStore = useBoothList();
const useUserStore = useUser();

const { isAdmin, userOwnBoothId } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);
const orderedBoothList = ref([]);

const handleClickBoothCreate = () => {
  router.push({ name: 'BoothCreate' });
};

watchEffect(() => {
  if (isAdmin.value) {
    orderedBoothList.value = boothList.value;
  } else {
    if (boothList.value) {
      const myBooth = boothList.value.find((booth) => booth.boothId === userOwnBoothId.value);
      const otherBooths = boothList.value.filter((booth) => booth.boothId !== userOwnBoothId.value);
      orderedBoothList.value = [myBooth, ...otherBooths];
    }
  }
});

onMounted(async () => {
  useBoothListStore.getAllBoothList();
  useUserStore.getUserOwnBoothId();
});
</script>

<template>
  <div class="flex flex-col px-4 gap-[20px] min-w-[630px] pb-20">
    <!-- Booth header -->
    <div class="flex justify-between items-center pt-[100px] min-w-[350px]">
      <div class="flex items-center gap-4">
        <IconBoothList class="w-8" />
        <div class="text-primary-900 text-xl md:text-2xl font-semibold">부스리스트</div>
      </div>
      <div class="flex gap-4">
        <button
          v-if="isAdmin"
          class="hover:bg-primary-900 font-semibold w-[60px] h-[35px] rounded-xl text-sm lg:w-[60px] lg:h-[35px] flex items-center justify-center text-white lg:text-md bg-primary-900 cursor-pointer select-none"
          type="button"
          @click="handleClickBoothCreate()"
        >
          등록
        </button>
      </div>
    </div>

    <!-- Booth Body -->
    <div
      class="w-full flex flex-col h-full shadow-secondary rounded-b-[20px] outline outline-1 outline-primary-500 rounded-t-2xl text-secondary-700-light"
    >
      <!-- Header -->
      <div
        class="text-xs lg:text-[14px] font-semibold h-[55px] w-full bg-secondary-500 rounded-t-2xl flex justify-between gap-2 flex-nowrap overflow-x-auto items-center px-4 lg:px-[50px] border-b border-primary-700"
      >
        <div class="text-nowrap min-w-[21px] w-[21px] lg:min-w-[35px] text-center">번호</div>
        <div class="text-balance break-keep min-w-[75px] w-[75px] lg:min-w-[140px] text-center">관리자 카테고리</div>
        <div class="text-balance min-w-[42px] w-[70px] lg:min-w-[70px] lg:w-[140px] text-center">부스이름</div>
        <div class="text-balance min-w-[42px] w-[70px] lg:min-w-[70px] lg:w-[140px] text-center">운영시간</div>
        <div class="text-balance w-fit lg:min-w-[70px] lg:w-[70px] text-center">예약가능</div>
        <div class="text-balance w-fit lg:min-w-[70px] lg:w-[70px] text-center">오픈</div>
        <div class="text-balance w-fit lg:min-w-[70px] lg:w-[70px] text-center">주문가능</div>
        <div class="text-balance text-center w-[60px] lg:min-w-[75px]">부스정보</div>
      </div>

      <!-- Body -->
      <BoothList v-for="(booth, index) in orderedBoothList" :key="index" :boothIndex="index + 1" :boothInfo="booth" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
