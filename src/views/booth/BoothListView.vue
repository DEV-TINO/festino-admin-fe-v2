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
  <div class="flex flex-col px-4 gap-[40px] min-w-[630px] pb-20">
    <!-- Booth header -->
    <div class="flex justify-between pt-[50px] lg:pt-[100px] min-w-[350px]">
      <div class="flex items-center gap-4">
        <IconBoothList />
        <div class="text-primary-900 text-4xl font-semibold">부스리스트</div>
      </div>
      <div class="flex gap-4">
        <button
          v-if="isAdmin"
          class="hover:bg-primary-900 w-[80px] h-[48px] rounded-xl text-lg lg:w-[106px] lg:h-[53px] flex items-center justify-center text-white lg:text-2xl bg-primary-900 lg:rounded-2xl cursor-pointer select-none"
          type="button"
          @click="handleClickBoothCreate()"
        >
          등록
        </button>
      </div>
    </div>

    <!-- Booth Body -->
    <div
      class="w-full flex flex-col h-full shadow-primary rounded-b-[20px] border-1 border-primary-700 rounded-t-2xl text-secondary-700-light"
    >
      <!-- Header -->
      <div
        class="text-xs lg:text-xl font-semibold h-[70px] w-full bg-primary-700 rounded-t-2xl flex justify-between gap-4 flex-nowrap overflow-x-auto items-center px-4 lg:px-[60px] border-b border-primary-700"
      >
        <div class="text-nowrap min-w-[21px] w-[21px] lg:min-w-[35px] text-center">번호</div>
        <div class="text-balance break-keep min-w-[75px] w-[75px] lg:min-w-[130px] text-center">관리자 카테고리</div>
        <div class="text-balance min-w-[42px] w-[70px] lg:min-w-[70px] lg:w-[140px] text-center">부스이름</div>
        <div class="text-balance min-w-[42px] w-[70px] lg:min-w-[70px] lg:w-[140px] text-center">운영시간</div>
        <div class="text-balance w-fit lg:min-w-[70px] lg:w-[70px] text-center">예약가능</div>
        <div class="text-balance w-fit lg:min-w-[70px] lg:w-[70px] text-center">오픈</div>
        <div class="text-balance w-fit lg:min-w-[70px] lg:w-[70px] text-center">주문가능</div>
        <div class="text-balance text-center w-[60px] lg:w-[100px]">부스정보</div>
      </div>

      <!-- Body -->
      <BoothList v-for="(booth, index) in orderedBoothList" :key="index" :boothIndex="index + 1" :boothInfo="booth" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
