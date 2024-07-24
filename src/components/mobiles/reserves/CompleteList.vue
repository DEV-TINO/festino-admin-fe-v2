<script setup>
import { ref, onMounted } from "vue";
import { useReserveStore } from "@/stores/mobiles/reserve/reserveStore.js";
import { storeToRefs } from "pinia";
import { useReserveModalStore } from "@/stores/mobiles/reserve/reserveModalStore";

const { reserveData } = storeToRefs(useReserveStore());
const { getReserveData } = useReserveStore();
const { handleClickOpenConfirm } = useReserveModalStore();
const type = ref("complete")

const getMobileNum = (num) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 10)}`
};

const getReserveTime = (timeData) => {
  const date = timeData.split("T");
  const time = date[1].split(":");
  return `${date[0]} ${time[0]}:${time[1]}`;
};

onMounted(() => {
  getReserveData(type.value);
});
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex items-center w-full py-[14px]" v-for="data in reserveData" :key="data">
      <div class="w-full flex text-secondary-700-light items-center">
        <div class="w-1/12"></div>
        <div class="w-1/12 text-xl font-semibold text-center">{{ data.reservationNum }}</div>
        <div class="w-2/12 text-sm flex flex-col gap-1">
          <div>{{ data.userName }}</div>
          <div>{{ data.personCount }}명</div>
        </div>
        <div class="w-5/12">
          <div class="text-sm">{{ getMobileNum(data.phoneNum) }}</div>
          <div class=" text-secondary-900 text-xs">{{ getReserveTime(data.updateAt) }}</div>
        </div>
        <div class="w-2/12 flex justify-end">
          <div @click="handleClickOpenConfirm(data, type)" class="px-4 py-1 rounded-full bg-restore text-primary-900">복구</div>
        </div>
        <div class="w-1/12"></div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
