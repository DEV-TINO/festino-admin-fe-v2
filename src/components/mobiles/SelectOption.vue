<script setup>
import { ref, defineProps } from 'vue';

const disagree = 0;
const agree = 1;
const defaultOption = -1;
const selectedOption = ref(-1);

const handleClickOptions = (optionNum) => {
  selectedOption.value = optionNum;
};
</script>

<template>
  <div class="flex">
    <div @click="handleClickOptions(disagree)" class="w-fit h-fit flex items-center cursor-pointer">
      <svg class="mr-1" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="12.5"
          r="12"
          fill="#CCCCCC"
          :class="selectedOption == disagree ? 'fill-[#0073F0]' : 'fill-[#CCCCCC]'"
        />
        <path
          d="M7.19922 12.4984L10.7992 16.0984L17.9992 8.89844"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <div class="pl-1 text-base font-semibold" :class="{ 'is-select-menu-option': selectedOption == disagree }">
        사용 비동의
      </div>
    </div>
    <div @click="handleClickOptions(agree)" class="w-fit h-fit flex items-center pl-10 cursor-pointer">
      <svg class="mr-1" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="12.5"
          r="12"
          fill="#CCCCCC"
          :class="selectedOption == agree ? 'fill-[#0073F0]' : 'fill-[#CCCCCC]'"
        />
        <path
          d="M7.19922 12.4984L10.7992 16.0984L17.9992 8.89844"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <div class="pl-1 text-base font-semibold" :class="{ 'is-select-menu-option': selectedOption == agree }">
        사용 동의
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
