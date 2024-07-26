<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useReserveList } from "@/stores/reserve/reserveList";
import { prettyDate } from "@/utils/utils";
import { useUser } from '@/stores/user.js';
import { useReserveModal } from '@/stores/mobiles/reserve/reserveModal';
import IconNotFound from '../../icons/IconNotFound.vue';

const props = defineProps({
  listType: {
    type: String,
    required: true
  }
});

const { getReserveList } = useReserveList();
const { getUserOwnBoothId } = useUser();
const { reserveList } = storeToRefs(useReserveList());
const { userOwnBoothId } = storeToRefs(useUser());
const { openReservePopup } = useReserveModal();
const reserveData = ref([]);
const loading = ref(false);

const getMobileNum = (num) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`
};

const handleClickOpenReservePopup = (data) => {
  openReservePopup(props.listType, data);
};

watch(() => props.listType, async() => {
  reserveData.value = [];
  loading.value = true;
  await getReserveList({ boothId: userOwnBoothId.value, type: props.listType });
  if (props.listType === "reserve") reserveData.value = reserveList.value.reserve;
  else if (props.listType === "cancel") reserveData.value = reserveList.value.cancel;
  else if (props.listType === "complete") reserveData.value = reserveList.value.complete;
  loading.value = false;
});

watch(() => reserveList.value, () => {
  if (props.listType === "reserve") reserveData.value = reserveList.value.reserve;
  else if (props.listType === "cancel") reserveData.value = reserveList.value.cancel;
  else if (props.listType === "complete") reserveData.value = reserveList.value.complete;
});

onMounted(async () => {
  loading.value = true;
  await getUserOwnBoothId();
  await getReserveList({ boothId: userOwnBoothId.value, type: props.listType });
  reserveData.value = reserveList.value.reserve;
  loading.value = false;
});
</script>

<template>
  <div class="w-full flex flex-col">
    <div v-if="loading">loading</div>
    <div v-else class="flex items-center w-full py-[14px]" v-for="data in reserveData" :key="data.reservationNum">
      <div class="w-full flex text-secondary-700-light items-center">
        <div class="w-1/12"></div>
        <div class="w-1/12 text-xl font-semibold text-center">{{ data.reservationNum }}</div>
        <div class="w-2/12 text-sm flex flex-col gap-1 items-center">
          <div>{{ data.userName }}</div>
          <div>{{ data.personCount }}명</div>
        </div>
        <div class="w-5/12 items-center flex flex-col">
          <div class="text-sm">{{ getMobileNum(data.phoneNum) }}</div>
          <div class=" text-secondary-900 text-xs">{{ prettyDate(data.updateAt) }}</div>
        </div>
        <div class="w-2/12 flex justify-center">
          <div @click="handleClickOpenReservePopup(data)" class="px-4 py-1 rounded-full bg-restore text-primary-900">관리</div>
        </div>
        <div class="w-1/12"></div>
      </div>
    </div>
    <div v-if="!loading && reserveData.length === 0" class="w-full pt-32 justify-center items-center flex flex-col gap-4">
      <IconNotFound :width="200" />
      <p>에약 내역이 없습니다</p>
    </div>
  </div>
</template>

<style scoped>

</style>