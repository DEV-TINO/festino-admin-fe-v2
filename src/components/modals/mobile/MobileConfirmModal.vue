<script setup>
import IconBoothInfo from '../../icons/IconBoothInfo.vue';
import { ref, watchEffect, watch } from 'vue';
import { useReserveModal } from '../../../stores/mobiles/reserve/reserveModal';
import { useReserveList } from '@/stores/reserve/reserveList';
import { storeToRefs } from 'pinia';
import { BOOTH_POPUP_INFO } from '@/utils/constants';

const useReserveModalStore = useReserveModal();

const { confirmReserve, deleteReserve, restoreReserve, getReserveList } = useReserveList();
const { closeMobilePopup, openLoadingModal } = useReserveModalStore;
const { reserveData, confirmType, popupType, selectedBooth } = storeToRefs(useReserveModalStore);
const title = ref('');
const subTitle = ref('');
const loading = ref(false);

const confirm = async() => {
  loading.value = true;
  if (confirmType.value === 'confirm') await confirmReserve({boothId : selectedBooth.value.boothId, reserveId : reserveData.value.reservationId});
  else if (confirmType.value === 'cancel') await deleteReserve({boothId : selectedBooth.value.boothId, reserveId : reserveData.value.reservationId});
  else if (confirmType.value === 'restore') {
    await restoreReserve({boothId : selectedBooth.value.boothId, reserveId : reserveData.value.reservationId, reserveType : popupType.value});
    await getReserveList({boothId : selectedBooth.value.boothId, type : 'reserve'});
  }
  await getReserveList({boothId : selectedBooth.value.boothId, type : popupType.value});
  closeMobilePopup();
  loading.value = false;
};

watch(() => loading.value, () => {
  if (loading.value) openLoadingModal();
  else closeMobilePopup();
});

watchEffect(() => {
  if (confirmType.value) {
    title.value = BOOTH_POPUP_INFO[confirmType.value]?.title || '';
    subTitle.value = BOOTH_POPUP_INFO[confirmType.value]?.subTitle || '';
  }
});
</script>

<template>
  <div class="w-[380px] min-w-[325px] bg-white rounded-3xl flex flex-col items-center px-10 py-8 gap-5">
    <IconBoothInfo :type="confirmType === 'cancel' ? 'danger' : 'info'" />
    <div class="flex flex-col items-center gap-4 w-full">
      <div class="font-bold text-xl text-secondary-700">{{ title }}</div>
      <div class="text-secondary-500 text-center whitespace-pre-wrap">
        <div>{{ subTitle }}</div>
      </div>
    </div>
    <div class="mt-2 flex gap-5 font-semibold text-xl w-full">
      <div class="flex items-center justify-center w-full h-12 border-2 border-primary-900 rounded-3xl text-primary-900" @click="closeMobilePopup()">
        취소
      </div>
      <div @click="confirm()" class="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-900 text-white">
        확인
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
