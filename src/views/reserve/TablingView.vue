<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconLoading from '@/components/icons/IconLoading.vue';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import IconReservation from '@/components/icons/IconReservation.vue';
import router from '@/router';
import { useBoothList } from '@/stores/booths/boothList';
import { useReserveList } from '@/stores/reserve/reserveList';
import { useUser } from '@/stores/user';
import { alertError } from '@/utils/api';
import { prettyDate } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';

const useUserStore = useUser();
const useBoothListStore = useBoothList();
const useReserveListStore = useReserveList();

const { getAllBoothList } = useBoothListStore;
const { getReserveList, deleteReserve, confirmReserve, restoreReserve, getFilteredReserveList } = useReserveListStore;

const { isAdmin, userOwnBoothId } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);
const { reserveList, searchKeyword } = storeToRefs(useReserveListStore);

const reserveBoothList = ref('');

const selectBooth = ref('');
const selectBoothId = ref('');
const selectOrderType = ref('reserve'); // reserve, cancel, complete

const reserveNum = ref(0);
const isUpdate = ref(false);
const isUserChecked = ref(false);
const isLoading = ref(false);

const interval = ref(null);

const setIsUpdate = ({ reserveLength }) => {
  if (isUserChecked.value) {
    isUpdate.value = false;
  } else if (reserveLength !== reserveNum.value) {
    isUpdate.value = true;
  } else if (reserveLength === reserveNum.value && isUserChecked.value) {
    isUpdate.value = false;
  }
  reserveNum.value = reserveLength;
};

const handleClickOrderType = (type) => {
  if (type === 'reserve') isUserChecked.value = true;
  else isUserChecked.value = false;
  selectOrderType.value = type;
};

const handleClickDelete = async (reserveId) => {
  const status = await deleteReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
  });
  if (status) {
    const getReserveListAll = await Promise.allSettled([
      getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
      getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
    ]);
  }
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
};

const handleClickConfirm = async (reserveId) => {
  const status = await confirmReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
  });
  if (status) {
    const getReserveListAll = await Promise.allSettled([
      getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
      getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
    ]);
  }
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
};

const handleClickRestore = async (reserveId) => {
  const status = await restoreReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
    reserveType: selectOrderType.value,
  });
  if (status) {
    const getReserveListAll = await Promise.allSettled([
      getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
      getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
    ]);
  }
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
};

const refereshReserveList = () => {
  interval.value = setInterval(async () => {
    if (!selectBoothId.value) return;
    if (!selectOrderType.value) return;
    console.log('Referesh Reserve List');

    if (selectOrderType.value === 'reserve') {
      await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
    } else {
      const getReserveListAll = await Promise.allSettled([
        getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
        getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
      ]);
    }
    setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
  }, 5000);
};

watchEffect(async () => {
  if (!selectBoothId.value) return;
  if (!selectOrderType.value) return;
  isLoading.value = true;
  await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
  clearReferesh();
  refereshReserveList();
  isLoading.value = false;
});

watchEffect(() => {
  if (!selectBoothId.value) return;
  if (!reserveBoothList.value) return;
  selectBooth.value = reserveBoothList.value.find((booth) => booth.boothId === selectBoothId.value);
});

watchEffect(() => {
  if (selectOrderType.value === 'reserve') {
    isUserChecked.value = true;
  } else {
    isUserChecked.value = false;
  }
});

const clearReferesh = () => {
  if (!interval.value) return;
  console.log('clearReferesh');
  clearInterval(interval.value);
};

onMounted(async () => {
  console.log('[TablingView] isAdmin:', isAdmin.value);
  console.log('[TablingView] userOwnBoothId:', userOwnBoothId.value);
  clearReferesh();
  if (isAdmin.value) {
    await getAllBoothList();
    reserveBoothList.value = boothList.value.filter((booth) => booth?.isReservation);
    selectBoothId.value = reserveBoothList.value[0].boothId;
  } else {
    if (userOwnBoothId.value) {
      selectBoothId.value = userOwnBoothId.value;
    } else {
      alertError('부스를 소유하고 있지 않습니다.');
      router.push('/');
    }
  }
  refereshReserveList();
});

