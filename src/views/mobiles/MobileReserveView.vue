<script setup>
import ReserveList from '@/components/mobiles/reserves/ReserveList.vue';
import { ref, watch, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useReserveList } from '@/stores/reserve/reserveList';
import { useBoothList } from '@/stores/booths/boothList';
import { useReserveModal } from '@/stores/mobiles/reserve/reserveModal';
import { useUser } from '@/stores/user';

const useBoothListStore = useBoothList();

const { getAllBoothList } = useBoothListStore;
const { boothList } = storeToRefs(useBoothListStore);
const { selectedBooth } = storeToRefs(useReserveModal());
const { reserveList } = storeToRefs(useReserveList());
const { isAdmin, userOwnBoothId } = storeToRefs(useUser());

const reserveBoothList = ref([]);
const selectBooth = ref({});
const listType = ref('reserve');
const checkMark = ref(false);
const beforeReserveState = ref(0);

const isActive = ref({
  reserveList: true,
  deleteList: false,
  completeList: false,
});

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

watch(() => reserveList.value.reserve, () => {
  if (listType.value !== 'reserve') {
    if (reserveList.value.reserve.length !== beforeReserveState.value) checkMark.value = true;
  } else checkMark.value = false;
    beforeReserveState.value = reserveList.value.reserve.length;
  },
);

watchEffect(() => {
  if (!selectedBooth.value.boothId) return;
  if (!reserveBoothList.value) return;
  selectBooth.value = reserveBoothList.value.find((booth) => booth.boothId === selectedBooth.value.boothId);
  toggleTab('reserve');
});

onMounted(async () => {
  await getAllBoothList();
  reserveBoothList.value = boothList.value.filter((booth) => booth?.isReservation);
  if (isAdmin.value) {
    selectedBooth.value = reserveBoothList.value[0];
  } else {
    if (userOwnBoothId.value) {
      selectedBooth.value = reserveBoothList.value.find((booth) => booth.boothId === userOwnBoothId.value);
      console.log(selectedBooth.value)
    } else {
      alertError('부스를 소유하고 있지 않습니다.');
      router.push('/');
    }
  }
  beforeReserveState.value = reserveList.value.reserve.length;
});
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-end w-full px-4 items-center gap-4" v-if="isAdmin">
      <select
        class="max-w-[160px] rounded-lg border-gray-400 text-secondary-900 text-sm focus:text-black focus:ring-white focus:border-primary-900 block w-full px-4"
        v-model="selectedBooth"
      >
        <option v-for="(booth, boothIndex) in reserveBoothList" :key="boothIndex" :value="booth">
          {{ booth.adminName }}
        </option>
      </select>
    </div>
    <div class="pt-4 flex justify-center font-semibold text-xl border-b border-secondary-300 relative gap-5">
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
      <div class="flex w-full items-center justify-center gap-1.5">
        <div class="w-1/12 flex flex-col items-center">
          <div>예약</div>
          <div>번호</div>
        </div>
        <div class="w-2/12 flex flex-col items-center">
          <div>예약자 /</div>
          <div>인원수</div>
        </div>
        <div class="w-4/12 flex flex-col items-center">
          <div>연락처 /</div>
          <div>예약시간</div>
        </div>
        <div class="w-3/12 flex items-center gap-1.5 justify-center">
          <div class="w-full flex flex-col items-center">
            <div>예약</div>
            <div>관리</div>
          </div>
          <div class="w-full flex flex-col items-center">
            <div>문자</div>
            <div>커스텀</div>
          </div>
        </div>
      </div>
    </div>
    <ReserveList v-if="selectedBooth.boothId" :listType="listType" />
  </div>
</template>

<style lang="css" scoped></style>
