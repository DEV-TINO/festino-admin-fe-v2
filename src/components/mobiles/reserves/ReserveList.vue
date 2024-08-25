<script setup>
import IconNotFound from '@/components/icons/IconNotFound.vue';
import IconLoading from '@/components/icons/IconLoading.vue';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useReserveList } from '@/stores/reserve/reserveList';
import { prettyDate } from '@/utils/utils';
import { useReserveModal } from '@/stores/mobiles/reserve/reserveModal';

const props = defineProps({
  listType: {
    type: String,
    required: true,
  }
});

const useReserveModalStore = useReserveModal();
const useReserveListStore = useReserveList();

const { getReserveList } = useReserveListStore;
const { reserveList } = storeToRefs(useReserveListStore);
const { openReservePopup, openMessagePopup } = useReserveModalStore;
const { selectBoothId } = storeToRefs(useReserveModalStore);

const reserveData = ref([]);
const loading = ref(false);
const interval = ref(null);

const getMobileNum = (num) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

const handleClickOpenReservePopup = (data) => {
  openReservePopup(props.listType, data);
};

const handleClickOpenMessagePopup = (data) => {
  openMessagePopup(data);
};

const refreshReserveList = () => {
  clearInterval(interval.value);
  interval.value = setInterval(async () => {
    if (!selectBoothId.value) return;
    await getReserveList({ boothId: selectBoothId.value, type: 'reserve' });
  }, 5000);
};

watch(() => props.listType, async () => {
  reserveData.value = [];
  loading.value = true;
  await getReserveList({ boothId: selectBoothId.value, type: props.listType });
  if (props.listType === 'reserve') reserveData.value = reserveList.value.reserve;
  else if (props.listType === 'cancel') reserveData.value = reserveList.value.cancel;
  else if (props.listType === 'complete') reserveData.value = reserveList.value.complete;
  loading.value = false;
});

watch(() => reserveList.value, () => {
  if (props.listType === 'reserve') reserveData.value = reserveList.value.reserve;
  else if (props.listType === 'cancel') reserveData.value = reserveList.value.cancel;
  else if (props.listType === 'complete') reserveData.value = reserveList.value.complete;
});

watch(() => selectBoothId.value, async () => {
  reserveData.value = [];
  loading.value = true;
  await getReserveList({ boothId: selectBoothId.value, type: props.listType });
  reserveData.value = reserveList.value.reserve;
  loading.value = false;
});

onMounted(async () => {
  loading.value = true;
  await getReserveList({ boothId: selectBoothId.value, type: props.listType });
  reserveData.value = reserveList.value.reserve;
  loading.value = false;
  refreshReserveList();
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="w-full flex flex-col">
    <div v-if="loading" class="w-full pt-36 justify-center items-center flex flex-col gap-4">
      <IconLoading :width="200" />
      <div>예약 내역을 불러오고 있습니다</div>
    </div>
    <div v-else class="flex items-center w-full py-[14px]" v-for="data in reserveData" :key="data.reservationNum">
      <div class="w-full gap-1.5 justify-center flex text-secondary-700-light items-center">
        <div class="w-1/12 text-xl font-semibold text-center">{{ data.reservationNum }}</div>
        <div class="w-2/12 text-sm flex flex-col gap-1 items-center">
          <div>{{ data.userName }}</div>
          <div>{{ data.personCount }}명</div>
        </div>
        <div class="w-4/12 items-center flex flex-col">
          <div class="text-sm">{{ getMobileNum(data.phoneNum) }}</div>
          <div class="text-secondary-900 text-xs">{{ prettyDate(data.updateAt) }}</div>
        </div>
        <div class="w-3/12 flex justify-center gap-1.5">
          <div @click="handleClickOpenReservePopup(data)" class="w-full text-center py-0.5 text-sm rounded-full bg-primary-900 border border-primary-900 text-white">
            관리
          </div>
          <div @click="handleClickOpenMessagePopup(data)" class="w-full text-center py-0.5 text-sm rounded-full border border-primary-900 text-primary-900">
            문자
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!loading && reserveData.length === 0"
      class="w-full pt-32 justify-center items-center flex flex-col gap-4"
    >
      <IconNotFound :width="200" />
      <p>예약 내역이 없습니다</p>
    </div>
  </div>
</template>

<style scoped></style>