onUnmounted(() => {
  clearReferesh();
});
</script>
<template>
  <div class="flex flex-col px-4 gap-[40px] min-w-[630px] pb-20">
    <!-- Reserve Header -->
    <div class="flex justify-between pt-[50px] lg:pt-[100px] min-w-[350px] gap-4">
      <div class="flex items-center gap-4">
        <IconReservation />
        <div class="text-primary-900 text-4xl font-semibold">{{ selectBooth.adminName }} 예약 현황</div>
      </div>
      <div
        class="w-[320px] h-[55px] rounded-[20px] bg-primary-800-light text-primary-900 flex justify-center items-center text-2xl gap-[10px]"
      >
        예약 기능 ON/OFF <IconBoothListToggle :width="70" :is-active="selectBooth.isReservation" />
      </div>
    </div>
    <!-- Reserve Category -->
    <div class="flex justify-between min-w-[350px] gap-4">
      <div class="flex items-center gap-4">
        <button
          class="is-button w-[120px] h-[50px] relative"
          :class="{ 'is-outlined': selectOrderType !== 'reserve' }"
          @click="handleClickOrderType('reserve')"
        >
          예약 목록
          <div
            v-if="isUpdate && !isUserChecked"
            class="rounded-full w-3 h-3 bg-red-600 absolute right-2 top-[18px]"
          ></div>
        </button>
        <button
          class="is-button w-[120px] h-[50px]"
          :class="{ 'is-outlined': selectOrderType !== 'complete' }"
          @click="handleClickOrderType('complete')"
        >
          확인 목록
        </button>
        <button
          class="is-button w-[120px] h-[50px] is-danger"
          :class="{ 'is-outlined': selectOrderType !== 'cancel' }"
          @click="handleClickOrderType('cancel')"
        >
          삭제 목록
        </button>
      </div>
      <div
        class="w-[450px] h-[55px] rounded-[20px] bg-primary-800-light text-primary-900 flex justify-center items-center text-2xl gap-[10px]"
      >
        <div class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            class="peer block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="예약 검색(예약자, 전화번호...)"
            v-model="searchKeyword"
          />
          <button
            type="button"
            class="absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 is-button"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- For admin -->
    <div class="flex justify-between min-w-[350px] items-center gap-4" v-if="isAdmin">
      <div class="flex-shrink-0 text-xl font-semibold">학과 선택:</div>

      <select
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        v-model="selectBoothId"
      >
        <option v-for="(booth, boothIndex) in reserveBoothList" :key="boothIndex" :value="booth.boothId">
          {{ booth.adminName }} - {{ booth.boothName }}
        </option>
      </select>
    </div>
    <!-- Table.. -->
    <div class="relative overflow-x-auto rounded-xl">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="md:text-sm lg:text-lg xl:text-2xl text-gray-700 uppercase bg-primary-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium capitalize">No.</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium capitalize">예약 번호</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">예약자</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">인원수</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">연락처</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">예약 시간</th>
            <th
              scope="col"
              colspan="2"
              class="px-6 py-3 text-center text-secondary-700-light font-medium min-w-[140px]"
            >
              예약 관리
            </th>
          </tr>
        </thead>
        <tbody class="text-xs md:text-sm lg:text-lg xl:text-2xl">
          <tr
            v-if="!isLoading"
            class="bg-white border-b text-secondary-700-light font-medium"
            v-for="(reserve, reserveIndex) in getFilteredReserveList({ type: selectOrderType })"
            :key="reserveIndex"
          >
            <th scope="row" class="px-6 py-4 whitespace-nowrap text-center">
              {{ reserveIndex + 1 }}
            </th>
            <th scope="row" class="px-6 py-4 whitespace-nowrap text-center">
              {{ reserve.reservationNum }}
            </th>
            <td class="px-6 py-4 text-center">{{ reserve.userName }}</td>
            <td class="px-6 py-4 text-center">{{ reserve.personCount }}</td>
            <td class="px-6 py-4 text-center">{{ reserve.phoneNum }}</td>
            <td class="px-6 py-4 text-center">{{ prettyDate(reserve.updateAt) }}</td>
            <td class="py-4 px-2" v-if="selectOrderType !== 'complete'">
              <div class="w-full flex justify-center">
                <button
                  class="is-button w-full text-sm xl:text-base h-8"
                  type="button"
                  @click="handleClickConfirm(reserve.reservationId)"
                >
                  확인
                </button>
              </div>
            </td>
            <td class="py-4 px-2" v-if="selectOrderType !== 'cancel'">
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="is-button w-full text-sm xl:text-base h-8 is-danger is-outlined"
                  @click="handleClickDelete(reserve.reservationId)"
                >
                  삭제
                </button>
              </div>
            </td>
            <td class="py-4 px-2" v-if="selectOrderType !== 'reserve'">
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="is-button w-full text-sm xl:text-base h-8 is-outlined"
                  @click="handleClickRestore(reserve.reservationId)"
                >
                  복구
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="isLoading">
            <td scope="col" colspan="7">
              <div class="w-full justify-center items-center flex flex-col py-10 bg-white rounded-b-[20px]">
                <IconLoading :width="464" />
                <p class="text-3xl py-4">에약 내역을 불러오는 중이에요...</p>
              </div>
            </td>
          </tr>
          <tr v-if="!isLoading && getFilteredReserveList({ type: selectOrderType }).length === 0">
            <td scope="col" colspan="7">
              <div class="w-full justify-center items-center flex flex-col py-10 bg-white rounded-b-[20px]">
                <IconNotFound :width="404" />
                <p class="text-3xl py-4">예약 내역이 없습니다.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
