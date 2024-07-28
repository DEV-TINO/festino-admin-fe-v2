<script setup>
import { ref, watch, onMounted } from 'vue';
import ReserveList from '@/components/mobiles/reserves/ReserveList.vue';
import { storeToRefs } from 'pinia';
import { useReserveList } from '@/stores/reserve/reserveList';

const isActive = ref({
  reserveList: true,
  deleteList: false,
  completeList: false,
});

const { reserveList } = storeToRefs(useReserveList());
const listType = ref('reserve');
const checkMark = ref(false);
const beforeReserveState = ref(0);

const toggleTab = (type) => {
  listType.value = type;
  if (type === 'reserve') {
    isActive.value.reserveList = true;
    isActive.value.deleteList = false;
    isActive.value.completeList = false;
  } else if (type === 'cancel') {
    isActive.value.reserveList = false;
    isActive.value.deleteList = true;
    isActive.value.completeList = false;
  } else if (type === 'complete') {
    isActive.value.reserveList = false;
    isActive.value.deleteList = false;
    isActive.value.completeList = true;
  }
};

const activeUnderline = (isActive) => {
  if (isActive) {
    return 'h-1 bg-primary-900 rounded-full text-secondary-700';
  }
};

const activeTab = (isActive) => {
  if (isActive) {
    return 'text-secondary-900';
  }
};

const visibility = () => {
  if (checkMark.value) return 'visible';
  else return 'invisible';
};

watch(
  () => reserveList.value.reserve,
  () => {
    if (listType.value !== 'reserve') {
      if (reserveList.value.reserve.length !== beforeReserveState.value) checkMark.value = true;
    } else checkMark.value = false;
    beforeReserveState.value = reserveList.value.reserve.length;
  },
);

onMounted(async () => {
  beforeReserveState.value = reserveList.value.reserve.length;
});
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-center font-semibold text-xl border-b border-secondary-300 relative gap-5">
      <div>
        <div>
          <div class="w-full flex justify-end">
            <div class="w-2 h-2 bg-danger rounded-full" :class="visibility()"></div>
          </div>
          <div
            @click="toggleTab('reserve')"
            class="mb-2 w-[90px] text-center cursor-pointer"
            :class="activeTab(!isActive['reserveList'])"
          >
            예약 목록
          </div>
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['reserveList'])"></div>
      </div>
      <div>
        <div class="h-2"></div>
        <div
          @click="toggleTab('complete')"
          class="mb-2 w-[90px] text-center cursor-pointer"
          :class="activeTab(!isActive['completeList'])"
        >
          완료 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['completeList'])"></div>
      </div>
      <div>
        <div class="h-2"></div>
        <div
          @click="toggleTab('cancel')"
          class="mb-2 w-[90px] text-center cursor-pointer"
          :class="activeTab(!isActive['deleteList'])"
        >
          삭제 목록
        </div>
        <div class="absolute -bottom-[2px] w-[90px]" :class="activeUnderline(isActive['deleteList'])"></div>
      </div>
    </div>
    <div class="flex items-center w-full text-secondary-900 border-b border-secondary-300 py-4">
      <div class="flex w-full items-center">
        <div class="w-1/12"></div>
        <div class="w-1/12 flex flex-col items-center">
          <div>예약</div>
          <div>번호</div>
        </div>
        <div class="w-2/12 flex flex-col items-center">
          <div>예약자 /</div>
          <div>인원수</div>
        </div>
        <div class="w-5/12 flex flex-col items-center">
          <div>연락처 /</div>
          <div>예약시간</div>
        </div>
        <div class="w-2/12 text-center">예약관리</div>
        <div class="w-1/12"></div>
      </div>
    </div>
    <ReserveList :listType="listType" />
  </div>
</template>

<style lang="css" scoped></style>
