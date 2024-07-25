<script setup>
import IconNotice from '../icons/IconNotice.vue';

import { useBoothPopup } from '@/stores/booths/boothPopup';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import { modalInfo } from '@/utils/constants';

const useBoothPopupStore = useBoothPopup();
const { seletedType, boothInfo } = storeToRefs(useBoothPopupStore);

const submit = ref(null);

const checkCorrectSelect = () => {
  if (seletedType.value === 'open') {
    return boothInfo.value.hasOwnProperty('isOpen');
  }
  if (seletedType.value === 'order') {
    return boothInfo.value.hasOwnProperty('isOrder');
  }
  if (seletedType.value === 'reservation') {
    return boothInfo.value.hasOwnProperty('isReservation');
  }
};

const getBoothInfo = () => {
  if (seletedType.value === 'open') {
    return String(boothInfo.value.isOpen);
  }
  if (seletedType.value === 'order') {
    return String(boothInfo.value.isOrder);
  }
  if (seletedType.value === 'reservation') {
    return String(boothInfo.value.isReservation);
  }
};
const handleSubmit = () => {
  if (!checkCorrectSelect()) {
    useBoothPopupStore.closePopup();
    return;
  }
  useBoothPopupStore.submitPopup();
};

onMounted(() => {
  // window.addEventListener('keydown', allowKeyEnter);
  submit.value?.focus();
});
</script>

<template>
  <!-- Success -->
  <form @submit.prevent="handleSubmit()">
    <div
      v-if="checkCorrectSelect()"
      class="w-[480px] h-[312px] flex flex-col justify-between items-center bg-white rounded-[20px]"
    >
      <div class="flex flex-col pt-[32px] items-center">
        <IconNotice :type="'info'" class="pb-[20px]" />
        <div class="text-secondary-700 text-xl text-center">
          {{ modalInfo[seletedType][`${getBoothInfo()}`]?.title }}
        </div>
        <div class="pt-[12px] text-secondary-700-light text-base whitespace-pre-wrap text-center">
          {{ modalInfo[seletedType][`${getBoothInfo()}`]?.subTitle }}
        </div>
      </div>
      <div class="flex justify-between gap-[20px] pb-[32px] w-full px-[40px]">
        <button type="button" class="is-button is-outlined w-[190px] h-[48px]" @click="useBoothPopupStore.closePopup()">
          취소
        </button>
        <button type="submit" class="is-button w-[190px] h-[48px]" autofocus ref="submit">확인</button>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="!checkCorrectSelect()"
      class="w-[480px] h-[312px] flex flex-col justify-between items-center bg-white rounded-[20px]"
    >
      <div class="flex flex-col pt-[32px] items-center">
        <IconNotice :type="'error'" class="pb-[20px]" />
        <div class="text-secondary-700 text-xl text-center">{{ modalInfo.error.title }}</div>
        <div class="pt-[12px] text-secondary-700-light text-base whitespace-pre-wrap text-center">
          {{ modalInfo.error.subTitle }}
        </div>
      </div>
      <div class="flex justify-between gap-[20px] pb-[32px] w-full px-[40px]">
        <button type="submit" class="is-button w-full h-[48px]" autofocus ref="submit">확인</button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
