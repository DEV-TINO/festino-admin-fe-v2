<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';

import { useBoothPopup } from '@/stores/booths/boothPopup';
import { useBoothList } from '@/stores/booths/boothList';
import { useUser } from '@/stores/user';
import { storeToRefs } from 'pinia';

// Pinia Store
const { openPopup } = useBoothPopup();
const { handleClickBoothDetail } = useBoothList();
const useUserStore = useUser();
const { userOwnBoothId, isAdmin } = storeToRefs(useUserStore);

// Props
const props = defineProps({
  boothIndex: Number,
  boothInfo: Object,
});

// Variables
const windowWidth = ref(window.innerWidth);

const toggleWidth = computed(() => {
  if (windowWidth.value < 1024) return 40;
  return 70;
});

// Functions
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const isBoothOwner = computed(() => {
  return isAdmin.value || props.boothInfo.boothId === userOwnBoothId.value;
});

// Handlers
const handleClickBoothOpen = () => {
  if (!isBoothOwner.value) {
    alert('본인 부스가 아닙니다.');
    return;
  }

  openPopup({
    type: 'open',
    boothInfo: props.boothInfo,
  });
};

const handleClickBoothOrder = () => {
  if (!isBoothOwner.value) {
    alert('본인 부스가 아닙니다.');
    return;
  }

  openPopup({
    type: 'order',
    boothInfo: props.boothInfo,
  });
};

const handleClickBoothReservation = () => {
  if (!isBoothOwner.value) {
    alert('본인 부스가 아닙니다.');
    return;
  }

  openPopup({
    type: 'reservation',
    boothInfo: props.boothInfo,
  });
};

// Vue Lifecycle Hooks
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});
</script>

<template>
  <div
    class="text-second-700-light bg-white text-xs lg:text-xl h-[70px] w-full flex justify-between gap-4 flex-nowrap overflow-x-auto items-center px-4 lg:px-[60px] last:rounded-b-[20px] last:border-0 border-b-2 border-secondary-500"
    :class="{
      'bg-slate-200': isBoothOwner && !isAdmin,
      'font-bold': isBoothOwner && !isAdmin,
      'hover:bg-slate-200': isBoothOwner && !isAdmin,
      'hover:bg-slate-50': !isBoothOwner || isAdmin,
    }"
  >
    <!-- Booth Index -->
    <div class="text-nowrap min-w-[21px] w-[21px] lg:min-w-[35px] lg:w-[35px] text-center">
      {{ boothIndex }}
    </div>

    <!-- Booth Category -->
    <div class="text-wrap break-keep min-w-[75px] w-[75px] lg:min-w-[130px] lg:w-[130px] text-center">
      {{ boothInfo.adminCategory }}
    </div>

    <!-- Booth Name -->
    <div class="text-wrap break-keep min-w-[42px] w-[70px] lg:min-w-[70px] lg:w-[140px] text-center">
      {{ boothInfo.boothName }}
    </div>

    <!-- Open time to Close Time -->
    <div class="text-wrap break-keep min-w-[42px] w-[70px] lg:min-w-[70px] lg:w-[140px] text-center">
      {{ boothInfo.openTime }} ~ {{ boothInfo.closeTime }}
    </div>

    <!-- Can Reserve? -->
    <div
      class="text-wrap w-fit lg:min-w-[70px] lg:w-[70px] text-center flex items-center justify-center"
      @click="handleClickBoothReservation()"
    >
      <IconBoothListToggle :isActive="boothInfo?.isReservation ?? false" :width="toggleWidth"></IconBoothListToggle>
    </div>

    <!-- Is Open? -->
    <div
      class="text-wrap w-fit lg:min-w-[70px] lg:w-[70px] text-center flex items-center justify-center"
      @click="handleClickBoothOpen()"
    >
      <IconBoothListToggle :isActive="boothInfo?.isOpen ?? false" :width="toggleWidth"></IconBoothListToggle>
    </div>

    <!-- Can Order? -->
    <div
      class="text-wrap w-fit lg:min-w-[70px] lg:w-[70px] text-center flex items-center justify-center"
      @click="handleClickBoothOrder()"
    >
      <IconBoothListToggle :isActive="boothInfo?.isOrder ?? false" :width="toggleWidth"></IconBoothListToggle>
    </div>

    <!-- Go To Booth Detail -->
    <div
      class="text-nowrap w-[60px] h-[30px] rounded-2xl flex items-center justify-center text-center lg:w-[100px] lg:h-[40px] bg-primary-800 lg:rounded-2xl text-primary-900 cursor-pointer select-none font-semibold"
      @click="handleClickBoothDetail(boothInfo?.boothId)"
    >
      부스정보
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
