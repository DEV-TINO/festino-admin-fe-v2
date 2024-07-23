<script setup>
import router from '@/router';
import { useBoothList } from '@/stores/booths/boothList';
import { useReserveList } from '@/stores/reserve/reserveList';
import { useUser } from '@/stores/user';
import { alertError } from '@/utils/api';
import { prettyDate } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watchEffect } from 'vue';

const useUserStore = useUser();
const useBoothListStore = useBoothList();
const useReserveListStore = useReserveList();

const { getAllBoothList } = useBoothListStore;
const { getReserveList, deleteReserve, confirmReserve, restoreReserve } = useReserveListStore;

const { isAdmin, userOwnBoothId } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);
const { reserveList } = storeToRefs(useReserveListStore);

const reserveBoothList = ref('');

const selectBoothId = ref('');
const selectOrderType = ref('reserve'); // reserve, cancel, complete

const interval = ref(null);

const handleClickDelete = async (reserveId) => {
  const status = await deleteReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
  });
  console.log('[TablingView] handleClickDelete status:', status);
  if (status) await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
};

const handleClickConfirm = async (reserveId) => {
  const status = await confirmReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
  });
  console.log('[TablingView] handleClickConfirm status:', status);
  if (status) await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
};

const handleClickRestore = async (reserveId) => {
  const status = await restoreReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
  });
  console.log('[TablingView] handleClickRestore status:', status);
  if (status) await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
};

const refereshReserveList = () => {
  console.log('Referesh Reserve List');
  interval.value = setInterval(async () => {
    if (!selectBoothId.value) return;
    if (!selectOrderType.value) return;
    console.log('Referesh Reserve List');
    await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
  }, 5000);
};

watchEffect(async () => {
  if (!selectBoothId.value) return;
  if (!selectOrderType.value) return;
  clearReferesh();
  refereshReserveList();
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
</script>
<template>
  <div>
    <!-- Reserve Header -->
    <!-- Reserve Category -->
    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
    <select
      id="countries"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      v-model="selectBoothId"
    >
      <option v-for="(booth, boothIndex) in reserveBoothList" :key="boothIndex" :value="booth.boothId">
        {{ booth.adminName }} - {{ booth.boothName }}
      </option>
    </select>
    <!-- Table.. -->
    <div class="relative overflow-x-auto rounded-xl">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-primary-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-2xl text-secondary-700-light font-medium">예약 번호</th>
            <th scope="col" class="px-6 py-3 text-center text-2xl text-secondary-700-light font-medium">예약자</th>
            <th scope="col" class="px-6 py-3 text-center text-2xl text-secondary-700-light font-medium">인원수</th>
            <th scope="col" class="px-6 py-3 text-center text-2xl text-secondary-700-light font-medium">연락처</th>
            <th scope="col" class="px-6 py-3 text-center text-2xl text-secondary-700-light font-medium">예약 시간</th>
            <th scope="col" colspan="2" class="px-6 py-3 text-center text-2xl text-secondary-700-light font-medium">
              예약 관리
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-xl text-secondary-700-light font-medium"
            v-for="(reserve, reserveIndex) in reserveList"
            :key="reserveIndex"
          >
            <th scope="row" class="px-6 py-4 whitespace-nowrap text-center">{{ reserveIndex + 1 }}</th>
            <td class="px-6 py-4 text-center">{{ reserve.userName }}</td>
            <td class="px-6 py-4 text-center">{{ reserve.personCount }}</td>
            <td class="px-6 py-4 text-center">{{ reserve.phoneNum }}</td>
            <td class="px-6 py-4 text-center">{{ prettyDate(reserve.updateAt) }}</td>
            <td class="py-4 px-2">
              <div class="w-full flex justify-center">
                <button
                  class="is-button w-full text-base h-8"
                  type="button"
                  @click="handleClickConfirm(reserve.reservationId)"
                >
                  확인
                </button>
              </div>
            </td>
            <td class="py-4 px-2">
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="is-button w-full text-base h-8 is-danger is-outlined"
                  @click="handleClickDelete(reserve.reservationId)"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
